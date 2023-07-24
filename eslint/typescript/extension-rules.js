/**
 * In some cases, ESLint provides a rule itself, but it doesn't support TypeScript
 * syntax; either it crashes, or it ignores the syntax, or it falsely reports
 * against it. In these cases, we use what typescript-eslint calls an extension
 * rule; a rule that has the same functionality, but also supports TypeScript.
 *
 * Note that the original eslint rule should be turned off if there is a typescript
 * extension rule which replaces it.
 */

export const extensionRulesForTypescript = {
   /**
    * Enforce consistent brace style for blocks
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/brace-style": "off",

   /**
    * Require or disallow trailing commas
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "typescript/comma-dangle": "off",

   /**
    * Enforces consistent spacing before and after commas
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/comma-spacing": "off",

   /**
    * Enforce or disallow the use of the record type
    *
    * @remarks
    * This rule is intended to improve consistency; but I don't have a strong
    * opinion on this at the moment, so it is off. We may revisit in the
    * future.
    */
   "typescript/consistent-indexed-object-style": "off",

   /**
    * Enforce default parameters to be last
    *
    * @remarks
    * This is level 2 partly to enforce consistency and readability,
    * but also because this pattern tends to be easier to utilize.
    * There is no reason not to do it.
    */
   "typescript/default-param-last": "error",

   /**
    * Enforce dot notation whenever possible
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/dot-notation": "off",

   /**
    * Require or disallow spacing between function identifiers and
    * their invocations
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/func-call-spacing": "off",

   /**
    * Enforce consistent indentation
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/indent": "off",

   /**
    * Require or disallow initialization in variable declarations
    *
    * @remarks
    * This is turned off because I don' believe it would be useful.
    */
   "typescript/init-declarations": "off",

   /**
    * Enforce consistent spacing between property names and type annotations
    * in types and interfaces.
    *
    * @remarks
    * Already handled by Prettier.
    */
   "typescript/key-spacing": "off",

   /**
    * Enforce consistent spacing before and after keywords
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/keyword-spacing": "off",

   /**
    * Require empty lines around comments.
    *
    * @remarks
    * Not useful.
    */
   "typescript/lines-around-comment": "off",

   /**
    * Require or disallow an empty line between class members
    *
    * @remarks
    * Not configurable enough for my liking.
    */
   "typescript/lines-between-class-members": "off",

   /**
    * Disallow generic `Array` constructors
    *
    * @remarks
    * This is turned off because it is not a priority at this time.
    * We may revisit in the future.
    */
   "typescript/no-array-constructor": "off",

   /**
    * Disallow duplicate class members
    *
    * @remarks
    * This is level 2 because either the second of the duplicate members is
    * a mistake, or the first of the duplicate members should be deleted.
    */
   "typescript/no-dupe-class-members": "error",

   /**
    * Disallow duplicate module imports
    *
    * @remarks
    * This is level 2 to enforce consistency and readability
    */
   "typescript/no-duplicate-imports": "error",

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
   "typescript/no-empty-function": "warn",

   /**
    * Disallow unnecessary parentheses
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/no-extra-parens": "off",

   /**
    * Disallow unnecessary semicolons
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/no-extra-semi": "off",

   /**
    * Disallow `this` keywords outside of classes or class-like objects
    *
    * @remarks
    * Such code is usually a mistake or a misunderstanding of the
    * language.
    */
   "typescript/no-invalid-this": "error",

   /**
    * Disallow function declarations that contain unsafe references
    * inside loop statements
    *
    * @remarks
    * This rule is not reliable enough to use at this time.
    */
   "typescript/no-loop-func": "off",

   /**
    * Disallow literal numbers that lose precision
    *
    * @remarks
    * This is level 2 because there is no reason to specify a
    * number to a level of precision that is not supported.
    * It may cause unanticipated behavior.
    */
   "typescript/no-loss-of-precision": "error",

   /**
    * Disallow magic numbers
    *
    * @remarks
    * This is turned off because, though certainly useful, this rule
    * is sometimes more work than it is worth. We may revisit in the future.
    */
   "typescript/no-magic-numbers": "off",

   /**
    * Disallow specified modules when loaded by `import`
    */
   "typescript/no-restricted-imports": "error",

   /**
    * Disallow variable declarations from shadowing variables
    * declared in the outer scope
    *
    * @remarks
    * This is level 2 because such code is unnecessarily confusing and can
    * easily lead to bugs.
    */
   "typescript/no-shadow": "error",

   /**
    * Disallow unused expressions
    *
    * @remarks
    * Obviously, if it is unused, we should get rid of it to clean up
    * the code.
    */
   "typescript/no-unused-expressions": "error",

   /**
    * Disallow unused variables
    *
    * @remarks
    * Obviously, if a variable is not used it should be removed to improve
    * readability and efficiency. This is not level 2 because sometimes
    * variables go unused for long periods of time during development.
    */
   "typescript/no-unused-vars": "warn",

   /**
    * Disallow the use of variables before they are defined
    *
    * @remarks
    * This is turned off because it is not that useful. Typescript will
    * already throw errors if we try to use a variable that isn't defined --
    * this rule goes beyond that and requires the variable to be defined
    * *on a previous line* in the file, not on a subsequent line. This can
    * get pretty annoying. It would flag this code:
    *
    * ```typescript
    * const clickHandler = () => {
    *    //This will only run when a user clicks a button.
    *    //It literally cannot run before `a` is defined.
    *    console.log(a); //error, because the rule thinks `a` isn't defined yet.
    * }
    * const a = 10
    * ```
    *
    * For this reason, we leave the rule turned off.
    */
   "typescript/no-use-before-define": "off",

   /**
    * Disallow unnecessary constructors
    *
    * @remarks
    * This is level 2 because empty constructors do not add anything
    * to the code and should be removed.
    */
   "typescript/no-useless-constructor": "error",

   /**
    * Enforce consistent spacing inside braces
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/object-curly-spacing": "off",

   /**
    * Require or disallow padding lines between statements
    *
    * @remarks
    * This is off because Prettier already handles it.
    */
   "typescript/padding-line-between-statements": "off",

   /**
    * Enforce the consistent use of either backticks, double, or single quotes
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/quotes": "off",

   /**
    * Disallow async functions which have no await expression and do not
    * return a promise.
    *
    * @remarks
    * Async functions that don't use `await` won't actually run asynchronously.
    * If the function returns a promise, there is still value in declaring the
    * function async even if there are no `await`s
    * (see the `typescript/promise-function-async` rule), but otherwise,
    * marking it as `async` does not do anything except wrap the return
    * in a promise for no reason. It could be the unintentional result of
    * refactoring. Some people use it as a shortcut to wrap a value in an
    * immediately resolved promise, but if that is what you want, you
    * should also explicitly wrap the return value in a Promise.resolve()
    * so your intentions are clear.
    */
   "typescript/require-await": "warn",

   /**
    * Enforces consistent returning of awaited values
    *
    * @remarks
    * This is level 2 because code flagged by this rule is unnecessarily
    * inefficient and complex, and may indicate a lack of understanding
    * about how async functions work.
    */
   "typescript/return-await": "error",

   /**
    * Require or disallow semicolons instead of ASI
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/semi": "off",

   /**
    * Enforces consistent spacing before function parenthesis
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "typescript/space-before-function-paren": "off",

   /**
    * This rule is aimed at ensuring there are spaces around infix operators
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "typescript/space-infix-ops": "off",

   /**
    * Enforce consistent spacing before blocks.
    *
    * @remarks
    * This rule is level 0 because Prettier should already take care of it.
    */
   "typescript/space-before-blocks": "off"
};
