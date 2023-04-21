/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [    
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'senderTextColor': '#ffffff',
      'senderBGColor': '#ffb5e6',
      'receiverTextColor': '#343434',
      'receiverBGColor': '#cfffcf',
    },
  },

  plugins: [
    require("daisyui")],
}

