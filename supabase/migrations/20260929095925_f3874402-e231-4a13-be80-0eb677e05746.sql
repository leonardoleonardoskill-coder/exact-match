-- Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Detail/photo policies: anon path must not call is_admin()
DROP POLICY "property_details_public_read" ON public.property_details;
CREATE POLICY "property_details_public_read" ON public.property_details FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.published = true));

DROP POLICY "vehicle_details_public_read" ON public.vehicle_details;
CREATE POLICY "vehicle_details_public_read" ON public.vehicle_details FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.published = true));

DROP POLICY "listing_photos_public_read" ON public.listing_photos;
CREATE POLICY "listing_photos_public_read" ON public.listing_photos FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.published = true));
