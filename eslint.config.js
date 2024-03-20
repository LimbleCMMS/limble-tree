import { commentDirectiveRules } from "./eslint/comment-directives/comment-directives.js";
import { problemRules } from "./eslint/core/problems.js";
import { suggestionRules } from "./eslint/core/suggestions.js";
import { extensionRulesForTypescript } from "./eslint/typescript/extension-rules.js";
import { typescriptRules } from "./eslint/typescript/typescript-rules.js";
import tseslint from "typescript-eslint";
import commentDirectivesPlugin from "eslint-plugin-eslint-comments";
import { angularTemplateRules } from "./eslint/angular/angular-eslint_template.js";
import * as templateParser from "@angular-eslint/template-parser";
import templatePlugin from "@angular-eslint/eslint-plugin-template";
import angularPlugin from "@angular-eslint/eslint-plugin";
import { angularRules as ngRules } from "./eslint/angular/angular-eslint.js";
import importPlugin from "eslint-plugin-import";
import { importRules } from "./eslint/imports/imports.js";

const jsRules = {
   ...problemRules,
   ...suggestionRules
};

const tsRules = {
   ...typescriptRules,
   ...extensionRulesForTypescript
};

export default [
   {
      ignores: [
         "node_modules/**/*",
         "dist/**/*",
         "coverage/**/*",
         "out-tsc/**/*",
         ".angular/**/*"
      ]
   },
   {
      plugins: {
         directives: commentDirectivesPlugin
      },
      rules: commentDirectiveRules
   },
   {
      files: ["**/*.ts"],
      languageOptions: {
         parser: tseslint.parser,
         parserOptions: {
            ecmaVersion: "latest",
            project: ["tsconfig.eslint.json"]
         }
      },
      plugins: {
         typescript: tseslint.plugin,
         directives: commentDirectivesPlugin,
         angular: angularPlugin,
         import: importPlugin
      },
      settings: {
         "import/parser": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
         },
         "import/resolver": {
            typescript: true
         }
      },
      rules: {
         ...jsRules,
         ...tsRules,
         ...ngRules,
         ...importRules
      }
   },
   {
      files: ["**/*.js"],
      plugins: {
         directives: commentDirectivesPlugin,
         import: importPlugin
      },
      rules: {
         ...jsRules,
         ...importRules
      }
   },
   {
      files: ["**/*.html"],
      languageOptions: {
         parser: {
            ...templateParser,
            /* This added property is a hack in order to make the parser serializable.
             * See https://github.com/eslint/eslint/pull/16944.
             * Presumably, an upcoming version of the parser will include this
             * property and we will be able to delete this line. */
            meta: { name: "angular-eslint/template-parser", version: "17.3.0" }
         }
      },
      plugins: {
         template: templatePlugin
      },
      rules: angularTemplateRules
   }
];
