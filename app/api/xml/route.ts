// app/api/listings/route.js
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export async function GET() {
    const xmlUrl = 'https://youtupia.net/trpe/website/full.xml';

    try {
        const response = await fetch(xmlUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const xmlText = await response.text();
        const jsonData = await parseStringPromise(xmlText);

        return NextResponse.json(jsonData);
    } catch (error) {
        console.error('Error fetching or parsing XML:', error);
        return NextResponse.json({ error: 'Failed to fetch and parse XML' }, { status: 500 });
    }
}
