import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cta: '#5863F8',
        important: '#171D1C',
        general: '#434847',
        unimportant: '#B5B5B5',
        border: '#E9E9E9',
        unactive: '#F4F4F4',
      },
      screens: {
        first: '1430px',
        second: '1080px',
        third: '780px',
      },
    },
  },
  plugins: [],
};
export default config;
