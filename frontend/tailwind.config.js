/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                display: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            colors: {
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
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))'
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                /* Stone shades for direct use */
                stone: {
                    50: 'hsl(var(--stone-50))',
                    100: 'hsl(var(--stone-100))',
                    200: 'hsl(var(--stone-200))',
                    300: 'hsl(var(--stone-300))',
                    400: 'hsl(var(--stone-400))',
                    500: 'hsl(var(--stone-500))',
                    600: 'hsl(var(--stone-600))',
                    700: 'hsl(var(--stone-700))',
                    800: 'hsl(var(--stone-800))',
                    900: 'hsl(var(--stone-900))',
                    950: 'hsl(var(--stone-950))',
                },
                /* Rose shades for direct use */
                rose: {
                    50: 'hsl(var(--rose-50))',
                    100: 'hsl(var(--rose-100))',
                    200: 'hsl(var(--rose-200))',
                    300: 'hsl(var(--rose-300))',
                    400: 'hsl(var(--rose-400))',
                    500: 'hsl(var(--rose-500))',
                    600: 'hsl(var(--rose-600))',
                    700: 'hsl(var(--rose-700))',
                    800: 'hsl(var(--rose-800))',
                    900: 'hsl(var(--rose-900))',
                },
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            boxShadow: {
                'rose': '0 10px 30px -10px hsl(350 89% 60% / 0.3)',
                'rose-glow': '0 0 40px hsl(350 89% 60% / 0.4)',
                'elegant': '0 10px 30px -10px rgb(0 0 0 / 0.15)',
                'inner-soft': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' }
                },
                'fade-in-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'fade-in-down': {
                    from: { opacity: '0', transform: 'translateY(-20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in-left': {
                    from: { opacity: '0', transform: 'translateX(-30px)' },
                    to: { opacity: '1', transform: 'translateX(0)' }
                },
                'slide-in-right': {
                    from: { opacity: '0', transform: 'translateX(30px)' },
                    to: { opacity: '1', transform: 'translateX(0)' }
                },
                'scale-in': {
                    from: { opacity: '0', transform: 'scale(0.95)' },
                    to: { opacity: '1', transform: 'scale(1)' }
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px hsl(350 89% 60% / 0.2)' },
                    '50%': { boxShadow: '0 0 40px hsl(350 89% 60% / 0.4)' }
                },
                'spin-slow': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' }
                },
                'draw-line': {
                    from: { strokeDashoffset: '1000' },
                    to: { strokeDashoffset: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'fade-in-up': 'fade-in-up 0.6s ease-out',
                'fade-in-down': 'fade-in-down 0.6s ease-out',
                'slide-in-left': 'slide-in-left 0.7s ease-out',
                'slide-in-right': 'slide-in-right 0.7s ease-out',
                'scale-in': 'scale-in 0.5s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'spin-slow': 'spin-slow 8s linear infinite',
                'draw-line': 'draw-line 3s ease-in-out forwards'
            },
            transitionTimingFunction: {
                'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
