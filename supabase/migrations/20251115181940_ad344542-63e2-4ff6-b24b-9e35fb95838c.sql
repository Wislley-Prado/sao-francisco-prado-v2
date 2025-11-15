-- Fix generated-media bucket RLS policies to restrict uploads to authenticated admins only

-- Drop existing permissive policies if they exist
DROP POLICY IF EXISTS "Allow public access to generated-media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to generated-media" ON storage.objects;

-- Create restrictive policies for generated-media bucket

-- Allow authenticated users to view files in generated-media
CREATE POLICY "Authenticated users can view generated-media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'generated-media' AND auth.role() = 'authenticated');

-- Allow only admins to upload to generated-media
CREATE POLICY "Only admins can upload to generated-media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'generated-media' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow only admins to update files in generated-media
CREATE POLICY "Only admins can update generated-media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'generated-media'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow only admins to delete files in generated-media
CREATE POLICY "Only admins can delete from generated-media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'generated-media'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);