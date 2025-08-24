const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
import { join } from "path";

/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: ["class"],
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
    theme: {
       container: {
         center: true,
         padding: "1.25rem",
          screens: {
           "2xl": "1400px",
        },
    },
       extend: {
         spacing: {
           navbar: "4.375rem",
      },
      height: {
        "screen-navbar": "calc(100svh - var(--nav-height))",
      },
      minHeight: {
        "screen-navbar": "calc(100svh - var(--nav-height))",
      },
      borderRadius: {
        lg: "10px",
        md: "8px",
        sm: "6px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      }
      // fontFamily: {
      // 	sans: ["var(--font-main)", ...fontFamily.sans],
      // },
    },
  },
  plugins: [],
};
