// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    devToolbar: { 
        enabled: false
    },
    vite: {
        plugins: [tailwindcss()],
        define: {
            'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
            'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY)
        }
    },
});
