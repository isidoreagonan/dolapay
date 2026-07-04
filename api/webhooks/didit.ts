import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
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
      return res.status(500).json({ error: 'Database configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Mettre à jour la table businesses si le session_id correspond
    if (sessionId) {
      const { data: busData } = await supabase
        .from('businesses')
        .select('id, profile_id')
        .eq('didit_session_id', sessionId)
        .maybeSingle();

      if (busData) {
        let kybStatus = 'under_review';
        // SÉCURITÉ LÉGALE : Même si Didit approuve (Approved), le dossier passe en "under_review" 
        // pour laisser l'obligation légale des 24h d'audit à l'Administrateur DolaPay !
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

      // 2. Mettre à jour business_representatives si le session_id correspond
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

      // 3. Mettre à jour business_ubos si le session_id correspond
      await supabase
        .from('business_ubos')
        .update({
          didit_status: status,
          didit_score: score,
          didit_aml_status: amlStatus
        })
        .eq('didit_session_id', sessionId);
    }

    return res.status(200).json({ success: true, received: true, event: eventType });
  } catch (error: any) {
    console.error('Error processing Didit webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}
