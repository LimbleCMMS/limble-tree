/**
 * Rules for ESLint directive comments (e.g. //eslint-disable-next-line).
 */

export const commentDirectiveRules = {
   /**
    * Require a eslint-enable comment for every eslint-disable comment
    *
    * @remarks
    * Level 2 to prevent accidentally turning off a rule for more code
    * than intended.
    */
   "directives/disable-enable-pair": "error",

   /**
    * Disallow a eslint-enable comment for multiple eslint-disable comments
    *
    * @remarks
    * Level 2 to enforce consistency and readability, and to avoid potential
    * mistakes.
    */
   "directives/no-aggregating-enable": "error",

   /**
    * Disallow duplicate eslint-disable comments
    *
    * @remarks
    * Level 2 because such directives are unnecessary and confusing
    */
   "directives/no-duplicate-disable": "error",

   /**
    * Disallow eslint-disable comments without rule names
    *
    * @remarks
    * Level 2 because eslint should never be completely disabled for any
    * line of code.
    */
   "directives/no-unlimited-disable": "error",

   /**
    * Disallow unused eslint-disable comments
    *
    * @remarks
    * Level 2 because such directives are unnecessary and confusing
    */
   "directives/no-unused-disable": "error",

   /**
    * Disallow unused eslint-enable comments
    *
    * @remarks
    * Level 2 because such directives are unnecessary and confusing
    */
   "directives/no-unused-enable": "error",

   /**
    * Disallow eslint-disable comments about specific rules
    *
    * @remarks
    * Level 0 because there are currently no particular rules we would like to
    * specifically prohibit disabling. We may revisit in the future.
    */
   "directives/no-restricted-disable": "off",

   /**
    * Disallow ESLint directive-comments
    *
    * @remarks
    * Level 0 because, unfortunately, there will always be at least a few
    * exceptions to some rules.
    */
   "directives/no-use": "off",

   /**
    * Require include descriptions in ESLint directive-comments
    *
    * @remarks
    * Level 2 to force developers to provide a reason for disabling the linter
    */
   "directives/require-description": ["error", { ignore: ["eslint-enable"] }]
};
