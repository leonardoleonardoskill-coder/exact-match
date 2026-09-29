-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.listing_kind AS ENUM ('imovel', 'viatura');
CREATE TYPE public.listing_purpose AS ENUM ('venda', 'arrendamento');
CREATE TYPE public.listing_status AS ENUM ('disponivel', 'reservado', 'vendido', 'arrendado');
CREATE TYPE public.lead_source AS ENUM ('anuncio', 'formulario', 'whatsapp', 'consultor');
CREATE TYPE public.lead_status AS ENUM ('novo', 'em_contacto', 'fechado', 'perdido');

-- UPDATED_AT HELPER
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());

-- LOCATIONS
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province TEXT NOT NULL,
  municipality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (province, municipality)
);
GRANT SELECT ON public.locations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "locations_public_read" ON public.locations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "locations_admin_write" ON public.locations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.locations (province) VALUES
  ('Bengo'), ('Benguela'), ('Bié'), ('Cabinda'), ('Cuando'), ('Cubango'),
  ('Cuanza Norte'), ('Cuanza Sul'), ('Cunene'), ('Huambo'), ('Huíla'),
  ('Icolo e Bengo'), ('Luanda'), ('Lunda Norte'), ('Lunda Sul'), ('Malanje'),
  ('Moxico'), ('Moxico Leste'), ('Namibe'), ('Uíge'), ('Zaire');

-- CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.listing_kind NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories_admin_write" ON public.categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.categories (kind, name, slug, sort_order) VALUES
  ('imovel', 'Apartamento', 'apartamento', 1),
  ('imovel', 'Vivenda', 'vivenda', 2),
  ('imovel', 'Terreno', 'terreno', 3),
  ('imovel', 'Espaço comercial', 'espaco-comercial', 4),
  ('imovel', 'Armazém', 'armazem', 5),
  ('viatura', 'Ligeiro', 'ligeiro', 1),
  ('viatura', 'SUV', 'suv', 2),
  ('viatura', 'Pick-up', 'pick-up', 3),
  ('viatura', 'Carrinha', 'carrinha', 4),
  ('viatura', 'Pesado', 'pesado', 5);

-- LISTINGS
CREATE SEQUENCE public.listing_reference_seq;

CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.listing_kind NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  purpose public.listing_purpose NOT NULL DEFAULT 'venda',
  price NUMERIC(14,2),
  currency TEXT NOT NULL DEFAULT 'AOA',
  price_on_request BOOLEAN NOT NULL DEFAULT false,
  status public.listing_status NOT NULL DEFAULT 'disponivel',
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  address_note TEXT,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.listings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listings_public_read" ON public.listings FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "listings_admin_read" ON public.listings FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "listings_admin_write" ON public.listings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX listings_kind_published_idx ON public.listings (kind, published, status);
CREATE INDEX listings_location_idx ON public.listings (location_id);

CREATE OR REPLACE FUNCTION public.set_listing_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.reference IS NULL OR NEW.reference = '' THEN
    NEW.reference := CASE WHEN NEW.kind = 'imovel' THEN 'IM-' ELSE 'VT-' END
      || lpad(nextval('public.listing_reference_seq')::text, 4, '0');
  END IF;
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(NEW.reference);
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER listings_set_reference BEFORE INSERT ON public.listings FOR EACH ROW EXECUTE FUNCTION public.set_listing_reference();

-- PROPERTY DETAILS
CREATE TABLE public.property_details (
  listing_id UUID PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm NUMERIC(10,2),
  floor TEXT,
  condominium BOOLEAN NOT NULL DEFAULT false,
  condition TEXT,
  has_garage BOOLEAN NOT NULL DEFAULT false
);
GRANT SELECT ON public.property_details TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.property_details TO authenticated;
GRANT ALL ON public.property_details TO service_role;
ALTER TABLE public.property_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "property_details_public_read" ON public.property_details FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND (l.published = true OR public.is_admin())));
CREATE POLICY "property_details_admin_write" ON public.property_details FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- VEHICLE DETAILS
CREATE TABLE public.vehicle_details (
  listing_id UUID PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE,
  brand TEXT,
  model TEXT,
  year INTEGER,
  mileage_km INTEGER,
  fuel TEXT,
  transmission TEXT,
  color TEXT,
  seats INTEGER
);
GRANT SELECT ON public.vehicle_details TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.vehicle_details TO authenticated;
GRANT ALL ON public.vehicle_details TO service_role;
ALTER TABLE public.vehicle_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicle_details_public_read" ON public.vehicle_details FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND (l.published = true OR public.is_admin())));
CREATE POLICY "vehicle_details_admin_write" ON public.vehicle_details FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- LISTING PHOTOS
CREATE TABLE public.listing_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.listing_photos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listing_photos TO authenticated;
GRANT ALL ON public.listing_photos TO service_role;
ALTER TABLE public.listing_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listing_photos_public_read" ON public.listing_photos FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND (l.published = true OR public.is_admin())));
CREATE POLICY "listing_photos_admin_write" ON public.listing_photos FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX listing_photos_listing_idx ON public.listing_photos (listing_id, sort_order);

-- LEADS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  source public.lead_source NOT NULL DEFAULT 'formulario',
  status public.lead_status NOT NULL DEFAULT 'novo',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "leads_admin_read" ON public.leads FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "leads_admin_update" ON public.leads FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "leads_admin_delete" ON public.leads FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SETTINGS
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings_admin_write" ON public.settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.settings (key, value) VALUES
  ('consultant_name', 'Leonardo Jimi'),
  ('consultant_role', 'Consultor de intermediação'),
  ('whatsapp_number', ''),
  ('contact_email', ''),
  ('contact_phone', ''),
  ('about_text', ''),
  ('consultant_bio', '');
