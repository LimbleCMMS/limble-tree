/**
 * These rules relate to ES6, also known as ES2015.
 * They are included with eslint.
 */

module.exports = {
   /**
    * require braces around arrow function bodies
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "arrow-body-style": 0,

   /**
    * require parentheses around arrow function arguments
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "arrow-parens": 0,

   /**
    * enforce consistent spacing before and after the arrow in arrow functions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "arrow-spacing": 0,

   /**
    * require `super()` calls in constructors
    *
    * @remarks
    * This is level 2 because code that violates this rule will always
    * throw a runtime error
    */
   "constructor-super": 2,

   /**
    * enforce consistent spacing around `*` operators in generator functions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "generator-star-spacing": 0,

   /**
    * disallow reassigning class members
    *
    * @remarks
    * Code such as this is usually a mistake, and when it is not a mistake
    * it is confusing and should be refactored.
    */
   "no-class-assign": 2,

   /**
    * disallow arrow functions where they could be confused with comparisons
    *
    * @remarks
    * This rule is turned off because it seems like it could be more trouble
    * than it is worth. Also, Prettier sometimes conflicts with this rule.
    */
   "no-confusing-arrow": 0,

   /**
    * disallow reassigning `const` variables
    *
    * @remarks
    * This is level 2 because such code will throw an error at runtime.
    */
   "no-const-assign": 2,

   /**
    * disallow duplicate class members
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-dupe-class-members": 0,

   /**
    * disallow duplicate module imports
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-duplicate-imports": 0,

   /**
    * disallow `new` operators with the `Symbol` object
    *
    * @remarks
    * This is level 2 because such code will throw an error at runtime.
    */
   "no-new-symbol": 2,

   /**
    * disallow specified names in exports
    *
    * @remarks
    * This is turned off because we do not have any exports we would like
    * to restrict at this time beyond the other rules of this config. We
    * may revisit at some point in the future.
    */
   "no-restricted-exports": 0,

   /**
    * disallow specified modules when loaded by `import`
    *
    * @remarks
    * There is a typescript extension rule which overrides this.
    */
   "no-restricted-imports": 0,

   /**
    * disallow `this`/`super` before calling `super()` in constructors
    *
    * @remarks
    * This is level 2 because such code will throw an error at runtime.
    */
   "no-this-before-super": 2,

   /**
    * disallow unnecessary computed property keys in objects and classes
    *
    * @remarks
    * This is level 2 because such code is unnecessary and confusing.
    */
   "no-useless-computed-key": 2,

   /**
    * disallow unnecessary constructors
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-useless-constructor": 0,

   /**
    * disallow renaming import, export, and destructured assignments to
    * the same name
    *
    * @remarks
    * Obviously, such code is useless and should be removed.
    */
   "no-useless-rename": 2,

   /**
    * require `let` or `const` instead of `var`
    *
    * @remarks
    * let and const are more intuitive and less likely to cause name
    * conflicts or unintended shadowing. They are also more efficient
    * and easier to minify.
    */
   "no-var": 2,

   /**
    * require or disallow method and property shorthand syntax for object
    * literals
    *
    * @remarks
    * This is turned off right now because it is not a priority. We should
    * revisit in the future.
    */
   "object-shorthand": 0,

   /**
    * require using arrow functions for callbacks
    *
    * @remarks
    * Level 2 because we want lexical scoping in callbacks
    */
   "prefer-arrow-callback": 2,

   /**
    * require `const` declarations for variables that are never reassigned
    * after declared
    *
    * @remarks
    * const is more efficient and easier to minify. It is also an important
    * indicator of intent that future developers can use to better
    * understand the code. It is not level 2 because sometimes it may be
    * violated while the code is being written.
    */
   "prefer-const": 1,

   /**
    * require destructuring from arrays and/or objects
    *
    * @remarks
    * I don't see any benefit to enforcing this rule. Destructuring can be
    * cleaner in some situations, but usually I think normal access and
    * assignment are cleaner.
    */
   "prefer-destructuring": 0,

   /**
    * disallow `parseInt()` and `Number.parseInt()` in favor of binary,
    * octal, and hexadecimal literals
    *
    * @remarks
    * I'm not as familiar with this area, but it seems like a good idea.
    * So I've set it to level 1 for now. Revisit in the future.
    */
   "prefer-numeric-literals": 1,

   /**
    * require rest parameters instead of `arguments`
    *
    * @remarks
    * Rest parameters are more versatile and easier to use. This rule is
    * set to level 2 to enforce consistency.
    */
   "prefer-rest-params": 2,

   /**
    * require spread operators instead of `.apply()`
    *
    * @remarks
    * This is set to level 2 to enforce consistency and readability.
    */
   "prefer-spread": 2,

   /**
    * require template literals instead of string concatenation
    *
    * @remarks
    * This is set to level 2 to enforce consistency and readability.
    */
   "prefer-template": 2,

   /**
    * require generator functions to contain `yield`
    *
    * @remarks
    * I'm not very familiar with generators, but my understanding is that
    * typically when a generator does not have a `yield` it is a
    * mistake. This is also one of eslint's "recommended" rules.
    */
   "require-yield": 2,

   /**
    * enforce spacing between rest and spread operators and their expressions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "rest-spread-spacing": 0,

   /**
    * enforce sorted import declarations within modules
    *
    * @remarks
    * This is not a priority at this time. We may revisit at some point in
    * the future.
    */
   "sort-imports": 0,

   /**
    * require symbol descriptions
    *
    * @remarks
    * This is set to level 2 because adding a description can aid in
    * debugging and code clarity, and there isn't really a good reason
    * not to include it.
    */
   "symbol-description": 2,

   /**
    * require or disallow spacing around embedded expressions of template strings
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "template-curly-spacing": 0,

   /**
    * require or disallow spacing around the `*` in `yield*` expressions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "yield-star-spacing": 0
};
