-- ==========================================================================
-- SCRIPT DE RESTAURATION 100% RÉELLE DES DONNÉES LOVABLE CLOUD
-- Exporte le 2026-07-03 depuis l'ancien projet Lovable Cloud
-- ==========================================================================
-- Exécute l'intégralité de ces lignes dans ton SQL Editor Supabase :

-- 1. PROFILS RÉELS
INSERT INTO public.profiles (id, email, full_name, account_type, kyc_status, volume_limit_xof, country, created_at, updated_at) VALUES ('1e1934d4-4216-4140-98cc-0510d80e8860', 'isidoreagonan@gmail.com', 'AGONAN ISIDORE ABRAHAM', 'enterprise', 'approved', 1000000, NULL, '2026-06-25 05:09:37.196719+00', '2026-06-25 05:10:20.150922+00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, account_type = EXCLUDED.account_type, kyc_status = EXCLUDED.kyc_status;
INSERT INTO public.profiles (id, email, full_name, account_type, kyc_status, volume_limit_xof, country, created_at, updated_at) VALUES ('85a8913c-7ad2-40fc-913c-41678796ab16', 'astucegpt@gmail.com', 'AGONAN ISIDORE', 'standard', 'pending', 1000000, 'Bénin', '2026-06-25 04:11:44.973341+00', '2026-06-25 14:54:07.53157+00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, account_type = EXCLUDED.account_type, kyc_status = EXCLUDED.kyc_status;
INSERT INTO public.profiles (id, email, full_name, account_type, kyc_status, volume_limit_xof, country, created_at, updated_at) VALUES ('de03c351-094d-4b7d-a692-e10be7373f27', 'dolapoecom1@gmail.com', 'Dolapo ECOM', 'enterprise', 'approved', 1000000, NULL, '2026-06-25 04:05:29.712303+00', '2026-06-26 10:12:40.33056+00') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, account_type = EXCLUDED.account_type, kyc_status = EXCLUDED.kyc_status;

-- 2. ENTREPRISES RÉELLES
INSERT INTO public.businesses (id, profile_id, company_name, registration_number, tax_id, hq_country, created_at) VALUES ('6070fbe8-d5a4-4d59-8083-20009da24e06', 'de03c351-094d-4b7d-a692-e10be7373f27', 'E-COMMERCE', 'RB/PNO/24 A 109731', '0202113623145', 'Bénin', '2026-06-25 05:35:07.390699+00') ON CONFLICT (profile_id) DO UPDATE SET company_name = EXCLUDED.company_name;

-- 3. RÔLES ADMINISTRATEURS ET MARCHANDS
INSERT INTO public.user_roles (id, user_id, role) VALUES ('60ceb16e-62fd-487c-b497-fdcdcf1c2891', 'de03c351-094d-4b7d-a692-e10be7373f27', 'merchant') ON CONFLICT (user_id, role) DO NOTHING;
INSERT INTO public.user_roles (id, user_id, role) VALUES ('07e72233-2aab-4918-93d2-5d65793e3a90', '85a8913c-7ad2-40fc-913c-41678796ab16', 'merchant') ON CONFLICT (user_id, role) DO NOTHING;
INSERT INTO public.user_roles (id, user_id, role) VALUES ('847d7500-2485-41c5-9c69-63532d2a5189', '1e1934d4-4216-4140-98cc-0510d80e8860', 'merchant') ON CONFLICT (user_id, role) DO NOTHING;
INSERT INTO public.user_roles (id, user_id, role) VALUES ('7933de7f-bd86-4a2a-ba35-d3d23a314a53', '1e1934d4-4216-4140-98cc-0510d80e8860', 'admin') ON CONFLICT (user_id, role) DO NOTHING;

-- 4. LIENS DE PAIEMENT RÉELS
INSERT INTO public.payment_links (id, profile_id, slug, title, amount, currency, active, created_at, description) VALUES ('1785f739-408d-461b-8654-b9ae4e71adeb', 'de03c351-094d-4b7d-a692-e10be7373f27', '0c7kuttf', 'Paypal de puis l''afrique', 200.00, 'USD', true, '2026-06-26 09:46:47.427615+00', 'Comment avoir un compte apypal depuis l''afrique') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.payment_links (id, profile_id, slug, title, amount, currency, active, created_at, description) VALUES ('a0b3d1be-cf9b-4656-912a-53371d5caeaf', 'de03c351-094d-4b7d-a692-e10be7373f27', '1jva3j4q', 'ECOM', 100.00, 'XOF', true, '2026-07-02 18:47:09.038168+00', NULL) ON CONFLICT (id) DO NOTHING;
