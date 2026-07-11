// 🔑 Clé LIVE : ce test va déclencher un VRAI débit sur votre téléphone !
const API_KEY = "dp_live_02daffd5a441422c94917522760025aa";
const API_URL = "https://dola-pay.com/api/v1/charges";

async function testerPaiement() {
  const payload = {
    amount: 100,
    currency: "XOF",
    customer_phone: "2290157385885", // Mettez un vrai numéro MTN Bénin ici
    provider: "MTN",
    description: "Test de paiement API DolaPay"
  };

  console.log("⏳ Initiation du paiement en cours...");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur de l'API DolaPay :", data);
    } else {
      console.log("✅ Succès ! La transaction a été initiée.");
      console.log("Détails :", data);
    }
  } catch (error) {
    console.error("❌ Erreur réseau :", error);
  }
}

testerPaiement();
