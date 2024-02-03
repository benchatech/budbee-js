/** @type {import('eslint').ESLint.ConfigData} */
// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/quotes": ["error", "double", { allowTemplateLiterals: true }],
    "@typescript-eslint/semi": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "eol-last": ["error", "always"],
    "quotes": ["error", "double", { allowTemplateLiterals: true }],
    "max-len": ["error", 99, { ignoreComments: true }],
    "import/order": ["error", {
      "alphabetize": {
        caseInsensitive: true,
        order: "asc",
      },
      "groups": ["external", "builtin", "parent", ["sibling", "index"]],
      "newlines-between": "never",
      "pathGroupsExcludedImportTypes": ["builtin"],
    }],
  },
};
