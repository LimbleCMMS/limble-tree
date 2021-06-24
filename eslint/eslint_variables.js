/**
 * These rules relate to variable declaration and initialization.
 * They are included with eslint.
 */

module.exports = {
   /**
    * require or disallow initialization in variable declarations
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "init-declarations": 0,

   /**
    * disallow deleting variables
    *
    * @remarks
    * This is level 2 because such code is syntactically incorrect and may lead
    * to undefined behavior.
    */
   "no-delete-var": 2,

   /**
    * disallow labels that share a name with a variable
    *
    * @remarks
    * Not applicable when the `no-labels` rule is turned on.
    */
   "no-label-var": 0,

   /**
    * disallow specified global variables
    *
    * @remarks
    * This is turned off because we don't have any globals we would like to
    * disallow at this time. We may revisit in the future.
    */
   "no-restricted-globals": 0,

   /**
    * disallow variable declarations from shadowing variables declared in the
    * outer scope
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-shadow": 0,

   /**
    * disallow identifiers from shadowing restricted names
    *
    * @remarks
    * This is level 2 because such code is very likely to cause bugs and is
    * probably a mistake. There is no good reason to shadow restricted names.
    */
   "no-shadow-restricted-names": 2,

   /**
    * disallow the use of undeclared variables unless mentioned in `global`
    * comments
    *
    * @remarks
    * This is level 2 because such code is usually a mistake -- an accidental
    * global, a misspelled variable, etc. When it is not a mistake, it can be
    * added to a `global` comment or to this eslint config as a global.
    */
   "no-undef": 2,

   /**
    * disallow initializing variables to `undefined`
    *
    * @remarks
    * This rule may be detrimental when using typescript. For example, a variable
    * declared as `const abc: number | undefined;` would throw an error because const
    * variables must be initialized at declaration. If we want it to be undefined,
    * we have to initialize it that way, which would break this rule.
    */
   "no-undef-init": 0,

   /**
    * disallow the use of `undefined` as an identifier
    *
    * @remarks
    * Not applicable when `no-global-assign` and `no-shadow-restricted-names`
    * are turned on.
    */
   "no-undefined": 0,

   /**
    * disallow unused variables
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-unused-vars": 0,

   /**
    * disallow the use of variables before they are defined
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-use-before-define": 0
};
