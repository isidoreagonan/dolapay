import { createLigdiCashPayin, LigdiCashPayinRequest } from "./src/lib/ligdicash.server";

async function runTest() {
  console.log("🚀 Lancement du test de paiement réel sur votre espace LigdiCash...");
  
  const request: LigdiCashPayinRequest = {
    amount: 500, // Montant test de 500 FCFA
    description: "Test de paiement DolaPay via LigdiCash",
    customer: {
      firstname: "Test",
      lastname: "DolaPay",
      phone: "22680000345", // Votre numéro
    },
    returnUrl: "https://dola-pay.com/success",
    callbackUrl: "https://dola-pay.com/api/public/ligdicash-webhook",
    customData: {
      transaction_id: "TEST-TX-12345",
      method: "ORANGE"
    }
  };

  try {
    const response = await createLigdiCashPayin(request);
    console.log("✅ Succès de l'API ! Voici la réponse de LigdiCash :");
    console.log(JSON.stringify(response, null, 2));

    if (response.response_code === "00" && response.response_text) {
      console.log(`\n🔗 Cliquez sur ce lien pour payer : ${response.response_text}`);
    }
  } catch (error) {
    console.error("❌ Erreur lors du test :", error);
  }
}

runTest();
