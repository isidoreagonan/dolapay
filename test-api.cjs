async function run() {
  const apiKey = process.env.LIGDICASH_API_KEY;
  const authToken = process.env.LIGDICASH_AUTH_TOKEN;

  const payload = {
    commande: {
      invoice: {
        items: [{ name: "Test DolaPay", description: "Test", quantity: 1, unit_price: 200, total_price: 200 }],
        total_amount: 200,
        currency: "xof",
        description: "Test",
        customer: "22680005738",
      },
      store: { name: "DolaPay", website_url: "https://dola-pay.com" },
      actions: {
        cancel_url: "https://dola-pay.com/cancel",
        return_url: "https://dola-pay.com/success",
        callback_url: "https://dola-pay.com/webhook",
      },
      custom_data: { test: true },
    },
  };

  try {
    const res = await fetch("https://app.ligdicash.com/pay/v01/redirect/checkout-invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
        "Apikey": apiKey,
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch(e) {
    console.error("Fetch error:", e);
  }
}

run();
