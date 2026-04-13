import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let query = supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching blogs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blogs', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Blogs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs', details: error.message },
      { status: 500 }
    );
  }
}
