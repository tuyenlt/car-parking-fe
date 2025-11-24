import { fontFamily } from 'tailwindcss/defaultTheme';
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Cho phép Tailwind quét toàn bộ file React
  ],
  darkMode: 'class', // 'media' hoặc 'class'
  theme: {
    extend: {
      zIndex: {
        '-1': '-1',
      },
      flexGrow: {
        5: '5',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
