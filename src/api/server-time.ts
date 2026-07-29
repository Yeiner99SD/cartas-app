// src/pages/api/server-time.ts
export const prerender = false;
export async function GET() {
  return new Response(JSON.stringify({ now: Date.now() }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
// al montar VueloTimeline:
const res = await fetch('/api/server-time');
const { now: serverNow } = await res.json();
const offset = serverNow - Date.now(); // diferencia entre su reloj y el real
// luego siempre calculas: const correctedNow = Date.now() + offset;