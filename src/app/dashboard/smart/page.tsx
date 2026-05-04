"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const STEPS = [
  {
    key: "specific",
    label: "Specific",
    letter: "S",
    color: "#3b82f6",
    title: "Aniqlik (Specific)",
    question: "G'oyangiz nima haqida? Qanday muammo yechilmoqda?",
    hint: "Maqsad aniq va tushunarli bo'lishi kerak. Nima? Kim? Qayerda? Qachon? Nima uchun?",
    aiTip: "💡 Maslahat: Maqsadingizni aniq bir jumla bilan ifodalang. Masalan: 'O'rta maktab 7-sinf biologiya darsida Phet simulyatsiyasidan foydalanib...'",
    placeholder: "G'oyangizni batafsil tasvirlang. Qanday muammo hal qilinmoqda? Kimga qaratilgan? Qayerda qo'llaniladi?",
  },
  {
    key: "measurable",
    label: "Measurable",
    letter: "M",
    color: "#22c55e",
    title: "O'lchovlilik (Measurable)",
    question: "Muvaffaqiyatni qanday o'lchaysiz?",
    hint: "Raqamlar va ko'rsatkichlar bilan natijani belgilang.",
    aiTip: "📊 Maslahat: Foiz, ball, vaqt yoki sifat ko'rsatkichlaridan foydalaning. Masalan: 'Test natijalari 20% ga oshadi' yoki '30 daqiqa ichida...'",
    placeholder: "Qanday ko'rsatkichlar bo'yicha muvaffaqiyatni o'lchalaysiz? Raqamlar, foizlar, vaqt belgilang...",
  },
  {
    key: "achievable",
    label: "Achievable",
    letter: "A",
    color: "#f59e0b",
    title: "Erishimlillik (Achievable)",
    question: "Bu g'oyani amalga oshirish uchun qanday resurslar bor?",
    hint: "Mavjud imkoniyatlar, bilim va vositalarni sanab o'ting.",
    aiTip: "🛠 Maslahat: Mavjud texnologiyalar (Quizizz, Kahoot, VR, Phet, Google Classroom), moliyaviy resurslar va insoniy salohiyatni ko'rsating.",
    placeholder: "Amalga oshirish uchun qanday resurslar, vositalar, bilimlar mavjud? Texnologiyalar, vaqt, moliya...",
  },
  {
    key: "relevant",
    label: "Relevant",
    letter: "R",
    color: "#a855f7",
    title: "Dolzarblik (Relevant)",
    question: "Bu g'oya nega hozir muhim va dolzarb?",
    hint: "Zamonaviy ta'lim muammolari bilan bog'liqligini isbotlang.",
    aiTip: "🎯 Maslahat: Milliy ta'lim kontseptsiyasi, raqamli transformatsiya, COVID keyin o'zgargan ta'lim muhiti kabi dolzarb muammolarga bog'lang.",
    placeholder: "Nima uchun bu g'oya hozirgi kunda muhim? Qanday muammoni yechadi? Davlat siyosati yoki ta'lim trendlariga qanday mos keladi?",
  },
  {
    key: "timeBound",
    label: "Time-bound",
    letter: "T",
    color: "#f43f5e",
    title: "Muddatlilik (Time-bound)",
    question: "Bu loyihaning amalga oshirish vaqt jadvali qanday?",
    hint: "Aniq boshlanish va tugash sanalari, oraliq maqsadlarni belgilang.",
    aiTip: "📅 Maslahat: Loyihangizni bosqichlarga bo'ling: 1-oy: rejalashtirish, 2-3-oy: amalga oshirish, 4-oy: baholash. Aniq sanalar bering.",
    placeholder: "Loyiha qachon boshlanadi va qachon tugaydi? Oraliq maqsadlar va muddatlarni belgilang...",
  },
];

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            background: i < current ? "#00c896" : i === current
              ? STEPS[current].color
              : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

function CharCounter({ text, min = 100 }: { text: string; min?: number }) {
  const count = text.length;
  const ok = count >= min;
  return (
    <div className="flex items-center justify-between mt-2">
      <span className="text-xs" style={{ color: ok ? "#00c896" : "var(--text-muted)" }}>
        {ok ? "✅ Minimal talab bajarildi" : `⚠️ Kamida ${min} belgi yozing (${min - count} ta qoldi)`}
      </span>
      <span className="text-xs font-medium" style={{ color: ok ? "#00c896" : "var(--text-muted)" }}>
        {count}/{min}
      </span>
    </div>
  );
}

export default function SmartWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [values, setValues] = useState<Record<string, string>>({
    specific: "", measurable: "", achievable: "", relevant: "", timeBound: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(true);

  const current = STEPS[step];
  const currentVal = values[current.key] ?? "";
  const isValid = currentVal.length >= 100;
  const isLast = step === STEPS.length - 1;
  const allValid = Object.values(values).every((v) => v.length >= 100) && title.length >= 5;

  const setVal = (v: string) => setValues((prev) => ({ ...prev, [current.key]: v }));

  const handleNext = () => {
    if (!isValid) { toast.error("Kamida 100 ta belgi yozing!"); return; }
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
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="badge badge-blue mb-3 w-fit">🎯 SMART-Wizard</div>
        <h1 className="heading-lg mb-2">
          Innovatsion G'oyangizni <span className="gradient-text">Shakllantiring</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Har bir qadamda kamida 100 ta belgi yozing. Bu sizni chuqurroq o'ylashga undaydi.
        </p>
      </div>

      {/* Title (only on step 0) */}
      {step === 0 && (
        <div className="glass rounded-2xl p-6 mb-6">
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
            📌 Loyiha sarlavhasi
          </label>
          <input
            id="project-title"
            className="input-glass"
            placeholder="G'oyangizga qisqa va aniq sarlavha bering..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
          <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            {title.length}/120 belgi
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => { if (i < step || (i === step)) {} }}
              className="flex items-center gap-1.5 text-sm font-medium transition-all"
              style={{ color: i === step ? s.color : i < step ? "#00c896" : "rgba(255,255,255,0.3)" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                style={{
                  borderColor: i === step ? s.color : i < step ? "#00c896" : "rgba(255,255,255,0.15)",
                  background: i < step ? "rgba(0,200,150,0.15)" : i === step ? `${s.color}20` : "transparent",
                  color: i === step ? s.color : i < step ? "#00c896" : "rgba(255,255,255,0.3)",
                }}
              >
                {i < step ? "✓" : s.letter}
              </div>
              <span className="hidden md:block">{s.label}</span>
            </button>
          ))}
        </div>
        <ProgressDots current={step} total={STEPS.length} />
      </div>

      {/* Main form + AI panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black"
                style={{
                  background: `${current.color}20`,
                  border: `2px solid ${current.color}40`,
                  color: current.color,
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {current.letter}
              </div>
              <div>
                <h2 className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif", color: current.color }}>
                  {current.title}
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{current.question}</p>
              </div>
            </div>

            <div className="text-xs p-3 rounded-xl mb-4"
              style={{ background: `${current.color}10`, border: `1px solid ${current.color}25`, color: "var(--text-secondary)" }}>
              {current.hint}
            </div>

            <textarea
              id={`smart-${current.key}`}
              className="input-glass min-h-[200px]"
              placeholder={current.placeholder}
              value={currentVal}
              onChange={(e) => setVal(e.target.value)}
            />
            <CharCounter text={currentVal} />

            {/* Nav buttons */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button onClick={handleBack} className="btn-ghost flex-1">← Orqaga</button>
              )}
              {!isLast ? (
                <button
                  onClick={handleNext}
                  className="btn-primary flex-1"
                  disabled={!isValid}
                  id={`smart-next-${step}`}
                  style={{ opacity: isValid ? 1 : 0.5 }}
                >
                  Keyingi: {STEPS[step + 1].label} →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-primary btn-green flex-1"
                  disabled={loading || !allValid}
                  id="smart-submit"
                  style={{ opacity: allValid ? 1 : 0.5 }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Yuborilmoqda...
                    </span>
                  ) : "🚀 Bumerangni Yuborish!"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div>
          <div className="glass-green rounded-2xl p-5 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background: "rgba(0,200,150,0.2)" }}>🤖</div>
                <span className="font-semibold text-sm">AI Maslahatchi</span>
              </div>
              <button
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {showAiPanel ? "Yashirish" : "Ko'rish"}
              </button>
            </div>

            {showAiPanel && (
              <div>
                <div className="text-sm p-3 rounded-xl mb-4 leading-relaxed"
                  style={{ background: "rgba(0,200,150,0.08)", color: "var(--text-secondary)" }}>
                  {current.aiTip}
                </div>

                <div className="divider" />

                <div className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                  Qadamlar holati:
                </div>
                <div className="space-y-2">
                  {STEPS.map((s, i) => {
                    const val = values[s.key] ?? "";
                    const done = val.length >= 100;
                    return (
                      <div key={s.key} className="flex items-center gap-2 text-xs">
                        <span style={{ color: done ? "#00c896" : i === step ? s.color : "rgba(255,255,255,0.2)" }}>
                          {done ? "✅" : i === step ? "✏️" : "○"}
                        </span>
                        <span style={{ color: done ? "#4dffd4" : i === step ? s.color : "rgba(255,255,255,0.3)" }}>
                          {s.letter} — {s.label}
                        </span>
                        {done && <span className="ml-auto text-green-400">{val.length}</span>}
                      </div>
                    );
                  })}
                </div>

                {allValid && (
                  <div className="mt-4 p-3 rounded-xl text-xs text-center"
                    style={{ background: "rgba(0,200,150,0.15)", color: "#4dffd4" }}>
                    🎉 Barcha qadamlar tayyor! G'oyangizni yuboring.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
