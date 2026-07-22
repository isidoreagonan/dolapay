async function run() {
  // Remplacer par la clé API secrète (sk_live_...) générée depuis le tableau de bord DolaPay
  const DOLAPAY_API_KEY = "sk_test_12345"; 
  
  const payload = {
    amount: 200,
    currency: "XOF",
    customer_phone: "22680005738", // Numéro Burkina -> DolaPay va router vers LigdiCash
    provider: "Orange",
    description: "Test via DolaPay API"
  };

  try {
    // Remplacer par l'URL de production si nécessaire (ex: https://ton-domaine.com/api/v1/charges)
    const res = await fetch("http://localhost:3000/api/v1/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DOLAPAY_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    
    if (data.status === "redirect") {
      console.log("\n✅ SUCCÈS ! DolaPay a bien basculé sur LigdiCash.");
      console.log("👉 URL de paiement LigdiCash générée :", data.redirect_url);
    }
  } catch(e) {
    console.error("Fetch error:", e);
  }
}

run();
