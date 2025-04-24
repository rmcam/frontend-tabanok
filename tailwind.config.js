/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/auth/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			'k-negro': {
  				'50': '#E8E8E8',
  				'100': '#D1D1D1',
  				'200': '#A3A3A3',
  				'300': '#757575',
  				'400': '#474747',
  				'500': '#1A1A1A',
  				'600': '#141414',
  				'700': '#0F0F0F',
  				'800': '#0A0A0A',
  				'900': '#050505'
  			},
  			'k-blanco': {
  				'50': '#FFFFFF',
  				'100': '#FFFFFF',
  				'200': '#FFFFFF',
  				'300': '#FFFFFF',
  				'400': '#FFFFFF',
  				'500': '#FFFFFF',
  				'600': '#F5F5F5',
  				'700': '#EBEBEB',
  				'800': '#DCDCDC',
  				'900': '#C2C2C2'
  			},
  			'k-rojo': {
  				'50': '#FEEAEA',
  				'100': '#FDD8D8',
  				'200': '#FAB3B3',
  				'300': '#F78D8D',
  				'400': '#F15A5A',
  				'500': '#D62828',
  				'600': '#B81D1D',
  				'700': '#9A1515',
  				'800': '#7C0E0E',
  				'900': '#5E0909'
  			},
  			'k-verde': {
  				'50': '#EDF6F0',
  				'100': '#D9EDDB',
  				'200': '#B6DAB7',
  				'300': '#92C893',
  				'400': '#6DB570',
  				'500': '#3A8E5A',
  				'600': '#2E784A',
  				'700': '#235E3A',
  				'800': '#17452B',
  				'900': '#0C2C1B'
  			},
  			'k-amarillo': {
  				'50': '#FEF6E7',
  				'100': '#FDECCF',
  				'200': '#FCD9A0',
  				'300': '#FBC570',
  				'400': '#FAB240',
  				'500': '#FCA311',
  				'600': '#D9860B',
  				'700': '#B66A07',
  				'800': '#934F04',
  				'900': '#703702'
  			},
  			'k-azul': {
  				'50': '#E0F2F9',
  				'100': '#B3E1F2',
  				'200': '#80CEEB',
  				'300': '#4DBAE4',
  				'400': '#1AA7DD',
  				'500': '#0077B6',
  				'600': '#006399',
  				'700': '#004F7D',
  				'800': '#003B60',
  				'900': '#002744'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Arial',
  				'sans-serif'
  			],
  			serif: [
  				'Times New Roman',
  				'serif'
  			],
        DEFAULT: ['Arial', 'sans-serif'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
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
  					height: 0
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
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
  		border: 'hsl(var(--border))',
  		input: 'hsl(var(--input))',
  		ring: 'hsl(var(--ring))',
  		radius: 'var(--radius)'
  	}
  },
  plugins: [require('tailwindcss-animate')],
};
