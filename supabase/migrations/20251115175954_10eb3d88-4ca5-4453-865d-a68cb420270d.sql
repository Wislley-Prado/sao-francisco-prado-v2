-- Storage policies for ranchos bucket
-- Allow admins to upload images
CREATE POLICY "Admins can upload rancho images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ranchos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update rancho images
CREATE POLICY "Admins can update rancho images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ranchos' 
  AND has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'ranchos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete rancho images
CREATE POLICY "Admins can delete rancho images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ranchos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Public can view rancho images (already public bucket)
CREATE POLICY "Anyone can view rancho images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'ranchos');