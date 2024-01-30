module.exports = {
  root: true,
  rules: {
    // Note: you must disable the base rule as it can report incorrect errors
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "none",
  },
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
};
