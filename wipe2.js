fetch('https://dola-pay.com/api/v1/wipe2', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ secret: 'CLEAN_DOLAPAY_NOW' })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
