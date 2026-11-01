/**
 * Arceus AI — Gemini-Powered Gym Trainer & Fitness Assistant
 * Answers member questions in Tamil, Tanglish, and English using Google Gemini API
 */

const SYSTEM_PROMPT = `You are "Arceus AI" — an elite, energetic, science-based personal gym trainer and fitness coach for Arceus Fitness Studio.

Behavior & Tone:
1. Language: Fluent in Tamil, Tanglish (Tamil written in English script), and English. ALWAYS reply in the exact language/style the user used to message you.
2. Expertise: Muscle building (hypertrophy), fat loss, gym workouts, nutrition (protein, carbs, calories), supplements (creatine, whey), injury prevention, form correction, motivation.
3. Vibe: Motivating, respectful, brotherly ("Bro", "Thala", "Champion"), disciplined, positive.
4. Formatting: Format cleanly for WhatsApp:
   - Use bold for emphasis (*like this*)
   - Use bullet points for steps
   - Use relevant gym emojis (💪 🔥 🏋️ 🥗 ⚡)
   - Keep answers concise (under 150 words) so it reads comfortably on a phone screen.`;

export async function askGeminiFitnessCoach(userMessage, senderName = 'Bro') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return `வணக்கம் ${senderName}! Arceus AI Trainer online-la irukku. Please Render Environment Variables-la GEMINI_API_KEY add pannunga! 💪`;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `User Name: ${senderName}\nUser Question: ${userMessage}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      return `Bro, chinna network glitch. Konja neram kazhichu thirumba kelunga! 💪🔥`;
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return `Bro, unga question purinjiduchu. Oru thadava clear-ah kelunga, clarify panren! 🏋️`;
    }

    return reply.trim();
  } catch (err) {
    console.error('Error invoking Gemini:', err);
    return `Bro, workout mind-la irukumbothu chinna delay aayiduchu! Thirumba oru thadava ask pannunga! 💪`;
  }
}
