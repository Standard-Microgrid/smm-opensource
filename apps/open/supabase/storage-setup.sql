-- Create the grids storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'grids',
  'grids',
  true,
  10485760, -- 10MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- Create RLS policies for the grids bucket

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload grid files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'grids');

-- Allow authenticated users to view files
CREATE POLICY "Allow authenticated users to view grid files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'grids');

-- Allow authenticated users to update files (for replacing)
CREATE POLICY "Allow authenticated users to update grid files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'grids')
WITH CHECK (bucket_id = 'grids');

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete grid files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'grids');

-- Allow anonymous users to view files (for public access)
CREATE POLICY "Allow anonymous users to view grid files" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'grids');


