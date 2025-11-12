'use client';
import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';

const SECTIONS = [
  { id:'intro',    title:'How to describe your symptoms', keywords:['describe','symptoms','write'] },
  { id:'redflags', title:'Red flags — seek urgent care',  keywords:['chest pain','stroke','bleeding','red flags'] },
  { id:'fever',    title:'Fever guidance',                keywords:['fever','temperature','chills'] },
  { id:'sore',     title:'Sore throat & cough',           keywords:['sore throat','cough','cold'] },
  { id:'clinic',   title:'When to use a walk-in/virtual', keywords:['clinic','walk-in','virtual'] },
];

export default function EducationPage(){
  const [q, setQ] = useState('');
  const map = useMemo(() => {
    const m = new Map<string,string>();
    SECTIONS.forEach(s => s.keywords.forEach(k => m.set(k.toLowerCase(), s.id)));
    return m;
  }, []);
  const containerRef = useRef<HTMLDivElement|null>(null);

  function findSection(){
    const words = q.toLowerCase().split(/[,\s]+/).filter(Boolean);
    for(const w of words){
      const id = map.get(w) || map.get(words.slice(words.indexOf(w)).join(' ')); // try multiword
      if(id){
        const el = document.getElementById(id);
        el?.scrollIntoView({behavior:'smooth', block:'start'});
        el?.classList.add('ring-2','ring-[var(--lavender-500)]');
        setTimeout(()=> el?.classList.remove('ring-2','ring-[var(--lavender-500)]'), 1200);
        return;
      }
    }
    alert('No exact match found. Try: "fever", "chest pain", "clinic", "sore throat".');
  }

  return (
    <main className="min-h-screen px-6 md:px-10 py-6">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-[var(--cta)]">Health Education</h1>
        <div className="ml-auto flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Write what you'd like to know (e.g., fever, chest pain)"
            className="px-3 py-2 rounded-lg border outline-none w-[320px] bg-white/90"
          />
          <button onClick={findSection} className="btn-secondary px-4 py-2 rounded-lg">Find</button>
        </div>
      </header>

      <div ref={containerRef} className="mt-6 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* left: guidance sections */}
        <article className="space-y-6">
          {SECTIONS.map(s => (
            <section id={s.id} key={s.id}
              className="bg-white rounded-xl border p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--maroon-500)]">{s.title}</h2>
              <p className="text-sm text-[var(--fg-muted)] mt-2">
                {/* placeholder content; replace with your real patient-friendly guidance */}
                {s.id==='intro' && 'Use plain language: what hurts, how long, what makes it better/worse, any medicines, and key history (allergies, conditions).'}
                {s.id==='redflags' && 'Chest pain with sweating/shortness of breath, stroke signs (FAST), severe bleeding, or sudden severe pain → call emergency.'}
                {s.id==='fever' && 'Adults with mild fever can use fluids/rest. See care if >3 days, very high temp, or red flags.'}
                {s.id==='sore' && 'Sore throat + cough without red flags usually OK for clinic/virtual. Watch hydration and breathing effort.'}
                {s.id==='clinic' && 'Use walk-in/virtual for non-urgent issues; urgent care/ER for severe, worsening, or red-flag symptoms.'}
              </p>
            </section>
          ))}
        </article>

        {/* right: your long reference image, scrollable */}
        <aside className="rounded-xl border bg-black/90 overflow-hidden">
          <div className="h-[72vh] overflow-auto">
            <Image
              src="/healtheducation.png"
              alt="Health education long page"
              width={1400}
              height={4000}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="text-xs text-white/70 px-4 py-2">
            Tip: try keywords like <b>"fever"</b>, <b>"chest pain"</b>, <b>"clinic"</b>, or <b>"sore throat"</b>.
          </div>
        </aside>
      </div>
    </main>
  );
}
