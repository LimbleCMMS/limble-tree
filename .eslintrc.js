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

/**
 * This object contains a combination of all the various rules files
 * for javascript and typescript and linting
 */
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
      es2021: true,
      jasmine: true,
      worker: true,
      serviceworker: true
   },
   /** Files that eslint should ignore */
   ignorePatterns: ["node_modules", "scripts", ".eslintrc.js", "eslint"],
   overrides: [
      {
         files: ["*.ts", "*.js"],
         /** This switches the parser from the default to the typescript parser */
         parser: "@typescript-eslint/parser",
         parserOptions: {
            ecmaVersion: 2022,
            /** Indicates the typescript config to use for linting.
             *
             * We use tsconfig.eslint.json instead of including all of the configs separately
             * because of the performance concerns outlined here:
             * https://github.com/typescript-eslint/typescript-eslint/issues/1192#issuecomment-552990973.
             * Our lint process was taking upwards of 15+ minutes in some cases, even with caching;
             * but after combining all the target files in a single config, it is much much faster.
             *
             * Note that the "references" option in tsconfig files are ignored
             * by the parser: See https://github.com/typescript-eslint/typescript-eslint/issues/2094
             * -- 8/24/2020
             */
            project: ["tsconfig.eslint.json"],
            tsconfigRootDir: __dirname
         },
         plugins: [
            /** This allows us to use the typescript rules */
            "@typescript-eslint",
            /** This allows us to manage eslint comment directives */
            "eslint-comments",
            /** This allows us to lint Angular-specific stuff */
            "@angular-eslint/eslint-plugin"
         ],
         extends: [
            /** This extra extends is necessary to extract inline templates from within
             * Component metadata, e.g.:
             *
             * @Component({
             *  template: `<h1>Hello, World!</h1>`
             * })
             * ...
             *
             * It works by extracting the template part of the file and treating it as
             * if it were a full .html file, and it will therefore match the html-specific
             * configuration below when it comes to actual rules etc.
             *
             * NOTE: This processor has virtually no performance impact if you don't use
             * inline templates in your projects.
             */
            "plugin:@angular-eslint/template/process-inline-templates"
         ],
         /**
          * The rules that eslint will use to determine what should be reported.
          * Note that each rule is accompanied by a TSDoc comment. The
          * first part of each comment is eslint's brief description of the rule,
          * taken from the eslint documentation. Then, following the `@remarks`
          * tag, are comments about why we have the rule configured the way we do.
          */
         rules: scriptRules
      },
      /* Config for angular template files */
      {
         files: ["*.html"],
         parser: "@angular-eslint/template-parser",
         plugins: ["@angular-eslint/template"],
         rules: angularEslintTemplateRules
      }
   ]
};
