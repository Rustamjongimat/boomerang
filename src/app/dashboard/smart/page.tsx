"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const STEPS = [
  {
    key: "specific",
    label: "Aniq",
    letter: "S",
    color: "#0d6efd",
    bg: "#e8f0fe",
    title: "Aniq (Specific)",
    question: "G'oyangiz nima haqida? Qanday muammo yechilmoqda?",
    hint: "Maqsad aniq va tushunarli bo'lishi kerak. Nima? Kim? Qayerda? Qachon? Nima uchun?",
    aiTip: "💡 Maslahat: Maqsadingizni aniq bir jumla bilan ifodalang. Masalan: 'O'rta maktab 7-sinf biologiya darsida Phet simulyatsiyasidan foydalanib...'",
    placeholder: "G'oyangizni batafsil tasvirlang. Qanday muammo hal qilinmoqda? Kimga qaratilgan? Qayerda qo'llaniladi?",
  },
  {
    key: "measurable",
    label: "O'lchanadigan",
    letter: "M",
    color: "#00b37e",
    bg: "#e6f8f3",
    title: "O'lchanadigan (Measurable)",
    question: "Muvaffaqiyatni qanday o'lchaysiz?",
    hint: "Raqamlar va ko'rsatkichlar bilan natijani belgilang.",
    aiTip: "📊 Maslahat: Foiz, ball, vaqt yoki sifat ko'rsatkichlaridan foydalaning. Masalan: 'Test natijalari 20% ga oshadi' yoki '30 daqiqa ichida...'",
    placeholder: "Qanday ko'rsatkichlar bo'yicha muvaffaqiyatni o'lchalaysiz? Raqamlar, foizlar, vaqt belgilang...",
  },
  {
    key: "achievable",
    label: "Erishib bo'ladigan",
    letter: "A",
    color: "#d97706",
    bg: "#fef9ee",
    title: "Erishib bo'ladigan (Achievable)",
    question: "Bu g'oyani amalga oshirish uchun qanday resurslar bor?",
    hint: "Mavjud imkoniyatlar, bilim va vositalarni sanab o'ting.",
    aiTip: "🛠 Maslahat: Mavjud texnologiyalar (Quizizz, Kahoot, VR, Phet), moliyaviy resurslar va insoniy salohiyatni ko'rsating.",
    placeholder: "Amalga oshirish uchun qanday resurslar, vositalar, bilimlar mavjud? Texnologiyalar, vaqt, moliya...",
  },
  {
    key: "relevant",
    label: "Dolzarb",
    letter: "R",
    color: "#7c3aed",
    bg: "#ede9fe",
    title: "Dolzarb (Relevant)",
    question: "Bu g'oya nega hozir muhim va dolzarb?",
    hint: "Zamonaviy ta'lim muammolari bilan bog'liqligini isbotlang.",
    aiTip: "🎯 Maslahat: Milliy ta'lim kontseptsiyasi, raqamli transformatsiya, kabi dolzarb muammolarga bog'lang.",
    placeholder: "Nima uchun bu g'oya hozirgi kunda muhim? Qanday muammoni yechadi? Davlat siyosati yoki ta'lim trendlariga qanday mos keladi?",
  },
  {
    key: "timeBound",
    label: "Muddatli",
    letter: "T",
    color: "#ea4c89",
    bg: "#fce4ec",
    title: "Muddatli (Time-bound)",
    question: "Bu loyihaning amalga oshirish vaqt jadvali qanday?",
    hint: "Aniq boshlanish va tugash sanalari, oraliq maqsadlarni belgilang.",
    aiTip: "📅 Maslahat: Loyihangizni bosqichlarga bo'ling: 1-oy: rejalashtirish, 2-3-oy: amalga oshirish, 4-oy: baholash. Aniq sanalar bering.",
    placeholder: "Loyiha qachon boshlanadi va qachon tugaydi? Oraliq maqsadlar va muddatlarni belgilang...",
  },
];

function CharCounter({ text }: { text: string }) {
  const count = text.length;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
        Belgilar soni
      </span>
      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
        {count}
      </span>
    </div>
  );
}

// Reusable card
const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: "#fff", border: "1px solid var(--border)", borderRadius: "16px",
    padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", ...style
  }}>
    {children}
  </div>
);

export default function SmartWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [values, setValues] = useState<Record<string, string>>({
    specific: "", measurable: "", achievable: "", relevant: "", timeBound: "",
  });
  const [loading, setLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(true);

  const current = STEPS[step];
  const currentVal = values[current.key] ?? "";
  const isValid = currentVal.trim().length > 0;
  const isLast = step === STEPS.length - 1;
  const allValid = Object.values(values).every((v) => v.trim().length > 0) && title.trim().length > 0;

  const setVal = (v: string) => setValues((prev) => ({ ...prev, [current.key]: v }));

  const handleNext = () => {
    if (!isValid) { toast.error("Iltimos, maydonni to'ldiring!"); return; }
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => { if (step > 0) setStep((s) => s - 1); };

  const handleSubmit = async () => {
    if (!allValid) { toast.error("Barcha maydonlarni to'ldiring!"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, ...values }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("🚀 G'oya yuborildi! AI tahlil qilmoqda...");
        router.push(`/dashboard/projects/${data.id}`);
      } else {
        toast.error(data.error || "Xatolik yuz berdi");
      }
    } catch {
      toast.error("Server bilan ulanishda xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "40px" }}>
      
      {/* ══ HEADER ══ */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          display: "inline-block", background: "var(--bg-dark)", color: "#fff",
          padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px"
        }}>
          🎯 SMART-Wizard
        </div>
        <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "8px", letterSpacing: "-0.03em" }}>
          Innovatsion G'oyangizni Shakllantiring
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-light)" }}>
          Har bir qadamni batafsil to'ldirib, g'oyangizni mukammal qiling.
        </p>
      </div>

      {/* ══ TITLE INPUT ══ */}
      {step === 0 && (
        <Card style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--dark)", marginBottom: "8px" }}>
            Loyiha sarlavhasi
          </label>
          <input
            id="project-title"
            placeholder="G'oyangizga qisqa va aniq sarlavha bering..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            style={{
              width: "100%", padding: "14px 16px", background: "var(--bg-soft)",
              border: "1.5px solid var(--border)", borderRadius: "10px", fontSize: "15px",
              color: "var(--dark)", outline: "none", fontFamily: "Inter, sans-serif",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--pink)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px", textAlign: "right" }}>
            {title.length}/120 belgi
          </div>
        </Card>
      )}

      {/* ══ STEP INDICATOR ══ */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        {STEPS.map((s, i) => {
          const isPast = i < step;
          const isCurr = i === step;
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: isPast || isCurr ? 1 : 0.4 }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 800,
                  background: isPast ? s.bg : isCurr ? s.color : "var(--bg-soft)",
                  color: isPast ? s.color : isCurr ? "#fff" : "var(--text-muted)",
                  border: isCurr ? "none" : `1px solid ${isPast ? s.color : "var(--border)"}`
                }}>
                  {isPast ? "✓" : s.letter}
                </div>
                <span style={{ fontSize: "13px", fontWeight: isCurr ? 700 : 500, color: isCurr ? "var(--dark)" : "var(--text-light)" }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: "20px", height: "1px", background: "var(--border)" }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        {/* ══ MAIN FORM ══ */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: current.bg, color: current.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", fontWeight: 900, fontFamily: "Outfit, sans-serif"
            }}>
              {current.letter}
            </div>
            <div>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: current.color, marginBottom: "2px" }}>
                {current.title}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-light)" }}>{current.question}</p>
            </div>
          </div>

          <div style={{
            background: "var(--bg-soft)", border: "1px solid var(--border)",
            borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "var(--text)",
            marginBottom: "16px", lineHeight: 1.5
          }}>
            {current.hint}
          </div>

          <textarea
            id={`smart-${current.key}`}
            placeholder={current.placeholder}
            value={currentVal}
            onChange={(e) => setVal(e.target.value)}
            style={{
              width: "100%", minHeight: "200px", padding: "16px", background: "#fff",
              border: "1.5px solid var(--border)", borderRadius: "12px", fontSize: "14px",
              color: "var(--dark)", outline: "none", fontFamily: "Inter, sans-serif",
              resize: "vertical", transition: "border-color 0.2s", lineHeight: 1.6
            }}
            onFocus={(e) => e.target.style.borderColor = current.color}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
          <CharCounter text={currentVal} />

          {/* Nav Buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            {step > 0 && (
              <button onClick={handleBack} style={{
                flex: 1, padding: "12px", background: "var(--bg-soft)", color: "var(--dark)",
                border: "1px solid var(--border)", borderRadius: "10px", fontSize: "14px",
                fontWeight: 600, cursor: "pointer", transition: "background 0.2s"
              }} onMouseEnter={(e) => (e.target as HTMLElement).style.background = "#e7e7e9"}
                 onMouseLeave={(e) => (e.target as HTMLElement).style.background = "var(--bg-soft)"}>
                ← Orqaga
              </button>
            )}
            
            {!isLast ? (
              <button onClick={handleNext} disabled={!isValid} style={{
                flex: 1, padding: "12px", background: "var(--dark)", color: "#fff",
                border: "none", borderRadius: "10px", fontSize: "14px",
                fontWeight: 600, cursor: isValid ? "pointer" : "not-allowed",
                opacity: isValid ? 1 : 0.5, transition: "background 0.2s"
              }} onMouseEnter={(e) => { if(isValid) (e.target as HTMLElement).style.background = "#2d2d4a" }}
                 onMouseLeave={(e) => { if(isValid) (e.target as HTMLElement).style.background = "var(--dark)" }}>
                Keyingi: {STEPS[step + 1].label} →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || !allValid} style={{
                flex: 1, padding: "12px", background: "var(--pink)", color: "#fff",
                border: "none", borderRadius: "10px", fontSize: "14px",
                fontWeight: 600, cursor: (loading || !allValid) ? "not-allowed" : "pointer",
                opacity: allValid ? 1 : 0.5, transition: "background 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
              }} onMouseEnter={(e) => { if(allValid && !loading) (e.target as HTMLElement).style.background = "var(--pink-hover)" }}
                 onMouseLeave={(e) => { if(allValid && !loading) (e.target as HTMLElement).style.background = "var(--pink)" }}>
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                    Yuborilmoqda...
                  </>
                ) : "🚀 Jilolashga yuborish!"}
              </button>
            )}
          </div>
        </Card>

        {/* ══ AI PANEL ══ */}
        <div style={{
          background: "#e8f0fe", border: "1px solid #d1e3fd", borderRadius: "16px", padding: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#0d6efd", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                🤖
              </div>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#0d6efd" }}>AI Maslahatchi</span>
            </div>
            <button onClick={() => setShowAiPanel(!showAiPanel)} style={{
              background: "none", border: "none", fontSize: "12px", fontWeight: 600, color: "#0d6efd", cursor: "pointer"
            }}>
              {showAiPanel ? "Yashirish" : "Ko'rish"}
            </button>
          </div>

          {showAiPanel && (
            <div>
              <div style={{ fontSize: "13px", color: "var(--dark)", lineHeight: 1.6, background: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #d1e3fd" }}>
                {current.aiTip}
              </div>

              {allValid && (
                <div style={{ marginTop: "16px", background: "#e6f8f3", border: "1px solid #00b37e", color: "#00b37e", padding: "12px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
                  🎉 Barcha qadamlar tayyor! G'oyangizni yuboring.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
