import { commentDirectiveRules } from "./eslint/comment-directives/comment-directives.js";
import { layoutRules } from "./eslint/core/layout.js";
import { problemRules } from "./eslint/core/problems.js";
import { suggestionRules } from "./eslint/core/suggestions.js";
import { extensionRulesForTypescript } from "./eslint/typescript/extension-rules.js";
import { typescriptRules } from "./eslint/typescript/typescript-rules.js";
import * as typescriptParser from "@typescript-eslint/parser";
import * as typescriptPlugin from "@typescript-eslint/eslint-plugin";
import commentDirectivesPlugin from "eslint-plugin-eslint-comments";
import { angularTemplateRules } from "./eslint/angular/angular-eslint_template.js";
import * as templateParser from "@angular-eslint/template-parser";
import templatePlugin from "@angular-eslint/eslint-plugin-template";
import angularPlugin from "@angular-eslint/eslint-plugin";
import { angularRules as ngRules } from "./eslint/angular/angular-eslint.js";

const jsRules = {
   ...problemRules,
   ...suggestionRules,
   ...layoutRules
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
         parser: typescriptParser,
         parserOptions: {
            ecmaVersion: "latest",
            project: ["tsconfig.eslint.json"]
         }
      },
      plugins: {
         typescript: typescriptPlugin,
         directives: commentDirectivesPlugin,
         angular: angularPlugin
      },
      rules: {
         ...jsRules,
         ...tsRules,
         ...ngRules
      }
   },
   {
      files: ["**/*.js"],
      plugins: {
         directives: commentDirectivesPlugin
      },
      rules: {
         ...jsRules
      }
   },
   {
      files: ["**/*.html"],
      languageOptions: {
         parser: {
            ...templateParser,
            // This added property is a hack in order to make the parser serializable.
            // See https://github.com/eslint/eslint/pull/16944.
            // Presumably, a new or upcoming version of the parser will include this property
            // and we can delete this line.
            meta: { name: "angular-eslint/template-parser", version: "14.4.0" }
         }
      },
      plugins: {
         template: templatePlugin
      },
      rules: angularTemplateRules
   }
];
