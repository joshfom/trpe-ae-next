import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/actions/auth-session';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        
        return NextResponse.json({
            user: session?.user ?? null,
            authenticated: !!session
        });
    } catch (error) {
        return NextResponse.json({
            user: null,
            authenticated: false
        }, { status: 401 });
    }
}
