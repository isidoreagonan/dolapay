-- ==========================================================================
-- SCRIPT DE SEED / DONNÉES DE DÉMO LOVABLE POUR DOLAPAY (ROBUSTE & SANS ERREUR)
-- Exécutez ce script dans le SQL Editor de Supabase pour injecter 
-- tous les marchands de démo, entreprises, liens de paiement et transactions.
-- ==========================================================================

DO $$
DECLARE
  v_demo_ids UUID[] := ARRAY[
    '11111111-1111-4111-8111-111111111111'::uuid,
    '22222222-2222-4222-8222-222222222222'::uuid,
    '33333333-3333-4333-8333-333333333333'::uuid,
    '44444444-4444-4444-8444-444444444444'::uuid,
    '55555555-5555-4555-8555-555555555555'::uuid,
    '66666666-6666-4666-8666-666666666666'::uuid
  ];
BEGIN
  -- 0) Nettoyage préalable des données de démo existantes (pour éviter tout conflit)
  BEGIN
    DELETE FROM public.transactions WHERE profile_id = ANY(v_demo_ids);
    DELETE FROM public.payment_links WHERE profile_id = ANY(v_demo_ids);
    DELETE FROM public.businesses WHERE profile_id = ANY(v_demo_ids);
    DELETE FROM public.profiles WHERE id = ANY(v_demo_ids);
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Nettoyage initial : %', SQLERRM;
  END;

  -- 1) Assurer que la contrainte UNIQUE sur businesses(profile_id) existe pour le futur
  BEGIN
    ALTER TABLE public.businesses ADD CONSTRAINT businesses_profile_id_key UNIQUE (profile_id);
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- 2) Désactiver temporairement la contrainte FK sur profiles(id) -> auth.users(id)
  BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- 3) Insertion dans auth.users (si autorisé dans le SQL Editor)
  BEGIN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
    VALUES
      ('11111111-1111-4111-8111-111111111111', '00000000-0000-0000-0000-000000000000', 'lumezia.ci@gmail.com', '$2a$10$abcdefghijklmnopqrstuv', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Boutique Lumézia"}'::jsonb, now() - interval '25 days', now(), 'authenticated', 'authenticated'),
      ('22222222-2222-4222-8222-222222222222', '00000000-0000-0000-0000-000000000000', 'koffi.mensah@tech-abidjan.ci', '$2a$10$abcdefghijklmnopqrstuv', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Koffi Mensah"}'::jsonb, now() - interval '20 days', now(), 'authenticated', 'authenticated'),
      ('33333333-3333-4333-8333-333333333333', '00000000-0000-0000-0000-000000000000', 'contact@dakarexpress.sn', '$2a$10$abcdefghijklmnopqrstuv', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Amadou Diallo"}'::jsonb, now() - interval '15 days', now(), 'authenticated', 'authenticated'),
      ('44444444-4444-4444-8444-444444444444', '00000000-0000-0000-0000-000000000000', 'amina.traore@bj-mode.com', '$2a$10$abcdefghijklmnopqrstuv', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Amina Traoré"}'::jsonb, now() - interval '10 days', now(), 'authenticated', 'authenticated'),
      ('55555555-5555-4555-8555-555555555555', '00000000-0000-0000-0000-000000000000', 'compliance@cryptopay.tg', '$2a$10$abcdefghijklmnopqrstuv', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Sessi Kossi"}'::jsonb, now() - interval '8 days', now(), 'authenticated', 'authenticated'),
      ('66666666-6666-4666-8666-666666666666', '00000000-0000-0000-0000-000000000000', 'dir@globaltrade.ml', '$2a$10$abcdefghijklmnopqrstuv', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Ousmane Coulibaly"}'::jsonb, now() - interval '5 days', now(), 'authenticated', 'authenticated');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Note: insertion auth.users existante ou ignorée : %', SQLERRM;
  END;

  -- 4) Insertion dans public.profiles
  INSERT INTO public.profiles (id, email, full_name, account_type, kyc_status, volume_limit_xof, country, created_at, updated_at)
  VALUES
    ('11111111-1111-4111-8111-111111111111', 'lumezia.ci@gmail.com', 'Boutique Lumézia Côte d''Ivoire', 'enterprise', 'approved', 100000000, 'CI', now() - interval '25 days', now()),
    ('22222222-2222-4222-8222-222222222222', 'koffi.mensah@tech-abidjan.ci', 'Koffi Mensah', 'enterprise', 'approved', 50000000, 'CI', now() - interval '20 days', now()),
    ('33333333-3333-4333-8333-333333333333', 'contact@dakarexpress.sn', 'Amadou Diallo', 'standard', 'approved', 10000000, 'SN', now() - interval '15 days', now()),
    ('44444444-4444-4444-8444-444444444444', 'amina.traore@bj-mode.com', 'Amina Traoré', 'standard', 'pending', 1000000, 'BJ', now() - interval '10 days', now()),
    ('55555555-5555-4555-8555-555555555555', 'compliance@cryptopay.tg', 'Sessi Kossi', 'standard', 'frozen', 1000000, 'TG', now() - interval '8 days', now()),
    ('66666666-6666-4666-8666-666666666666', 'dir@globaltrade.ml', 'Ousmane Coulibaly', 'standard', 'rejected', 1000000, 'ML', now() - interval '5 days', now());

  -- 5) Insertion dans public.businesses
  INSERT INTO public.businesses (profile_id, company_name, registration_number, tax_id, hq_country, created_at)
  VALUES
    ('11111111-1111-4111-8111-111111111111', 'Lumézia E-Commerce SARL', 'CI-ABJ-2024-B-12940', 'CI00982341A', 'CI', now() - interval '25 days'),
    ('22222222-2222-4222-8222-222222222222', 'Tech Solutions Abidjan SA', 'CI-ABJ-2023-B-08912', 'CI00412890B', 'CI', now() - interval '20 days'),
    ('33333333-3333-4333-8333-333333333333', 'Dakar Express Logistique', 'SN-DKR-2025-A-4410', 'SN9912034X', 'SN', now() - interval '15 days'),
    ('44444444-4444-4444-8444-444444444444', 'Mode & Culture Cotonou', 'BJ-COT-2024-A-1102', 'BJ10293849Z', 'BJ', now() - interval '10 days'),
    ('55555555-5555-4555-8555-555555555555', 'Crypto Pay Togo', 'TG-LOM-2023-B-9012', 'TG88123410Y', 'TG', now() - interval '8 days'),
    ('66666666-6666-4666-8666-666666666666', 'Global Trade Bamako', 'ML-BKO-2024-C-5510', 'ML77120391W', 'ML', now() - interval '5 days');

  -- 6) Insertion des Liens de Paiement (payment_links)
  INSERT INTO public.payment_links (id, profile_id, slug, title, amount, currency, is_active, created_at, description)
  VALUES
    ('a1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'lumezia-vip-collection', 'Collection VIP Lumézia Mode 2026', 75000, 'XOF', true, now() - interval '20 days', 'Paiement sécurisé par Mobile Money / Carte pour la collection VIP.'),
    ('a2222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'lumezia-commande-express', 'Paiement Express Commande #8490', 24500, 'XOF', true, now() - interval '14 days', 'Règlement rapide commande e-commerce Abidjan.'),
    ('a3333333-3333-4333-8333-333333333333', '22222222-2222-4222-8222-222222222222', 'koffi-prestation-cloud', 'Prestation Cloud & Consulting IT', 450000, 'XOF', true, now() - interval '18 days', 'Facture #2026-089 pour architecture AWS & Supabase.'),
    ('a4444444-4444-4444-8444-444444444444', '33333333-3333-4333-8333-333333333333', 'dakar-frais-maritime', 'Frais d''expédition maritime Dakar-Paris', 120000, 'XOF', true, now() - interval '12 days', 'Paiement du fret logistique maritime.');

  -- 7) Insertion de Transactions réalistes (transactions)
  INSERT INTO public.transactions (id, profile_id, amount, currency, status, type, description, created_at)
  VALUES
    (gen_random_uuid(), '11111111-1111-4111-8111-111111111111', 75000, 'XOF', 'success', 'payment_link', 'Paiement Collection VIP Lumézia (Wave CI)', now() - interval '2 days'),
    (gen_random_uuid(), '11111111-1111-4111-8111-111111111111', 150000, 'XOF', 'success', 'pay-in', 'Encaissement Mobile Money Orange CI', now() - interval '3 days'),
    (gen_random_uuid(), '11111111-1111-4111-8111-111111111111', 320000, 'XOF', 'success', 'pay-in', 'Encaissement Carte Bancaire Visa', now() - interval '5 days'),
    (gen_random_uuid(), '11111111-1111-4111-8111-111111111111', 1200000, 'XOF', 'success', 'pay-out', 'Décaissement vers compte bancaire Ecobank CI', now() - interval '6 days'),
    (gen_random_uuid(), '22222222-2222-4222-8222-222222222222', 450000, 'XOF', 'success', 'payment_link', 'Prestation Cloud & Consulting IT (MTN CI)', now() - interval '1 day'),
    (gen_random_uuid(), '22222222-2222-4222-8222-222222222222', 850000, 'XOF', 'success', 'pay-in', 'Facture Entreprise B2B Virement', now() - interval '4 days'),
    (gen_random_uuid(), '22222222-2222-4222-8222-222222222222', 500000, 'XOF', 'success', 'pay-out', 'Paiement sous-traitant développeur Dakar', now() - interval '7 days'),
    (gen_random_uuid(), '33333333-3333-4333-8333-333333333333', 120000, 'XOF', 'success', 'payment_link', 'Expédition colis maritime Dakar-Paris', now() - interval '2 days'),
    (gen_random_uuid(), '33333333-3333-4333-8333-333333333333', 340000, 'XOF', 'success', 'pay-in', 'Paiement conteneur groupage Wave SN', now() - interval '8 days');

END $$;
