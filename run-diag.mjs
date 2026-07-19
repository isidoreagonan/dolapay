const url = "https://dola-pay.com/api/public/test-notify?txId=latest5";

fetch(url)
  .then(res => res.json().then(data => {
    console.dir({ status: res.status, data }, { depth: null });
  }))
  .catch(console.error);
