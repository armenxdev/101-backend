const axios = require('axios');

const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

const getCredentials = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  if (!clientId || !secret) {
    throw new Error('PayPal credentials missing!');
  }
  return { clientId, secret };
};

async function getAccessToken() {
  const { clientId, secret } = getCredentials();
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const { data } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return data.access_token;
}

async function verifyOrder(orderID) {
  if (!orderID) throw new Error('orderID is required');

  const token = await getAccessToken();

  const { data } = await axios.get(`${PAYPAL_API}/v2/checkout/orders/${orderID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}

module.exports = { verifyOrder };
