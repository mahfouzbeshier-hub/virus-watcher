import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const VIRUSTOTAL_API_KEY = Deno.env.get('VIRUSTOTAL_API_KEY');
    if (!VIRUSTOTAL_API_KEY) {
      console.error('VIRUSTOTAL_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'VirusTotal API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { analysisId } = await req.json();

    if (!analysisId) {
      return new Response(
        JSON.stringify({ error: 'No analysis ID provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Getting analysis results for ID: ${analysisId}`);

    // Get analysis results from VirusTotal
    const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
      method: 'GET',
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('VirusTotal analysis error:', analysisResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to get analysis from VirusTotal', details: errorText }),
        { status: analysisResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisData = await analysisResponse.json();
    const attributes = analysisData.data?.attributes;

    if (!attributes) {
      return new Response(
        JSON.stringify({ error: 'Invalid analysis response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process the results
    const stats = attributes.stats || {};
    const results = attributes.results || {};
    const status = attributes.status;

    // Transform results into our format
    const engines = Object.entries(results).map(([name, result]: [string, any]) => ({
      name,
      category: result.category,
      result: result.result,
      status: result.category === 'undetected' ? 'clean' : 
              result.category === 'malicious' ? 'danger' :
              result.category === 'suspicious' ? 'warning' : 'unknown'
    }));

    const response = {
      success: true,
      status,
      stats: {
        harmless: stats.harmless || 0,
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        undetected: stats.undetected || 0,
        timeout: stats.timeout || 0,
        total: Object.values(stats).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0)
      },
      engines,
      date: attributes.date,
    };

    console.log(`Analysis complete. Status: ${status}, Malicious: ${stats.malicious}, Total: ${response.stats.total}`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-analysis function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
