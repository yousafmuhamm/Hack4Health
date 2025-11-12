'use client';
import { useState } from 'react';

type Msg = { role:'user'|'assistant'; content:string };

export default function ChatWidget(){
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role:'assistant', content:'Hi! I can help you describe symptoms and next steps.' }
  ]);
  const [input, setInput] = useState('');

  async function send(){
    const text = input.trim();
    if(!text) return;
    setInput('');
    setMsgs(m => [...m, {role:'user', content:text}]);

    try{
      // call your API route
      const r = await fetch('/api/chat', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({ messages: [...msgs, {role:'user', content:text}] })
      });
      const data = await r.json();
      setMsgs(m => [...m, {role:'assistant', content:data.reply ?? '…'}]);
    }catch{
      setMsgs(m => [...m, {role:'assistant', content:'Sorry—chat is unavailable right now.'}]);
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={()=> setOpen(true)}
        className="fixed bottom-6 right-6 btn-secondary rounded-full px-5 py-3 shadow-lg"
        aria-label="Open patient assistant"
      >
        Patient Portal
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-[60]" onClick={()=>setOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl"
            onClick={e=>e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold text-[var(--maroon-500)]">Patient Assistant</div>
              <button onClick={()=>setOpen(false)} className="text-gray-500 hover:text-gray-800">×</button>
            </div>

            <div className="p-4 h-[calc(100%-120px)] overflow-auto space-y-3">
              {msgs.map((m,i)=>(
                <div key={i}
                  className={m.role==='user'
                    ? "ml-auto max-w-[80%] rounded-lg px-3 py-2 bg-[var(--lavender-500)] text-white"
                    : "mr-auto max-w-[80%] rounded-lg px-3 py-2 bg-[var(--maroon-100)] text-[var(--fg)]"
                  }>
                  {m.content}
                </div>
              ))}
            </div>

            <div className="p-3 border-t flex gap-2">
              <input
                className="flex-1 border rounded-lg px-3 py-2 outline-none"
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder="Describe symptoms or ask a question…"
                onKeyDown={e=> e.key==='Enter' && send()}
              />
              <button onClick={send} className="btn-cta rounded-lg px-4 py-2">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
