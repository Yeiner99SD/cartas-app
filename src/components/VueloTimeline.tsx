// src/components/VueloTimeline.tsx
import { useEffect, useRef, useState } from 'react';

type Stop = {
  id: string;
  hour_offset: number;
  title: string;
  body: string;
  song_label: string | null;
  song_url: string | null;
  photo_url: string | null;
  is_landing: boolean;
};

const HOUR = 3_600_000;

export default function VueloTimeline({
  departureAt, routeFrom, routeTo, stops, passenger, subject
}: { departureAt: string; routeFrom: string; routeTo: string; stops: Stop[]; passenger: string; subject: string }) {
  const [now, setNow] = useState(() => Date.now());
  const [previewOffset, setPreviewOffset] = useState<number | null>(null); // null = tiempo real
  const timelineRef = useRef<HTMLDivElement>(null);
  const [planeTop, setPlaneTop] = useState(0);
  const departure = new Date(departureAt).getTime();

  // tiempo real, se actualiza cada 30s (solo si no estás usando el slider)
  useEffect(() => {
    if (previewOffset !== null) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [previewOffset]);

  // "now" efectivo: real o simulado por el slider
  const effectiveNow = previewOffset !== null ? departure + previewOffset * HOUR : now;
  const elapsed = effectiveNow - departure;

  useEffect(() => {
    const progress = Math.min(Math.max(elapsed / (10 * HOUR), 0), 1);
    const h = timelineRef.current?.offsetHeight ?? 0;
    setPlaneTop(progress * h);
  }, [elapsed, stops]);

  const statusText =
    elapsed < 0
      ? `Faltan ${formatCountdown(-elapsed)} para el despegue`
      : elapsed < 10 * HOUR
      ? `En vuelo — llegamos en ${formatCountdown(10 * HOUR - elapsed)}`
      : '¡Aterrizamamos, ya te veo mi amor';

  const flightDate = new Date(departureAt).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short',
  }).toUpperCase().replace('.', '');


  return (
    <div className="min-h-screen w-full px-4 pt-24 pb-32 text-white sm:px-6" style={{ background: 'linear-gradient(180deg,#2E2A4F,#100F24,#F4A65E)' }}>
      <div className="mx-auto max-w-xl">

        {/* Boarding pass */}
        <div className="relative rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur-sm sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-yellow-300/90 sm:text-[11px]">
            Cartitas fou u · Edición especial
          </p>

          <div className="mt-3 flex items-center gap-3 font-mono text-lg sm:text-xl">
            <span className="font-bold">{routeFrom}</span>
            <span className="h-px flex-1 bg-white/30" />
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 fill-none stroke-white" strokeWidth="1.6">
              <path d="M22 12l-8-3-4-8-2 1 2 7-7 1-2-3-2 1 2 5-2 5 2 1 2-3 7 1-2 7 2 1 4-8z" />
            </svg>
            <span className="h-px flex-1 bg-white/30" />
            <span className="font-bold">{routeTo}</span>
          </div>

          <div className="mt-5 flex gap-8 border-t border-dashed border-white/20 pt-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Pasajero</p>
              <p className="mt-1 font-semibold">{passenger}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Asunto</p>
              <p className="mt-1 font-semibold">{subject}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Fecha</p>
              <p className="mt-1 font-semibold">{flightDate}</p>
            </div>
          </div>

          <p className="mt-4 text-base italic text-yellow-300 sm:text-lg">{statusText}</p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative mt-14">
          <div
            className="absolute top-0 bottom-0 w-px opacity-25 left-4 sm:left-1/2 sm:-translate-x-1/2"
            style={{ backgroundImage: 'linear-gradient(#fff,#fff)', backgroundRepeat: 'repeat-y', backgroundSize: '1px 8px' }}
          />
          {/* avión en vez de puntito */}
          <svg
            viewBox="0 0 24 24"
            className="absolute h-7 w-7 fill-yellow-300 left-4 sm:left-1/2"
            style={{
              top: planeTop,
              transform: 'translate(-50%,-50%) rotate(90deg)',
              filter: 'drop-shadow(0 0 8px rgba(253,224,71,0.7))',
              transition: 'top 0.6s ease',
            }}
          >
            <path d="M22 12l-8-3-4-8-2 1 2 7-7 1-2-3-2 1 2 5-2 5 2 1 2-3 7 1-2 7 2 1 4-8z" />
          </svg>

          {stops.map((stop, i) => {
            const unlocked = elapsed >= stop.hour_offset * HOUR;
            const isEven = i % 2 === 0;
            return (
              <div
                key={stop.id}
                className={`relative mb-14 pl-12 sm:pl-0 sm:w-[calc(50%-34px)] ${
                  stop.is_landing ? 'sm:w-full sm:pl-0' : isEven ? 'sm:mr-auto' : 'sm:ml-auto'
                }`}
              >
                <div
                  className={`rounded-2xl border p-5 ${
                    unlocked ? 'border-yellow-300/60 bg-black/40' : 'border-white/15 bg-black/20 opacity-55'
                  } ${stop.is_landing ? 'border-yellow-300 text-center py-8' : ''}`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-yellow-300/80 sm:text-[11px]">
                    T+{stop.hour_offset}h
                  </p>
                  {unlocked ? (
                    <>
                      {stop.is_landing && (
                        <span className="mb-3 mt-1 inline-block rounded bg-yellow-300 px-4 py-2 font-mono text-xs font-bold tracking-widest text-black">
                          ¡LLEGAMOS!
                        </span>
                      )}
                      <h3 className={`mt-1 font-semibold ${stop.is_landing ? 'text-2xl' : 'text-xl'}`}>{stop.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/90">{stop.body}</p>
                      {stop.photo_url && <img src={stop.photo_url} alt="" className="mt-3 rounded-lg" />}
                      {stop.song_label && (
                        stop.song_url ? (
                          <a
                            href={stop.song_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 rounded-full border border-yellow-300/40 px-3 py-1 font-mono text-[11px] text-yellow-300 transition hover:bg-yellow-300/10"
                          >
                            <span>♪</span>
                            <span>{stop.song_label}</span>
                          </a>
                        ) : (
                          <span className="mt-3 inline-block rounded-full border border-yellow-300/40 px-3 py-1 font-mono text-[11px] text-yellow-300">
                            ♪ {stop.song_label}
                          </span>
                        )
                      )}
                    </>
                  ) : (
                    <p className="mt-2 font-mono text-[11.5px] text-white/60">
                      🔒 Se desbloquea en {formatCountdown(stop.hour_offset * HOUR - elapsed)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- CONTROL DE VISTA PREVIA (quitar antes de mandarla) ---- */}
      
    </div>
  );
}

function formatCountdown(ms: number) {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}