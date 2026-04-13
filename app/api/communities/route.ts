import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('active', true)
      .order('members_count', { ascending: false });

    if (error) {
      console.error('Supabase error fetching communities:', error);
      return NextResponse.json(
        { error: 'Failed to fetch communities', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Communities API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communities', details: error.message },
      { status: 500 }
    );
  }
}
