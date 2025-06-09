/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // >>> PASTIKAN JALUR INI BENAR UNTUK FILE-FILE REACT ANDA <<<
    // Ini memberi tahu Tailwind untuk memindai semua file JS/JSX/TS/TSX di dalam folder src dan subfolder-nya.
    "./src/**/*.{js,jsx,ts,tsx}",
    // Ini juga sering diperlukan untuk memindai index.html di folder public.
    "./public/index.html",
  ],
  theme: {
    extend: {
      // Menambahkan font Inter jika Anda ingin menggunakannya secara konsisten
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}