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

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Scanning file: ${file.name}, size: ${file.size} bytes`);

    // Upload file to VirusTotal
    const vtFormData = new FormData();
    vtFormData.append('file', file);

    const uploadResponse = await fetch('https://www.virustotal.com/api/v3/files', {
      method: 'POST',
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
      body: vtFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('VirusTotal upload error:', uploadResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file to VirusTotal', details: errorText }),
        { status: uploadResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const uploadData = await uploadResponse.json();
    const analysisId = uploadData.data?.id;

    if (!analysisId) {
      console.error('No analysis ID returned:', uploadData);
      return new Response(
        JSON.stringify({ error: 'No analysis ID returned from VirusTotal' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analysis started with ID: ${analysisId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysisId,
        message: 'File uploaded successfully. Use the analysis ID to check results.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scan-file function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
