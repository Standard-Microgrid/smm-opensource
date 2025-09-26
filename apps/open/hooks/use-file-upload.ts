import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

interface UseFileUploadOptions {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
}

interface UseFileUploadReturn {
  files: FileWithPreview[];
  openFileDialog: () => void;
  getInputProps: () => {
    type: string;
    accept?: string;
    multiple?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    style: { display: string };
  };
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
}

export function useFileUpload({
  accept,
  multiple = false,
  maxFiles = 1,
  maxSize,
}: UseFileUploadOptions = {}): [UseFileUploadReturn, UseFileUploadReturn] {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const generateFileId = useCallback(() => Math.random().toString(36).substr(2, 9), []);

  const compressImage = useCallback(async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) {
      return file;
    }

    try {
      const options = {
        maxSizeMB: 0.5, // Compress to 500KB max
        maxWidthOrHeight: 400, // Max width (height will be calculated to maintain aspect ratio)
        useWebWorker: true,
        quality: 0.85, // 85% quality
      };
      
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch {
      return file; // Return original file if compression fails
    }
  }, []);

  const createFileWithPreview = useCallback(async (file: File): Promise<FileWithPreview> => {
    // Compress image if it's an image file
    const processedFile = await compressImage(file);
    
    const fileWithPreview = processedFile as FileWithPreview;
    fileWithPreview.id = generateFileId();
    
    // Create preview URL for images
    if (processedFile.type.startsWith('image/')) {
      fileWithPreview.preview = URL.createObjectURL(processedFile);
    }
    
    return fileWithPreview;
  }, [generateFileId, compressImage]);

  const validateFile = useCallback((file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    
    // Validate file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          // File extension check
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else if (type.includes('*')) {
          // MIME type wildcard check
          const baseType = type.replace('*', '');
          return file.type.startsWith(baseType);
        } else {
          // Exact MIME type check
          return file.type === type;
        }
      });
      
      if (!isValidType) {
        return `File type not allowed. Accepted types: ${accept}`;
      }
    }
    
    return null;
  }, [maxSize, accept]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (selectedFiles.length === 0) return;

    // Validate files first
    const validFiles: File[] = [];
    const errors: string[] = [];

    selectedFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      // File validation errors - could show to user if needed
    }

    if (validFiles.length > 0) {
      // Process files (compress images)
      const processedFiles: FileWithPreview[] = [];
      
      for (const file of validFiles) {
        try {
          const processedFile = await createFileWithPreview(file);
          processedFiles.push(processedFile);
        } catch {
          // Error processing file - continue with other files
        }
      }

      if (processedFiles.length > 0) {
        setFiles((prevFiles) => {
          if (multiple) {
            const newFiles = [...prevFiles, ...processedFiles];
            return newFiles.slice(0, maxFiles);
          } else {
            return processedFiles.slice(0, 1);
          }
        });
      }
    }

    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  }, [maxSize, maxFiles, multiple, validateFile, createFileWithPreview]);

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept || '';
    input.multiple = multiple;
    input.onchange = async (e) => {
      const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleFileChange(event);
      // Reset the input value after processing
      input.value = '';
    };
    input.click();
  }, [accept, multiple, handleFileChange]);

  const getInputProps = useCallback(() => ({
    type: 'file',
    accept,
    multiple,
    onChange: handleFileChange,
    style: { display: 'none' },
  }), [accept, multiple, handleFileChange]);

  const removeFile = useCallback((fileId: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter(f => f.id !== fileId);
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  const returnValue: UseFileUploadReturn = {
    files,
    openFileDialog,
    getInputProps,
    removeFile,
    clearFiles,
  };

  return [returnValue, returnValue];
}
