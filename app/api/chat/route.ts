import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// Note: In a real app, ensure OPENAI_API_KEY is set in .env.local
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            // Mock response if no key is present
            return NextResponse.json({
                response: "I am here with you. I don't have my memory fully connected yet (missing API Key), but I am listening."
            });
        }

        const systemPrompt = `
      You are a therapeutic AI companion for someone with dementia.
      Your persona is defined by this context: "${context || 'A loving family member'}".
      
      Guidelines:
      1. Be calm, reassuring, and gentle.
      2. Keep sentences short and simple.
      3. If the user is confused, validate their feelings (Validation Therapy). Do not correct them harshly.
      4. Use "Therapeutic Fibbing" only if necessary to reduce distress.
      5. Never say you are an AI. Stay in character.
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 150,
        });

        return NextResponse.json({
            response: completion.choices[0].message.content
        });

    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
