async function test() {
  const loginRes = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@bcorp.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  
  const paymentsRes = await fetch('http://localhost:8080/api/v1/payments', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await paymentsRes.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
