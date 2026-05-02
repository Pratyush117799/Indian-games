import React, { useState } from "react";

const TERMS = [
  { sa: "चक्रव्यूह", translit: "Chakravyuh", en: "spiral battle formation" },
  { sa: "मार्ग", translit: "maarg", en: "path" },
  { sa: "दीवार", translit: "deevaar", en: "wall" },
  { sa: "रक्षक", translit: "rakshak", en: "guardian / protector" },
  { sa: "द्वार", translit: "dvaar", en: "gate" },
  { sa: "निर्गम", translit: "nirgam", en: "exit" },
  { sa: "केंद्र / बीज", translit: "kendra / beej", en: "center / seed" },
  { sa: "योद्धा", translit: "yoddha", en: "warrior" },
  { sa: "रणभूमि", translit: "ranbhoomi", en: "battlefield" },
  { sa: "रणनीति", translit: "ranneeti", en: "strategy" }
];

export const VocabularyPanel: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-amber-200 rounded-xl bg-amber-50/80 shadow-inner text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-amber-900 font-semibold"
      >
        <span>Sanskrit Vocabulary</span>
        <span className="text-[10px] text-amber-700">
          {open ? "Hide" : "Show"}
        </span>
      </button>
      {open && (
        <div className="max-h-40 overflow-y-auto px-3 pb-2 space-y-1">
          {TERMS.map((t) => (
            <div key={t.sa} className="flex flex-col border-b border-amber-100/80 last:border-b-0 py-1">
              <span className="text-sm text-amber-900">{t.sa}</span>
              <span className="text-[11px] text-amber-700 italic">
                {t.translit}
              </span>
              <span className="text-[11px] text-amber-800">{t.en}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

