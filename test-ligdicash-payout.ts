import { createLigdiCashPayout, LigdiCashPayoutRequest } from "./src/lib/ligdicash.server";

async function runTest() {
  console.log("🚀 Lancement du test de Décaissement (Payout) sur votre espace LigdiCash...");
  
  const request: LigdiCashPayoutRequest = {
    amount: 500, // Montant test de 500 FCFA
    description: "Test de Payout DolaPay via LigdiCash",
    recipient: {
      firstname: "Test",
      lastname: "DolaPay",
      phone: "22680000345", // Votre numéro
    },
    method: "ORANGE",
    customData: {
      transaction_id: "TEST-PAYOUT-12345",
    }
  };

  try {
    const response = await createLigdiCashPayout(request);
    console.log("✅ Succès de l'API ! Voici la réponse de LigdiCash (Payout) :");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("❌ Erreur lors du test de Payout :", error);
  }
}

runTest();
