-- Permettre à tout le monde (public) de lire une session de paiement avec son ID
-- Ceci est indispensable pour que la page de paiement s'affiche chez le client final (qui n'est pas connecté à votre dashboard)

CREATE POLICY "Anyone can view a checkout session"
    ON public.checkout_sessions FOR SELECT
    USING (true);
