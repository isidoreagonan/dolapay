-- Ajout du type enum pour le rôle (optionnel mais plus robuste)
-- CREATE TYPE user_role AS ENUM ('user', 'manager', 'admin');

-- Ajouter la colonne role à la table profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Mettre à jour les politiques de sécurité (RLS) pour permettre aux admins/managers de voir les autres profils
CREATE POLICY "Admins and managers can view all profiles"
ON public.profiles
FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
);

-- Mettre à jour l'admin principal (à remplacer par votre email si différent)
UPDATE public.profiles SET role = 'admin' WHERE email = 'isidoreagonan@gmail.com';
