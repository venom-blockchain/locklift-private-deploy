module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["import", "@typescript-eslint", "react", "react-hooks", "jest", "graphql"],
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:react/recommended",
  ],
  rules: {
    quotes: ["error", "double"],
    "import/no-default-export": 2,
    "import/no-unresolved": 2,
    "import/named": 2,
    "no-unused-vars": 2,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/prop-types": "off",
    "react/display-name": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/ban-types": "off",
    "graphql/template-strings": [
      "error",
      {
        env: "apollo",
      },
    ],
    "node/no-missing-import": "off",
    "node/no-unsupported-features/es-syntax": "off",
    "node/no-unpublished-import": "off",
    "node/no-unsupported-features/node-builtins": "off",
    "node/no-restricted-import": [
      "error",
      [
        {
          name: "@brizy/**",
          message: "Do not use @brizy/ui components directly, make sure you import them from '~/components/brizyUi'.",
        },
      ],
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: "./",
      },
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: "types/global.d.ts",
      rules: {
        "@typescript-eslint/interface-name-prefix": "off",
      },
    },
  ],
};
