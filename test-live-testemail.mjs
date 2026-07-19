const url = "https://dola-pay.com/api/public/test-email?email=dolapoecom1@gmail.com";

fetch(url)
  .then(res => res.json().then(data => ({ status: res.status, data })))
  .then(console.log)
  .catch(console.error);
