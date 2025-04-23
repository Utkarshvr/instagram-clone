/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        mont: ["mont", "sans-serif"],
        montSemiBold: ["montSemiBold", "sans-serif"],
        montBold: ["montBold", "sans-serif"],
        montThin: ["montThin", "sans-serif"],
        montExtraLight: ["montExtraLight", "sans-serif"],
        montLight: ["montLight", "sans-serif"],
        montMedium: ["montMedium", "sans-serif"],
        montSemiBold: ["montSemiBold", "sans-serif"],
        montBold: ["montBold", "sans-serif"],
        montExtraBold: ["montExtraBold", "sans-serif"],
        montBlack: ["montBlack", "sans-serif"],
      },
    },
  },
  plugins: [],
};
