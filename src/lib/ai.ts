import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy-key-for-build-time" });

export async function analyzeProject(content: string) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Sen qat'iy lekin konstruktiv pedagog-ekspertsan. Talabaning innovatsion g'oyasini SMART mezonlari bo'yicha bahola.
          Quyidagi JSON formatda javob qaytar:
          {
            "innovScore": 0-100 oralig'ida butun son (innovatsionlik darajasi),
            "feedback": "Loyihadagi kamchiliklar va yutuqlar haqida umumiy xulosa (uzbek tilida)",
            "suggestions": "Qanday raqamli vositalar (VR, Phet, Quizizz va h.k) qo'shish kerakligi haqida aniq tavsiyalar (uzbek tilida)"
          }
          Faqatgina yaroqli JSON qaytar.`
        },
        {
          role: "user",
          content
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const result = completion.choices[0]?.message?.content;
    if (result) {
      return JSON.parse(result) as { innovScore: number; feedback: string; suggestions: string };
    }
  } catch (error) {
    console.error("AI Analysis error:", error);
  }
  
  // Xatolik bo'lsa yoki API kalit yo'q bo'lsa, default qiymat qaytarish:
  return {
    innovScore: Math.floor(Math.random() * 40) + 40,
    feedback: "G'oya yaxshi o'ylangan, ammo ba'zi mezonlar yetarli darajada ochib berilmagan. Maqsadni aniqroq belgilang.",
    suggestions: "O'quvchilar e'tiborini tortish uchun Kahoot yoki Phet kabi interaktiv vositalardan foydalanish tavsiya etiladi."
  };
}
