/** Search for "the future" to see areas that we intended to revisit. */

const eslintPossibleErrorRules = require("./eslint/eslint_possibleErrors");
const eslintBestPracticeRules = require("./eslint/eslint_bestPractices");
const eslintVariableRules = require("./eslint/eslint_variables");
const eslintStylePreferenceRules = require("./eslint/eslint_stylePreferences");
const eslintES6Rules = require("./eslint/eslint_ES6");
const typescriptExtensionRules = require("./eslint/typescript-eslint_extensions");
const typescriptRules = require("./eslint/typescript-eslint_core");
const eslintCommentRules = require("./eslint/eslint-comments");
const angularEslintFunctionalityRules = require("./eslint/angular-eslint_functionality");
const angularEslintMaintainabilityRules = require("./eslint/angular-eslint_maintainability");
const angularEslintStyleRules = require("./eslint/angular-eslint_style");
const angularEslintTemplateRules = require("./eslint/angular-eslint_template.js");

const scriptRules = Object.assign(
   {},
   eslintPossibleErrorRules,
   eslintBestPracticeRules,
   eslintVariableRules,
   eslintStylePreferenceRules,
   eslintES6Rules,
   typescriptExtensionRules,
   typescriptRules,
   eslintCommentRules,
   angularEslintFunctionalityRules,
   angularEslintMaintainabilityRules,
   angularEslintStyleRules
);

module.exports = {
   env: {
      /** Tells eslint whether to assume that the code is in a browser environment */
      browser: true,
      es6: true,
      /** Tells eslint that we are using jasmine. */
      jasmine: true
   },
   /** Files that eslint should ignore */
   ignorePatterns: ["node_modules", ".eslintrc.js", "eslint"],
   overrides: [
      {
         files: ["*.ts", "*.js"],
         /** This switches the parser from the default to the typescript parser */
         parser: "@typescript-eslint/parser",
         parserOptions: {
            sourceType: "module",
            ecmaVersion: 2020,
            project: [
               "./projects/limble-tree/tsconfig.lib.json",
               "./projects/limble-tree/tsconfig.spec.json",
               "./projects/sandbox/tsconfig.app.json",
               "./projects/sandbox/tsconfig.spec.json"
            ]
         },
         plugins: [
            /** This allows us to use the typescript rules */
            "@typescript-eslint",
            /** This allows us to manage eslint comment directives */
            "eslint-comments",
            /** This allows us to lint Angular-specific stuff */
            "@angular-eslint/eslint-plugin"
         ],
         extends: ["plugin:@angular-eslint/template/process-inline-templates"],
         rules: scriptRules
      },
      {
         files: ["*.html"],
         parser: "@angular-eslint/template-parser",
         plugins: ["@angular-eslint/template"],
         rules: angularEslintTemplateRules
      }
   ]
};
