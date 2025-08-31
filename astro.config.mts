import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://photographyportfolio-25s.pages.dev',
	base: 'home',
	vite: {
		plugins: [tailwindcss()],
	},
});
