import { createFileRoute } from "@tanstack/react-router";
import { createClient } from '@supabase/supabase-js';

export const Route = createFileRoute("/api/webhooks/didit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: any;
        try { payload = await request.json(); } catch { return new Response("Invalid JSON", { status: 400 }); }
        
        console.log('Didit Webhook received:', JSON.stringify(payload, null, 2));

        const eventType = payload.event || payload.type || 'unknown';
        const sessionId = payload.session_id || payload.id || payload.data?.session_id || payload.data?.id;
        const status = payload.status || payload.data?.status || 'pending';
        const score = payload.score || payload.data?.score || null;
        const amlStatus = payload.aml_status || payload.data?.aml_status || 'clear';
        const livenessStatus = payload.liveness_status || payload.data?.liveness_status || 'passed';

        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

        if (!supabaseUrl || !supabaseKey) {
          console.error('Supabase credentials missing in webhook environment');
          return Response.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        if (sessionId) {
          const { data: busData } = await supabase
            .from('businesses')
            .select('id, profile_id')
            .eq('didit_session_id', sessionId)
            .maybeSingle();

          if (busData) {
            let kybStatus = 'under_review';
            if (status === 'Approved' || status === 'approved') kybStatus = 'under_review'; 
            if (status === 'Rejected' || status === 'rejected' || status === 'Declined') kybStatus = 'rejected';

            await supabase
              .from('businesses')
              .update({
                didit_status: status,
                didit_score: score,
                kyb_status: kybStatus,
                updated_at: new Date().toISOString()
              })
              .eq('id', busData.id);

            if (kybStatus === 'under_review') {
              await supabase
                .from('profiles')
                .update({ kyc_status: 'under_review' })
                .eq('id', busData.profile_id);
            }
          }

          await supabase
            .from('business_representatives')
            .update({
              didit_status: status,
              didit_score: score,
              didit_aml_status: amlStatus,
              didit_liveness_status: livenessStatus,
              didit_verified_at: new Date().toISOString()
            })
            .eq('didit_session_id', sessionId);

          await supabase
            .from('business_ubos')
            .update({
              didit_status: status,
              didit_score: score,
              didit_aml_status: amlStatus
            })
            .eq('didit_session_id', sessionId);
        }

        return Response.json({ success: true, received: true, event: eventType });
      },
      GET: async () => {
        // Return HTML if GET request (e.g. success verification redirect / review page)
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Vérification Réussie</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #065f46; color: white; text-align: center; }
              .card { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); padding: 2.5rem; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.25); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); max-width: 380px; }
              .icon { font-size: 3.5rem; margin-bottom: 1rem; }
              h1 { margin: 0 0 0.5rem 0; font-size: 1.4rem; font-weight: 700; }
              p { margin: 0; font-size: 0.9rem; opacity: 0.9; line-height: 1.4; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="icon">✓</div>
              <h1>Vérification Didit Terminée !</h1>
              <p>Vos documents et données biométriques ont été validés avec succès.</p>
              <p style="margin-top: 1.5rem; font-size: 0.8rem; opacity: 0.75;">Fermeture et validation automatique dans DolaPay...</p>
            </div>
            <script>
              if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'DIDIT_SUCCESS' }, '*');
              } else if (window.opener) {
                window.opener.postMessage({ type: 'DIDIT_SUCCESS' }, '*');
                setTimeout(() => window.close(), 1500);
              }
            </script>
          </body>
          </html>
        `, {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }
    }
  }
});
