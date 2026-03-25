// Netlify Function — proxies requests to the UK Bus Open Data Service (BODS)
// The BODS_API_KEY environment variable is set in Netlify's dashboard (never in code)

export default async (req, context) => {
  // Only allow GET
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.BODS_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get atcocode from query string e.g. /api/departures?atco=370023654
  const url = new URL(req.url);
  const atco = url.searchParams.get('atco');
  if (!atco) {
    return new Response(JSON.stringify({ error: 'Missing atco parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate atco looks reasonable (alphanumeric, max 16 chars)
  if (!/^[A-Za-z0-9]{1,16}$/.test(atco)) {
    return new Response(JSON.stringify({ error: 'Invalid atco code' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const bodsUrl = `https://data.bus-data.dft.gov.uk/api/v1/datafeed/?atcocode=${atco}&api_key=${apiKey}`;
    const bodsRes = await fetch(bodsUrl);

    if (!bodsRes.ok) {
      return new Response(JSON.stringify({ error: `BODS returned ${bodsRes.status}` }), {
        status: bodsRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const xml = await bodsRes.text();

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-cache, no-store',
        // Only allow requests from your own site
        'Access-Control-Allow-Origin': process.env.URL || '*',
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from BODS' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/departures'
};
