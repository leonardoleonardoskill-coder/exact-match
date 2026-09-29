CREATE POLICY "listing_photos_read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'listing-photos');
CREATE POLICY "listing_photos_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'listing-photos' AND public.is_admin());
CREATE POLICY "listing_photos_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'listing-photos' AND public.is_admin());
CREATE POLICY "listing_photos_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'listing-photos' AND public.is_admin());
