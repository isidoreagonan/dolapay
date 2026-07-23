const https = require('https');
// ⚠️ REMPLACE CETTE CLÉ PAR TA VRAIE CLÉ SECRÈTE DOLAPAY (sk_live_... ou sk_test_...)
const DOLAPAY_API_KEY = "dp_live_93dbfb85272948cc8e3b3a323c6393ff";

// L'URL de ton API (mettre https://dola-pay.com si tu testes sur le serveur en ligne)
const BASE_URL = "https://dola-pay.com";

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDemo() {
  console.log("==================================================");
  console.log("🚀 DÉMO API DOLAPAY <-> LIGDICASH");
  console.log("==================================================\n");

  const payload = {
    amount: 100, // 100 FCFA
    currency: "XOF",
    customer_phone: "22680005738", // Numéro Burkina pour forcer LigdiCash
    provider: "Orange",
    description: "Paiement Démo LigdiCash"
  };

  console.log("1️⃣  Création du paiement via l'API DolaPay...");
  console.log("Payload envoyé :", payload);

  try {
    const res = await fetch(`${BASE_URL}/api/v1/charges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DOLAPAY_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.status !== "redirect") {
      console.error("❌ Erreur lors de la création :", data);
      return;
    }

    const txId = data.id;
    console.log("\n✅ Transaction DolaPay créée avec succès !");
    console.log("💳 ID Transaction :", txId);
    console.log("\n🔗 Lien de redirection généré par LigdiCash :");
    console.log("👉", data.redirect_url);
    console.log("\n--------------------------------------------------");
    console.log("⚠️  ACTION REQUISE : CLIQUE SUR LE LIEN CI-DESSUS ET EFFECTUE/ANNULE LE PAIEMENT");
    console.log("--------------------------------------------------\n");

    console.log("2️⃣  DolaPay écoute le statut de la transaction en temps réel...\n");

    let status = "pending";
    let attempts = 0;

    // Boucle de vérification (Polling) toutes les 3 secondes
    while (status === "pending" || status === "processing") {
      attempts++;
      process.stdout.write(`⏳ Vérification n°${attempts} du statut... `);

      const statusRes = await fetch(`${BASE_URL}/api/v1/charges/${txId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${DOLAPAY_API_KEY}`
        }
      });

      const statusData = await statusRes.json();
      status = statusData.status;

      if (status === "pending" || status === "processing") {
        console.log(`Statut actuel : ${status} (En attente du client)`);
        await delay(3000);
      } else if (status === "succeeded") {
        console.log(`\n🎉 SUCCÈS ! Le paiement a été validé par LigdiCash et le webhook a mis à jour DolaPay !`);
        console.log("Détails :", statusData);
        break;
      } else if (status === "failed") {
        console.log(`\n❌ ÉCHEC/ANNULÉ ! Le paiement a échoué ou a été annulé par le client.`);
        console.log("Détails :", statusData);
        break;
      }
    }

    console.log("\n✅ FIN DE LA DÉMO.");

  } catch (e) {
    console.error("Erreur script :", e);
  }
}

runDemo();
