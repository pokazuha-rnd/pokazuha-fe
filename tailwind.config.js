/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors from Logo
        'poka-cyan': {
          DEFAULT: '#00BCD4',
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
        },
        'poka-magenta': {
          DEFAULT: '#E91E63',
          50: '#FCE4EC',
          100: '#F8BBD9',
          200: '#F48FB1',
          300: '#F06292',
          400: '#EC407A',
          500: '#E91E63',
          600: '#D81B60',
          700: '#C2185B',
          800: '#AD1457',
          900: '#880E4F',
        },
        'poka-yellow': {
          DEFAULT: '#FDD835',
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FDD835',
          600: '#FBC02D',
          700: '#F9A825',
          800: '#F57F17',
          900: '#E65100',
        },
        // Neutral colors
        'poka-gray': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        'poka-dark': '#1A1A1A',
      },
      fontFamily: {
        'sans': ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 40px -15px rgba(0, 188, 212, 0.15), 0 10px 20px -10px rgba(0, 0, 0, 0.08)',
        'button': '0 4px 15px rgba(233, 30, 99, 0.3)',
        'button-hover': '0 8px 25px rgba(233, 30, 99, 0.4)',
        'cyan': '0 4px 15px rgba(0, 188, 212, 0.3)',
        'cyan-hover': '0 8px 25px rgba(0, 188, 212, 0.4)',
      },
    },
  },
  plugins: [],
}