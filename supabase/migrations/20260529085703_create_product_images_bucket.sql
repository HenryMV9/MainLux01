/*
  # Create product-images storage bucket

  1. Creates the `product-images` bucket with public read access
  2. Sets storage RLS policies:
     - Public can read/view all images (so they display on the website)
     - Authenticated users (admin) can upload, update, and delete images
*/

-- Create the bucket (public = true means files are publicly accessible by URL)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880;

-- Allow public to read/download images
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Allow authenticated admin to upload images
CREATE POLICY "Authenticated can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated admin to update images
CREATE POLICY "Authenticated can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Allow authenticated admin to delete images
CREATE POLICY "Authenticated can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
