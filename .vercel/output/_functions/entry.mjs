import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_B18SHenj.mjs';
import { manifest } from './manifest_CB5dp2X1.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/cartas/6-agosto.astro.mjs');
const _page2 = () => import('./pages/cartas/_slug_.astro.mjs');
const _page3 = () => import('./pages/home.astro.mjs');
const _page4 = () => import('./pages/nuestras-cositas.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.18.2_@vercel+functi_8f27960580613a04674a91e8eb1c7a65/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/cartas/6-agosto.astro", _page1],
    ["src/pages/cartas/[slug].astro", _page2],
    ["src/pages/home.astro", _page3],
    ["src/pages/nuestras-cositas.astro", _page4],
    ["src/pages/index.astro", _page5]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "0527a779-3cef-40f4-942b-04538f1399cb",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
