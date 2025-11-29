import { supabase } from "@/integrations/supabase/client";

export interface ScanEngine {
  name: string;
  category: string;
  result: string | null;
  status: 'clean' | 'danger' | 'warning' | 'unknown' | 'scanning';
}

export interface ScanStats {
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
  timeout: number;
  total: number;
}

export interface ScanResult {
  success: boolean;
  status: string;
  stats: ScanStats;
  engines: ScanEngine[];
  date: number;
  error?: string;
}

export async function scanFile(file: File): Promise<{ analysisId?: string; error?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-file`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    return { error: data.error || 'Failed to scan file' };
  }

  return { analysisId: data.analysisId };
}

export async function scanUrl(url: string): Promise<{ analysisId?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('scan-url', {
    body: { url },
  });

  if (error) {
    return { error: error.message };
  }

  return { analysisId: data.analysisId };
}

export async function getAnalysisResults(analysisId: string): Promise<ScanResult> {
  const { data, error } = await supabase.functions.invoke('get-analysis', {
    body: { analysisId },
  });

  if (error) {
    return {
      success: false,
      status: 'error',
      stats: { harmless: 0, malicious: 0, suspicious: 0, undetected: 0, timeout: 0, total: 0 },
      engines: [],
      date: Date.now(),
      error: error.message,
    };
  }

  return data;
}

export async function pollAnalysisResults(
  analysisId: string,
  onUpdate: (result: ScanResult) => void,
  maxAttempts = 30,
  intervalMs = 2000
): Promise<ScanResult> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const result = await getAnalysisResults(analysisId);
    onUpdate(result);

    if (result.status === 'completed' || result.error) {
      return result;
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, intervalMs));
    attempts++;
  }

  return {
    success: false,
    status: 'timeout',
    stats: { harmless: 0, malicious: 0, suspicious: 0, undetected: 0, timeout: 0, total: 0 },
    engines: [],
    date: Date.now(),
    error: 'Analysis timed out',
  };
}
