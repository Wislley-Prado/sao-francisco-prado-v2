
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Rio São Francisco Theme Colors
				water: 'hsl(var(--water))',
				forest: 'hsl(var(--forest))',
				sand: 'hsl(var(--sand))',
				sunset: 'hsl(var(--sunset))',
				// Tier colors
				'tier-vip': 'hsl(var(--tier-vip))',
				'tier-luxo': 'hsl(var(--tier-luxo))',
				'tier-diamante': 'hsl(var(--tier-diamante))',
				// Extended palette
				'river': {
					50: '#e6f7fb',
					100: '#cceff6',
					200: '#99dfee',
					300: '#66cfe5',
					400: '#33bfdd',
					500: '#219EBC',
					600: '#1a7e96',
					700: '#145f71',
					800: '#0d3f4b',
					900: '#072026',
				},
				'nature': {
					50: '#edf8f2',
					100: '#dbf1e5',
					200: '#b7e3cb',
					300: '#93d5b1',
					400: '#6fc797',
					500: '#52B788',
					600: '#41926c',
					700: '#316e51',
					800: '#214936',
					900: '#10251b',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { 
						transform: 'translateY(0px)'
					},
					'50%': { 
						transform: 'translateY(-10px)'
					}
				},
				'wave': {
					'0%, 100%': { 
						transform: 'scaleY(1)'
					},
					'50%': { 
						transform: 'scaleY(1.1)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'wave': 'wave 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.6s ease-out',
			},
			backgroundImage: {
				'river-gradient': 'linear-gradient(135deg, hsl(var(--water)) 0%, hsl(var(--forest)) 100%)',
				'sunset-gradient': 'linear-gradient(135deg, hsl(var(--sunset)) 0%, hsl(var(--water)) 100%)',
				'nature-gradient': 'linear-gradient(180deg, hsl(var(--forest)) 0%, hsl(var(--water)) 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
