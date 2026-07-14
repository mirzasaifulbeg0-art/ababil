// ESLint flat config. We reuse Next.js's recommended rules (Core Web Vitals +
// TypeScript) through FlatCompat, which bridges the older "extends" style into
// the new flat-config format.
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];
