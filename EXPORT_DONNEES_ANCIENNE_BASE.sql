-- ==========================================================================
-- SCRIPT SQL D'EXPORTATION COMPLÈTE EN UNE SEULE REQUÊTE
-- ==========================================================================
-- Instructions :
-- 1. Connecte-toi à l'espace SQL Editor de ton ancien projet (base de données d'origine).
-- 2. Copie et exécute LA REQUÊTE UNIQUE ci-dessous.
-- 3. Elle va te donner toutes les lignes d'insertion pour l'ensemble de ta base de données
--    dans le bon ordre (profils -> entreprises -> rôles -> liens -> transactions).
-- 4. Copie toute la colonne de résultats et colle-la dans ton nouveau Supabase (sdieqwzrggypjpkjiogg).
-- ==========================================================================

SELECT sql_export FROM (
  -- 1. PROFILS
  SELECT 1 AS ordre,
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
  FROM public.profiles

  UNION ALL

  -- 2. ENTREPRISES
  SELECT 2 AS ordre,
    'INSERT INTO public.businesses (id, profile_id, company_name, registration_number, tax_id, hq_country, created_at) VALUES (' ||
    quote_literal(id) || ', ' ||
    quote_literal(profile_id) || ', ' ||
    quote_nullable(company_name) || ', ' ||
    quote_nullable(registration_number) || ', ' ||
    quote_nullable(tax_id) || ', ' ||
    quote_nullable(hq_country) || ', ' ||
    COALESCE(quote_literal(created_at), 'now()') || 
    ') ON CONFLICT (profile_id) DO UPDATE SET company_name = EXCLUDED.company_name;' AS sql_export
  FROM public.businesses

  UNION ALL

  -- 3. RÔLES ADMINISTRATEURS
  SELECT 3 AS ordre,
    'INSERT INTO public.user_roles (id, user_id, role) VALUES (' ||
    quote_literal(id) || ', ' ||
    quote_literal(user_id) || ', ' ||
    quote_literal(role::text) || 
    ') ON CONFLICT (user_id, role) DO NOTHING;' AS sql_export
  FROM public.user_roles

  UNION ALL

  -- 4. LIENS DE PAIEMENT
  SELECT 4 AS ordre,
    'INSERT INTO public.payment_links (id, profile_id, slug, title, amount, currency, active, created_at, description) VALUES (' ||
    quote_literal(id) || ', ' ||
    quote_literal(profile_id) || ', ' ||
    quote_literal(slug) || ', ' ||
    quote_literal(title) || ', ' ||
    COALESCE(amount::text, '0') || ', ' ||
    quote_literal(COALESCE(currency, 'XOF')) || ', ' ||
    COALESCE(active::text, 'true') || ', ' ||
    COALESCE(quote_literal(created_at), 'now()') || ', ' ||
    quote_nullable(description) || 
    ') ON CONFLICT (id) DO NOTHING;' AS sql_export
  FROM public.payment_links

  UNION ALL

  -- 5. TRANSACTIONS
  SELECT 5 AS ordre,
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
  FROM public.transactions
) AS export_complet
ORDER BY ordre;
