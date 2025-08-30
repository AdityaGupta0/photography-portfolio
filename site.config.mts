import type { AstroInstance } from 'astro';
import { Github, Instagram } from 'lucide-astro';

export interface SocialLink {
	name: string;
	url: string;
	icon: AstroInstance;
}

export default {
	title: 'AG',
	favicon: 'favicon.ico',
	owner: 'Aditya Gupta',
	profileImage: 'profile1.jpeg',
	socialLinks: [
		{
			name: 'GitHub',
			url: 'https://github.com/AdityaGupta0',
			icon: Github,
		} as SocialLink,
		{
			name: 'Instagram',
			url: 'https://www.instagram.com/adigupta67/',
			icon: Instagram,
		} as SocialLink,
	],
};
