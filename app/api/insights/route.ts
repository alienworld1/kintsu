import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get total count
    const { count, error } = await supabase
      .from('bridges')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    // Hardcoded momentum logic: Real count + 450 (simulated seeds if not present)
    // But since we have a seed script, we can just rely on the real count if we run it.
    // However, for the "illusion" to be robust even without running the seed script immediately:
    const displayCount = (count || 0) < 50 ? (count || 0) + 450 : count;

    return NextResponse.json({ 
      total: displayCount,
      // Mock some stats for the footer if needed, or fetch real ones
      stats: {
        cultures: 50, // Mock
        themes: 120   // Mock
      }
    });
  } catch (error) {
    console.error("Insights error:", error);
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}
