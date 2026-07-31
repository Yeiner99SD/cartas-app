import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Cx3vsz9R.mjs';
import { $ as $$LayoutCarta } from '../../chunks/LayoutCarta_DMcknwcU.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { s as supabase } from '../../chunks/supabaseClient_BAiC9JCc.mjs';
export { renderers } from '../../renderers.mjs';

const HOUR = 36e5;
function VueloTimeline({
  departureAt,
  routeFrom,
  routeTo,
  stops,
  passenger,
  subject
}) {
  const [now, setNow] = useState(() => Date.now());
  const [previewOffset, setPreviewOffset] = useState(null);
  const timelineRef = useRef(null);
  const [planeTop, setPlaneTop] = useState(0);
  const departure = new Date(departureAt).getTime();
  useEffect(() => {
    if (previewOffset !== null) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 3e4);
    return () => clearInterval(id);
  }, [previewOffset]);
  const effectiveNow = previewOffset !== null ? departure + previewOffset * HOUR : now;
  const elapsed = effectiveNow - departure;
  useEffect(() => {
    const progress = Math.min(Math.max(elapsed / (10 * HOUR), 0), 1);
    const h = timelineRef.current?.offsetHeight ?? 0;
    setPlaneTop(progress * h);
  }, [elapsed, stops]);
  const statusText = elapsed < 0 ? `Faltan ${formatCountdown(-elapsed)} para el despegue` : elapsed < 10 * HOUR ? `En vuelo — llegamos en ${formatCountdown(10 * HOUR - elapsed)}` : "¡Aterrizamos! Bienvenida a Madrid ❤";
  const flightDate = new Date(departureAt).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short"
  }).toUpperCase().replace(".", "");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen w-full px-4 pt-24 pb-32 text-white sm:px-6", style: { background: "linear-gradient(180deg,#2E2A4F,#100F24,#F4A65E)" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur-sm sm:p-6", children: [
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-yellow-300/90 sm:text-[11px]", children: "Cartitas fou u · Edición especial" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3 font-mono text-lg sm:text-xl", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: routeFrom }),
          /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-white/30" }),
          /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "h-5 w-5 flex-shrink-0 fill-none stroke-white", strokeWidth: "1.6", children: /* @__PURE__ */ jsx("path", { d: "M22 12l-8-3-4-8-2 1 2 7-7 1-2-3-2 1 2 5-2 5 2 1 2-3 7 1-2 7 2 1 4-8z" }) }),
          /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-white/30" }),
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: routeTo })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex gap-8 border-t border-dashed border-white/20 pt-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-white/50", children: "Pasajero" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold", children: passenger })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-white/50", children: "Asunto" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold", children: subject })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-white/50", children: "Fecha" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold", children: flightDate })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-base italic text-yellow-300 sm:text-lg", children: statusText })
      ] }),
      /* @__PURE__ */ jsxs("div", { ref: timelineRef, className: "relative mt-14", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute top-0 bottom-0 w-px opacity-25 left-4 sm:left-1/2 sm:-translate-x-1/2",
            style: { backgroundImage: "linear-gradient(#fff,#fff)", backgroundRepeat: "repeat-y", backgroundSize: "1px 8px" }
          }
        ),
        /* @__PURE__ */ jsx(
          "svg",
          {
            viewBox: "0 0 24 24",
            className: "absolute h-7 w-7 fill-yellow-300 left-4 sm:left-1/2",
            style: {
              top: planeTop,
              transform: "translate(-50%,-50%) rotate(90deg)",
              filter: "drop-shadow(0 0 8px rgba(253,224,71,0.7))",
              transition: "top 0.6s ease"
            },
            children: /* @__PURE__ */ jsx("path", { d: "M22 12l-8-3-4-8-2 1 2 7-7 1-2-3-2 1 2 5-2 5 2 1 2-3 7 1-2 7 2 1 4-8z" })
          }
        ),
        stops.map((stop, i) => {
          const unlocked = elapsed >= stop.hour_offset * HOUR;
          const isEven = i % 2 === 0;
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: `relative mb-14 pl-12 sm:pl-0 sm:w-[calc(50%-34px)] ${stop.is_landing ? "sm:w-full sm:pl-0" : isEven ? "sm:mr-auto" : "sm:ml-auto"}`,
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `rounded-2xl border p-5 ${unlocked ? "border-yellow-300/60 bg-black/40" : "border-white/15 bg-black/20 opacity-55"} ${stop.is_landing ? "border-yellow-300 text-center py-8" : ""}`,
                  children: [
                    /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-yellow-300/80 sm:text-[11px]", children: [
                      "T+",
                      stop.hour_offset,
                      "h"
                    ] }),
                    unlocked ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      stop.is_landing && /* @__PURE__ */ jsx("span", { className: "mb-3 mt-1 inline-block rounded bg-yellow-300 px-4 py-2 font-mono text-xs font-bold tracking-widest text-black", children: "¡LLEGAMOS!" }),
                      /* @__PURE__ */ jsx("h3", { className: `mt-1 font-semibold ${stop.is_landing ? "text-2xl" : "text-xl"}`, children: stop.title }),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-white/90", children: stop.body }),
                      stop.photo_url && /* @__PURE__ */ jsx("img", { src: stop.photo_url, alt: "", className: "mt-3 rounded-lg" }),
                      stop.song_label && /* @__PURE__ */ jsxs("span", { className: "mt-3 inline-block rounded-full border border-yellow-300/40 px-3 py-1 font-mono text-[11px] text-yellow-300", children: [
                        "♪ ",
                        stop.song_label
                      ] })
                    ] }) : /* @__PURE__ */ jsxs("p", { className: "mt-2 font-mono text-[11.5px] text-white/60", children: [
                      "🔒 Se desbloquea en ",
                      formatCountdown(stop.hour_offset * HOUR - elapsed)
                    ] })
                  ]
                }
              )
            },
            stop.id
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 border-t border-white/15 bg-black/90 px-5 py-3 backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-xl items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setPreviewOffset(previewOffset === null ? 0 : null),
          className: "rounded-full border border-yellow-300/50 px-3 py-1 font-mono text-[11px] text-yellow-300",
          children: previewOffset === null ? "Activar vista previa" : "Volver a tiempo real"
        }
      ),
      previewOffset !== null && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            min: -6,
            max: 11,
            step: 0.25,
            value: previewOffset,
            onChange: (e) => setPreviewOffset(parseFloat(e.target.value)),
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "w-14 text-right font-mono text-[11px] text-yellow-300", children: [
          previewOffset >= 0 ? "+" : "",
          previewOffset,
          "h"
        ] })
      ] })
    ] }) })
  ] });
}
function formatCountdown(ms) {
  const totalMin = Math.max(0, Math.floor(ms / 6e4));
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor(totalMin % 1440 / 60);
  const m = totalMin % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const prerender = false;
const $$6Agosto = createComponent(async ($$result, $$props, $$slots) => {
  const { data: meta, error: metaError } = await supabase.from("cartas_meta").select("*").eq("slug", "6-agosto").single();
  const { data: stops, error: stopsError } = await supabase.from("carta_stops").select("*").eq("carta_slug", "6-agosto").order("sort_order");
  if (metaError) console.error("Error cargando meta:", metaError);
  if (stopsError) console.error("Error cargando stops:", stopsError);
  return renderTemplate`${renderComponent($$result, "CartaLayout", $$LayoutCarta, { "title": "6 de Agosto", "description": "Un vuelo, 10 horas" }, { "default": async ($$result2) => renderTemplate`${meta ? renderTemplate`${renderComponent($$result2, "VueloTimeline", VueloTimeline, { "client:load": true, "departureAt": meta.departure_at, "routeFrom": meta.route_from, "routeTo": meta.route_to, "stops": stops || [], "passenger": meta.passenger, "subject": meta.subject, "client:component-hydration": "load", "client:component-path": "C:/Users/VENTAS/Desktop/projectspersonal/cartas-app/src/components/VueloTimeline", "client:component-export": "default" })}` : renderTemplate`${maybeRenderHead()}<p class="text-white text-center pt-20">Esta carta todavía no está lista 🛫</p>`}` })}`;
}, "C:/Users/VENTAS/Desktop/projectspersonal/cartas-app/src/pages/cartas/6-agosto.astro", void 0);

const $$file = "C:/Users/VENTAS/Desktop/projectspersonal/cartas-app/src/pages/cartas/6-agosto.astro";
const $$url = "/cartas/6-agosto";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$6Agosto,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
