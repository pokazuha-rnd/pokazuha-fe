/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Culori extrase din logo Pokazuha
        'poka-green': '#4CAF50',      // Verde din logo
        'poka-lime': '#8BC34A',       // Verde deschis
        'poka-yellow': '#FDD835',     // Galben strălucitor
        'poka-orange': '#FF9800',     // Portocaliu
        'poka-pink': '#E91E63',       // Roz/Magenta
        'poka-purple': '#9C27B0',     // Mov
        'poka-blue': '#2196F3',       // Albastru logo
        
        // Scheme principale
        primary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',  // Verde principal
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        accent: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',  // Portocaliu principal
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
        highlight: {
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FDD835',  // Galben principal
          600: '#FBC02D',
          700: '#F9A825',
          800: '#F57F17',
          900: '#F57F17',
        },
        vibrant: {
          pink: '#E91E63',
          purple: '#9C27B0',
          blue: '#2196F3',
        }
      },
    },
  },
  plugins: [],
}