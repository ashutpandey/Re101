import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Unable to fetch remote URL: ${response.statusText}` });
    }

    const body = await response.text();
    res.set('Content-Type', 'application/xml');
    res.send(body);
  } catch (error) {
    console.error('Proxy fetch error:', error);
    res.status(500).json({ error: 'Remote feed fetch failed' });
  }
});

export default router;
