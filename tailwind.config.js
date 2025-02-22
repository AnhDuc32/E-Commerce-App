/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}', 
    './components/**/*.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        "cus-blue": "#0096c7",
        "cus-light-blue": "#a0e4ff",
      },
    },
  },
  plugins: [],
};
