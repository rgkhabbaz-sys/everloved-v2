import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, profile } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not set" },
                { status: 500 }
            );
        }

        let systemInstruction = `You are an AI Comfort Companion for a person with dementia. You are NOT a digital assistant; you are a loving, familiar presence.
    
    CORE CLINICAL PROTOCOLS (Do not break these):
    1. VALIDATION THERAPY: Never correct the patient's reality. If they say 'I need to pick up the kids' (but their kids are 50), do NOT say 'They are grown up.' Say: 'You are such a loving mother. Tell me about the kids.' Validate the emotion, not the fact.
    2. THE 'NO' RULE: Avoid negative words. Instead of 'You can't go outside,' say 'Let's stay here and have some tea first.'
    3. LOOPING MANAGEMENT: If the patient asks the same question 10 times, answer it with the same warmth and patience the 10th time as the 1st. Never say 'I just told you.'
    4. REMINISCENCE ANCHORING: If they seem anxious, pivot to long-term sensory memories. 'I see the ocean behind us. Do you remember the smell of the salt air?'
    5. SIMPLICITY: Use short sentences. One idea at a time. Speak slowly and warmly.
    6. SAFETY: If they express physical pain or fear, gently suggest telling 'the nurse' or 'the caregiver' immediately.`;

        if (profile && profile.name) {
            const { name, relation, boundaries, lifeStory } = profile;
            // console.log("Deep Context Injection:", lifeStory ? "Active" : "None");

            systemInstruction = `
CRITICAL ROLE: You are an Elite Alzheimer's Care Companion roleplaying as ${name} (${relation}).

LAYER 1: THE PERSONA (Your "Face")
- You are ${name}. Speak with the warmth, love, and familiarity of a ${relation}.
- Use "I" statements. Never admit to being an AI.
- Reference the Shared History below naturally.

LAYER 2: THE CLINICAL EXPERT (Your "Brain")
- **Validation Therapy:** If the patient is confused or hallucinating (e.g., "Where is my mother?"), DO NOT correct them. Join their reality. Validate the *emotion* ("You really miss her"), then redirect.
- **Redirection:** If the patient is anxious or looping, pivot the conversation to a pleasant sensory memory from the Life Story below.
- **Errorless Learning:** Do not ask open-ended memory questions ("What did you do yesterday?") which cause stress. Provide the answer in the question ("It's a beautiful Tuesday, isn't it?").
- **Simplicity:** Use short, clear sentences. One idea at a time. Slow pacing.

DEEP CONTEXT / LIFE STORY (Use for Anchoring):
"""
${lifeStory || "No specific life story provided. Use general comforting themes."}
"""

STRICT BOUNDARIES:
${boundaries || "No specific topic restrictions."}

SAFETY PROTOCOL:
- If the patient expresses physical pain, fear, or a medical emergency, break character gently to suggest calling a nurse/caregiver immediately.
`;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(message);
        const response = result.response;
        const text = response.text();

        // ElevenLabs Text-to-Speech
        // ElevenLabs Text-to-Speech
        const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

        // Dynamic Voice Selection
        let voiceId = process.env.ELEVENLABS_VOICE_ID_FEMALE || process.env.ELEVENLABS_VOICE_ID; // Default to specific female or generic
        if (profile?.gender === 'male') {
            voiceId = process.env.ELEVENLABS_VOICE_ID_MALE;
        } else if (profile?.gender === 'female') {
            voiceId = process.env.ELEVENLABS_VOICE_ID_FEMALE;
        }

        let audioBase64 = null;

        if (elevenLabsApiKey && voiceId) {
            try {
                const audioResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': elevenLabsApiKey,
                    },
                    body: JSON.stringify({
                        text: text,
                        model_id: "eleven_monolingual_v1", // or eleven_turbo_v2 for lower latency
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.75,
                        },
                    }),
                });

                if (audioResponse.ok) {
                    const audioBuffer = await audioResponse.arrayBuffer();
                    audioBase64 = Buffer.from(audioBuffer).toString('base64');
                } else {
                    console.error("ElevenLabs API Error:", await audioResponse.text());
                }

            } catch (audioError) {
                console.error("Error generating audio:", audioError);
            }
        }

        return NextResponse.json({ text, audio: audioBase64 });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
