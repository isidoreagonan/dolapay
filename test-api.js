// 🔑 Remplacez par votre clé de test générée sur le Dashboard
const API_KEY = "dp_test_90a2daec99c6440089fbe6581535dcb2"; 
const API_URL = "https://dola-pay.com/api/v1/charges";

async function testerPaiement() {
  const payload = {
    amount: 100,
    currency: "XOF",
    customer_phone: "22997000000", // Mettez un vrai numéro MTN Bénin ici
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
