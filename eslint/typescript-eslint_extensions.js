/**
 * In some cases, ESLint provides a rule itself, but it doesn't support TypeScript
 * syntax; either it crashes, or it ignores the syntax, or it falsely reports
 * against it. In these cases, we use what typescript-eslint calls an extension
 * rule; a rule that has the same functionality, but also supports TypeScript.
 *
 * Note that the original eslint rule should be turned off if there is a typescript
 * extension rule which replaces it.
 */

module.exports = {
   /**
    * Enforce consistent brace style for blocks
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/brace-style": 0,

   /**
    * Require or disallow trailing commas
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "@typescript-eslint/comma-dangle": 0,

   /**
    * Enforces consistent spacing before and after commas
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/comma-spacing": 0,

   /**
    * Enforce or disallow the use of the record type
    *
    * @remarks
    * This rule is intended to improve consistency; but I don't have a strong
    * opinion on this at the moment, so it is off. We may revisit in the
    * future.
    */
   "@typescript-eslint/consistent-indexed-object-style": 0,

   /**
    * Enforce default parameters to be last
    *
    * @remarks
    * This is level 2 partly to enforce consistency and readability,
    * but also because this pattern tends to be easier to utilize.
    * There is no reason not to do it.
    */
   "@typescript-eslint/default-param-last": 2,

   /**
    * enforce dot notation whenever possible
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/dot-notation": 0,

   /**
    * Require or disallow spacing between function identifiers and
    * their invocations
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/func-call-spacing": 0,

   /**
    * Enforce consistent indentation
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/indent": 0,

   /**
    * require or disallow initialization in variable declarations
    *
    * @remarks
    * This is turned off because I don' believe it would be useful.
    */
   "@typescript-eslint/init-declarations": 0,

   /**
    * Enforce consistent spacing before and after keywords
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/keyword-spacing": 0,

   /**
    * Require or disallow an empty line between class members
    *
    * @remarks
    * This is turned off because it is not a priority right now.
    * We may turn this on in the future.
    */
   "@typescript-eslint/lines-between-class-members": 0,

   /**
    * Disallow generic `Array` constructors
    *
    * @remarks
    * This is turned off because it is not a priority at this time.
    * We may revisit in the future.
    */
   "@typescript-eslint/no-array-constructor": 0,

   /**
    * Disallow duplicate class members
    *
    * @remarks
    * This is level 2 because either the second of the duplicate members is
    * a mistake, or the first of the duplicate members should be deleted.
    */
   "@typescript-eslint/no-dupe-class-members": 2,

   /**
    * disallow duplicate module imports
    *
    * @remarks
    * This is level 2 to enforce consistency and readability
    */
   "@typescript-eslint/no-duplicate-imports": 2,

   /**
    * Disallow empty functions
    *
    * @remarks
    * This is level 1 because empty functions are usually a mistake, and
    * when they are not mistakes they should have a comment in them
    * explaining why they are empty. That way, future developers don't
    * delete the function thinking it is useless. It is not level 2
    * because sometimes during development empty functions may hang
    * around for a while.
    */
   "@typescript-eslint/no-empty-function": 1,

   /**
    * Disallow unnecessary parentheses
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/no-extra-parens": 0,

   /**
    * Disallow unnecessary semicolons
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/no-extra-semi": 0,

   /**
    * disallow `this` keywords outside of classes or class-like objects
    *
    * @remarks
    * Such code is usually a mistake or a misunderstanding of the
    * language.
    */
   "@typescript-eslint/no-invalid-this": 2,

   /**
    * disallow function declarations that contain unsafe references
    * inside loop statements
    *
    * @remarks
    * This is level 2 because such code is error-prone and may not
    * work as expected. It is also harder to read and debug.
    */
   "@typescript-eslint/no-loop-func": 2,

   /**
    * Disallow literal numbers that lose precision
    *
    * @remarks
    * This is level 2 because there is no reason to specify a
    * number to a level of precision that is not supported.
    * It may cause unanticipated behavior.
    */
   "@typescript-eslint/no-loss-of-precision": 2,

   /**
    * Disallow magic numbers
    *
    * @remarks
    * This is turned off because, though sometimes useful, this rule
    * is often more work than it is worth.
    */
   "@typescript-eslint/no-magic-numbers": 0,

   /**
    * Disallow variable declarations from shadowing variables
    * declared in the outer scope
    *
    * @remarks
    * This is level 2 because such code is unnecessarily confusing and can
    * easily lead to bugs.
    */
   "@typescript-eslint/no-shadow": 2,

   /**
    * Disallow unused expressions
    *
    * @remarks
    * Obviously, if it is unused, we should get rid of it to clean up
    * the code.
    */
   "@typescript-eslint/no-unused-expressions": 2,

   /**
    * Disallow unused variables
    *
    * @remarks
    * Obviously, if a variable is not used it should be removed to improve
    * readability and efficiency. This is not level 2 because sometimes
    * variables go unused for long periods of time during development.
    */
   "@typescript-eslint/no-unused-vars": 1,

   /**
    * Disallow the use of variables before they are defined
    *
    * @remarks
    * This is turned off because it is not a high priority, and some
    * developers argue that it is not worth the effort. We may revisit
    * in the future.
    */
   "@typescript-eslint/no-use-before-define": 0,

   /**
    * Disallow unnecessary constructors
    *
    * @remarks
    * This is level 2 because empty constructors do not add anything
    * to the code and should be removed.
    */
   "@typescript-eslint/no-useless-constructor": 2,

   /**
    * Enforce consistent spacing inside braces
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/object-curly-spacing": 0,

   /**
    * Enforce the consistent use of either backticks, double, or single quotes
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/quotes": 0,

   /**
    * Disallow async functions which have no await expression
    *
    * @remarks
    * I'm not sure if this rule will be useful enough to be worthwhile.
    * We may need to revisit this in the future.
    */
   "@typescript-eslint/require-await": 0,

   /**
    * Enforces consistent returning of awaited values
    *
    * @remarks
    * This is level 1 because code flagged by this rule is unnecessarily
    * inefficient and complex, and may indicate a lack of understanding
    * about how async functions work. However, there are some rare valid
    * reasons to do it, so it is not level 2.
    */
   "@typescript-eslint/return-await": 1,

   /**
    * Require or disallow semicolons instead of ASI
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/semi": 0,

   /**
    * Enforces consistent spacing before function parenthesis
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "@typescript-eslint/space-before-function-paren": 0,

   /**
    * This rule is aimed at ensuring there are spaces around infix operators
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "@typescript-eslint/space-infix-ops": 0
};
