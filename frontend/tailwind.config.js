/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';

module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}', // Next.js App Router
        './pages/**/*.{js,ts,jsx,tsx}', // For pages folder if used
        './components/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}', // if using src directory
    ],
    darkMode: 'class', // Enables `dark` class based theming
    theme: {
        extend: {
        // Optional: extend with OKLCH support or your own CSS variables
        colors: {
            background: 'oklch(var(--background) / <alpha-value>)',
            foreground: 'oklch(var(--foreground) / <alpha-value>)',
            primary: 'oklch(var(--primary) / <alpha-value>)',
            // Add more if desired...
        },
        borderRadius: {
            sm: 'calc(var(--radius) - 4px)',
            md: 'calc(var(--radius) - 2px)',
            lg: 'var(--radius)',
            xl: 'calc(var(--radius) + 4px)',
        },
        keyframes: {
            gradientShift: {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
            },
        },
        animation: {
            gradientShift: 'gradientShift 8s ease infinite',
        },
        },
    },
    plugins: [
        animate, // if you're using `tw-animate-css`
    ],
};
