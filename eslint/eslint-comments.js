/**
 * rules for ESLint directive comments (e.g. //eslint-disable-next-line).
 */

module.exports = {
   /**
    * require a eslint-enable comment for every eslint-disable comment
    *
    * @remarks
    * Level 2 to prevent accidentally turning off a rule for more code
    * than intended.
    */
   "eslint-comments/disable-enable-pair": 2,

   /**
    * disallow a eslint-enable comment for multiple eslint-disable comments
    *
    * @remarks
    * Level 2 to enforce consistency and readability, and to avoid potential
    * mistakes.
    */
   "eslint-comments/no-aggregating-enable": 2,

   /**
    * disallow duplicate eslint-disable comments
    *
    * @remarks
    * Level 2 because such directives are unnecessary and confusing
    */
   "eslint-comments/no-duplicate-disable": 2,

   /**
    * disallow eslint-disable comments without rule names
    *
    * @remarks
    * Level 2 because eslint should never be completely disabled for any
    * line of code.
    */
   "eslint-comments/no-unlimited-disable": 2,

   /**
    * disallow unused eslint-disable comments
    *
    * @remarks
    * Level 2 because such directives are unnecessary and confusing
    */
   "eslint-comments/no-unused-disable": 2,

   /**
    * disallow unused eslint-enable comments
    *
    * @remarks
    * Level 2 because such directives are unnecessary and confusing
    */
   "eslint-comments/no-unused-enable": 2,

   /**
    * disallow eslint-disable comments about specific rules
    *
    * @remarks
    * Level 0 because there are currently no particular rules we would like to
    * specifically prohibit disabling. We may revisit in the future.
    */
   "eslint-comments/no-restricted-disable": 0,

   /**
    * disallow ESLint directive-comments
    *
    * @remarks
    * Level 0 because, unfortunately, there will always be at least a few
    * exceptions to some rules.
    */
   "eslint-comments/no-use": 0,

   /**
    * require include descriptions in ESLint directive-comments
    *
    * @remarks
    * Level 2 to force developers to provide a reason for disabling the linter
    */
   "eslint-comments/require-description": [2, { ignore: ["eslint-enable"] }]
};
