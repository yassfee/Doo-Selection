/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f4efe4',
        ink: '#1c1a17',
        accent: '#ff6a3d',
      },
    },
  },
  plugins: [],
}
