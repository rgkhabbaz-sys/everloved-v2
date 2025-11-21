import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text, voiceId } = await req.json();

        if (!process.env.ELEVENLABS_API_KEY) {
            console.warn('Missing ELEVENLABS_API_KEY - Simulation Mode');
            // Return a 200 OK with a message or empty audio to prevent client errors
            // In a real simulation, we might return a static "Hello" mp3 file here
            return new NextResponse(null, { status: 200 });
        }

        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
        const VOICE_ID = voiceId || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Default voice

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY,
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs API Error:', errorText);
            return NextResponse.json({ error: 'Voice synthesis failed' }, { status: response.status });
        }

        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('Error in voice API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
