-- ==========================================================================
-- SCRIPT SQL D'EXPORTATION DES DONNÉES DEPUIS LOVABLE CLOUD
-- ==========================================================================
-- Instructions :
-- 1. Connecte-toi à l'espace SQL Editor de ton ancien projet Lovable Cloud (wwqhjoukvimkfhlzwtqn).
-- 2. Exécute l'une des requêtes ci-dessous (ou toutes l'une après l'autre).
-- 3. Copie le texte généré dans la colonne "sql_export" des résultats.
-- 4. Colle et exécute ce texte dans le SQL Editor de ton nouveau projet Supabase (sdieqwzrggypjpkjiogg).
-- Cela transférera 100% de tes vraies données réelles !
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. EXPORT DES PROFILS (public.profiles)
-- --------------------------------------------------------------------------
SELECT 
  'INSERT INTO public.profiles (id, email, full_name, account_type, kyc_status, volume_limit_xof, country, created_at, updated_at) VALUES (' ||
  quote_literal(id) || ', ' ||
  quote_nullable(email) || ', ' ||
  quote_nullable(full_name) || ', ' ||
  quote_literal(account_type) || ', ' ||
  quote_literal(kyc_status) || ', ' ||
  COALESCE(volume_limit_xof::text, 'NULL') || ', ' ||
  quote_nullable(country) || ', ' ||
  quote_literal(created_at) || ', ' ||
  COALESCE(quote_literal(updated_at), 'now()') || 
  ') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, account_type = EXCLUDED.account_type, kyc_status = EXCLUDED.kyc_status;' AS sql_export
FROM public.profiles;

-- --------------------------------------------------------------------------
-- 2. EXPORT DES ENTREPRISES (public.businesses)
-- --------------------------------------------------------------------------
SELECT 
  'INSERT INTO public.businesses (id, profile_id, company_name, registration_number, tax_id, hq_country, created_at) VALUES (' ||
  quote_literal(id) || ', ' ||
  quote_literal(profile_id) || ', ' ||
  quote_nullable(company_name) || ', ' ||
  quote_nullable(registration_number) || ', ' ||
  quote_nullable(tax_id) || ', ' ||
  quote_nullable(hq_country) || ', ' ||
  COALESCE(quote_literal(created_at), 'now()') || 
  ') ON CONFLICT (profile_id) DO UPDATE SET company_name = EXCLUDED.company_name;' AS sql_export
FROM public.businesses;

-- --------------------------------------------------------------------------
-- 3. EXPORT DES RÔLES ADMINISTRATEURS (public.user_roles)
-- --------------------------------------------------------------------------
SELECT 
  'INSERT INTO public.user_roles (id, user_id, role) VALUES (' ||
  quote_literal(id) || ', ' ||
  quote_literal(user_id) || ', ' ||
  quote_literal(role::text) || 
  ') ON CONFLICT (user_id, role) DO NOTHING;' AS sql_export
FROM public.user_roles;

-- --------------------------------------------------------------------------
-- 4. EXPORT DES LIENS DE PAIEMENT (public.payment_links)
-- --------------------------------------------------------------------------
SELECT 
  'INSERT INTO public.payment_links (id, profile_id, slug, title, amount, currency, is_active, created_at, description) VALUES (' ||
  quote_literal(id) || ', ' ||
  quote_literal(profile_id) || ', ' ||
  quote_literal(slug) || ', ' ||
  quote_literal(title) || ', ' ||
  COALESCE(amount::text, '0') || ', ' ||
  quote_literal(COALESCE(currency, 'XOF')) || ', ' ||
  COALESCE(is_active::text, 'true') || ', ' ||
  COALESCE(quote_literal(created_at), 'now()') || ', ' ||
  quote_nullable(description) || 
  ') ON CONFLICT (id) DO NOTHING;' AS sql_export
FROM public.payment_links;

-- --------------------------------------------------------------------------
-- 5. EXPORT DES TRANSACTIONS (public.transactions)
-- --------------------------------------------------------------------------
SELECT 
  'INSERT INTO public.transactions (id, profile_id, amount, currency, status, type, description, created_at) VALUES (' ||
  quote_literal(id) || ', ' ||
  quote_literal(profile_id) || ', ' ||
  COALESCE(amount::text, '0') || ', ' ||
  quote_literal(COALESCE(currency, 'XOF')) || ', ' ||
  quote_literal(COALESCE(status, 'pending')) || ', ' ||
  quote_literal(COALESCE(type, 'pay-in')) || ', ' ||
  quote_nullable(description) || ', ' ||
  COALESCE(quote_literal(created_at), 'now()') || 
  ') ON CONFLICT (id) DO NOTHING;' AS sql_export
FROM public.transactions;
