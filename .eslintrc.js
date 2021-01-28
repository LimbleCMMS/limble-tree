/** Search for "the future" to see areas that we intended to revisit. */

const eslintPossibleErrorRules = require("../webApp/eslint/eslint_possibleErrors");
const eslintBestPracticeRules = require("../webApp/eslint/eslint_bestPractices");
const eslintVariableRules = require("../webApp/eslint/eslint_variables");
const eslintStylePreferenceRules = require("../webApp/eslint/eslint_stylePreferences");
const eslintES6Rules = require("../webApp/eslint/eslint_ES6");
const typescriptExtensionRules = require("../webApp/eslint/typescript-eslint_extensions");
const typescriptRules = require("../webApp/eslint/typescript-eslint_core");
const eslintCommentRules = require("../webApp/eslint/eslint-comments");
const angularEslintFunctionalityRules = require("../webApp/eslint/angular-eslint_functionality");
const angularEslintMaintainabilityRules = require("../webApp/eslint/angular-eslint_maintainability");
const angularEslintStyleRules = require("../webApp/eslint/angular-eslint_style");
const angularEslintTemplateRules = require("../webApp/eslint/angular-eslint_template.js");

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
      es6: true,
      /** Tells eslint that we are using jasmine. */
      jasmine: true
   },
   /** Files that eslint should ignore */
   ignorePatterns: ["node_modules", ".eslintrc.js"],
   /** Eslint will ignore the fact that these appear to be undefined in some files.
    * We should avoid adding to this list as much as possible, and in fact we should
    * work to eliminate this list altogether.
    */
   globals: {},
   overrides: [
      {
         files: ["*.ts", "*.js"],
         /** This switches the parser from the default to the typescript parser */
         parser: "@typescript-eslint/parser",
         parserOptions: {
            /** Tells eslint what kind of module system we are using.
             * "module" indicates ES6-style imports and exports.
             */
            sourceType: "module",
            ecmaVersion: 2020,
            /** Indicates our typescript config.
             *
             * Note that the "references" option in tsconfig files are ignored
             * by the parser: See https://github.com/typescript-eslint/typescript-eslint/issues/2094
             * -- 8/24/2020
             */
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
             * if it were a full .html file, and it will therefore match the configuration
             * specific for *.html above when it comes to actual rules etc.
             *
             * NOTE: This processor will skip a lot of work when it runs if you don't use
             * inline templates in your projects currently, and when it runs on a non-Component
             * file so there is no great benefit in removing it, but you can if you want to.
             */
            "plugin:@angular-eslint/template/process-inline-templates"
         ],
         /**
          * The rules that eslint will use to determine what should be reported.
          * Note that each rule is accompanied by a TSDoc comment. The
          * first part of each comment is eslint's brief description of the rule,
          * taken from the eslint documentation. Then, following the `@remarks`
          * tag, are comments about why we have the rule configured the way we do,
          * along with other notes.
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
