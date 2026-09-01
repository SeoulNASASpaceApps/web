import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // Global ignores
  {
    ignores: [".next/**", "out/**", "next-env.d.ts", "**/*.js", "__tests__"],
  },

  // Base configurations
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Configuration for TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-console": "error",
      "no-unused-vars": "off", // Disable base rule to use TS version
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "no-useless-rename": "error",
      "object-shorthand": "error",
    },
  },

  // Prettier config must be last to override other configs
  prettierConfig
);
