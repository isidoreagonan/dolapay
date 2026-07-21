// Fichier de test: test-checkout.js
// Ce script simule le backend d'un marchand (par ex: une boutique e-commerce)

const TEST_API_KEY = "dp_live_93dbfb85272948cc8e3b3a323c6393ff"; // 🔴 Mets ta vraie clé ici
const API_URL = "https://dola-pay.com/api/v1/checkout/sessions";

async function createCheckoutSession() {
  console.log("🚀 Création de la session de paiement DolaPay...");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TEST_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: 5000,
        currency: "XOF",
        success_url: "https://dola-pay.com", // Redirection après succès
        cancel_url: "https://dola-pay.com", // Redirection si annulé
        client_reference_id: "COMMANDE_999", // ID de la commande sur ton site
        customer_name: "Jean Dupont" // Optionnel
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur de l'API:", data);
      return;
    }

    console.log("✅ Session créée avec succès !");
    console.log("==========================================");
    console.log("🔗 ID de session :", data.id);
    console.log("🌐 URL de paiement à ouvrir dans ton navigateur :");
    console.log(data.url);
    console.log("==========================================");

  } catch (error) {
    console.error("❌ Erreur de connexion:", error.message);
  }
}

createCheckoutSession();
