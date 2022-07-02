const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{html,js}',
        './node_modules/tw-elements/dist/js/**/*.js',
        './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    ],
    purge: {
        safelist: [
            'alert-danger',
            'alert-success',
            'bg-red-100',
            'text-red-800',
            'bg-blue-100',
            'text-blue-600',
            'bg-yellow-100',
            'text-yellow-800',
            'bg-green-100',
            'text-green-800',
            'bg-gray-100',
            'text-gray-800',
            'bg-sky-100',
            'text-sky-800',
        ],
    },
    theme: {
        extend: {
            minHeight: {
                100: '100vh',
            },
            borderWidth: {
                1: '1px',
            },
        },
        colors: {
            ...colors,
        },
        fontFamily: {
            sans: [
                // "Montserrat",
                'Source Sans Pro',
                'Roboto',
                'Helvetica',
                'Arial',
                'sans-serif',
            ],
            serif: ['Merriweather', 'serif'],
        },
    },
    plugins: [
        require('tw-elements/dist/plugin'),
        require('tailwind-scrollbar'),
        require('flowbite/plugin'),
    ],
}
