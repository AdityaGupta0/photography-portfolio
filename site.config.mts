import type { AstroInstance } from 'astro';
import { Github, Instagram, Mail } from 'lucide-astro';

export interface SocialLink {
	name: string;
	url: string;
	icon: AstroInstance;
}

export default {
	title: 'AG',
	favicon: 'favicon.ico',
	owner: 'Aditya Gupta',
	profileImage: 'profile.jpeg',
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
		{
			name: 'Mail',
			url: 'mailto:oneadigupta@outlook.com',
			icon: Mail,
		} as SocialLink,
	],
};
