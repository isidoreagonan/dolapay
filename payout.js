// payout.js
// Compatible avec le fetch natif de Node 18, 20 et 24+

async function effectuerRetrait() {
  const apiKey = "dp_live_7794c684bc7d417e85e706a989f208cb";
  const url = "https://dola-pay.com/api/v1/payouts";

  const payload = {
    amount: 100,                       // Montant à retirer en FCFA (ex: 100 FCFA)
    currency: "XOF",
    recipient_phone: "+2290157385885", // Numéro MTN Bénin
    provider: "MTN",                   // Opérateur MTN Bénin
    reference: "Retrait API VSCode #001"
  };

  console.log("🚀 Lancement du décaissement vers MTN Bénin (+229 0157385885)...");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Décaissement initié avec succès !");
      console.log("Détails :", JSON.stringify(data, null, 2));
    } else {
      console.error("❌ Erreur lors du décaissement :", response.status, data);
    }
  } catch (error) {
    console.error("❌ Erreur réseau :", error);
  }
}

effectuerRetrait();
