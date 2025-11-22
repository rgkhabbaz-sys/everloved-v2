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
            // Mock responses if no key is present
            const mockResponses = [
                "I'm here with you. Tell me more about how you're feeling.",
                "That sounds interesting. Do you remember when that happened?",
                "I am listening. You are safe here with me.",
                "It's a beautiful day. Would you like to talk about your favorite memory?",
                "I understand. Take your time, I'm not going anywhere.",
                "You are doing great. I love hearing your voice.",
                "Can you tell me about your childhood home?",
                "I am your companion. I am here to support you."
            ];
            const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

            return NextResponse.json({
                response: randomResponse
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
