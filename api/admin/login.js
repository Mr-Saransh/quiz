export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, password } = req.body;
  if (id === 'admin' && password === 'admin@apni123') {
    return res.status(200).json({ success: true, token: 'admin-secret-token' });
  }

  return res.status(401).json({ error: 'Invalid admin credentials' });
}
