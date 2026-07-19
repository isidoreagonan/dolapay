const url = "https://dola-pay.com/api/public/send-notification";
const body = {
  type: "welcome",
  email: "dolapoecom1@gmail.com",
  name: "Dola Test"
};

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
})
  .then(res => res.json().then(data => ({ status: res.status, data })))
  .then(console.log)
  .catch(console.error);
