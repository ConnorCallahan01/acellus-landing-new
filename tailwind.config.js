/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        purple: {
          primary: '#6600e7',
          button: '#831bd5',
        },
        pink: {
          primary: '#d166a1',
          button: '#e17fa3',
        },
        gray: {
          line: '#d9d9d9',
        },
        // Background with transparency
        background: 'rgba(255,255,255,0.11)',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom, #6600e7, #d166a1)',
        'gradient-button': 'linear-gradient(to bottom, #831bd5, #e17fa3)',
        'gradient-primary-horizontal': 'linear-gradient(to right, #d166a1, #6600e7)',
      },
      boxShadow: {
        'nav': '0px 5px 10px rgba(0,0,0,0.25)',
        'card': '0px 10px 100px rgba(0,0,0,0.25)',
        'card-strong': '0px 10px 66px rgba(0,0,0,0.45)',
        'button': '0px 8px 9px rgba(0,0,0,0.25)',
        'toggle': '0px 15px 50px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        'nav': '15px',
        'card': '25px',
        'button': '15px',
        'doc': '20px',
        'toggle': '20px',
      },
      blur: {
        'nav-button': '12.5px',
        'gradient': '25px',
        'card': '7.5px',
        'button': '2.5px',
        'large': '75px',
      },
    },
  },
  plugins: [],
}

