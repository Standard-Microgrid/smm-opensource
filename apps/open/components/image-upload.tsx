'use client';

import React from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { UtilityPole } from 'lucide-react';

interface ImageUploadProps {
  onFileChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
}

export function ImageUpload({ onFileChange, accept = 'image/*', maxSize }: ImageUploadProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept,
    maxSize,
  });

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.name || null;

  // Stable callback reference
  const stableOnFileChange = React.useCallback(onFileChange || (() => {}), [onFileChange]);

  // Notify parent component when file changes
  React.useEffect(() => {
    stableOnFileChange(files[0] || null);
  }, [files, stableOnFileChange]);

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="inline-flex items-center gap-2 align-top">
        <div
          className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
          aria-label={previewUrl ? 'Preview of uploaded image' : 'Default user avatar'}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded image"
              width={32}
              height={32}
            />
          ) : (
            <div aria-hidden="true">
              <UtilityPole className="opacity-60" size={16} />
            </div>
          )}
        </div>
        <div className="relative inline-block">
          <Button onClick={openFileDialog} aria-haspopup="dialog">
            {fileName ? 'Change image' : 'Upload image'}
          </Button>
          <input {...getInputProps()} className="sr-only" aria-label="Upload image file" tabIndex={-1} />
        </div>
      </div>
      {fileName ? (
        <div className="inline-flex gap-2 text-xs">
          <p className="text-muted-foreground truncate" aria-live="polite">
            {fileName}
          </p>{' '}
          <button
            onClick={() => removeFile(files[0]?.id)}
            className="cursor-pointer text-destructive font-medium hover:underline"
            aria-label={`Remove ${fileName}`}
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="inline-flex gap-2 text-xs">
          <p className="text-muted-foreground truncate" aria-live="polite">
            No image attached
          </p>
        </div>
      )}
    </div>
  );
}
