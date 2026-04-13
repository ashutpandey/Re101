import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let query = supabase
      .from('tools')
      .select('*')
      .order('rating', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching tools:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tools', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Tools API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools', details: error.message },
      { status: 500 }
    );
  }
}
