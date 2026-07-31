import { e as createComponent, g as addAttribute, l as renderHead, k as renderComponent, n as renderSlot, r as renderTemplate, h as createAstro } from './astro/server_Cx3vsz9R.mjs';
/* empty css                        */
/* empty css                            */
import { $ as $$ProtectedRoute } from './ProtectedRoute_B6Hu8eKh.mjs';

const $$Astro = createAstro();
const $$LayoutCarta = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LayoutCarta;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/carta.webp"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Cartita para ti</title>${renderHead()}</head> <body> ${renderComponent($$result, "ProtectedRoute", $$ProtectedRoute, {})} <!-- Botón Volver --> <a href="/home" class="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path> </svg> <span>Volver</span> </a> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/VENTAS/Desktop/projectspersonal/cartas-app/src/layouts/LayoutCarta.astro", void 0);

export { $$LayoutCarta as $ };
