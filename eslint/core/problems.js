export const problemRules = {
   /**
    * Enforce `return` statements in callbacks of array methods
    *
    * @remarks
    * This is level 2 because the array methods covered by this rule
    * require a return statement to be useful, so breaking this rule
    * is probably a mistake. If a return statement is not needed in your
    * logic, consider using forEach() instead.
    */
   "array-callback-return": "error",

   /**
    * Require `super()` calls in constructors
    *
    * @remarks
    * This is level 2 because code that violates this rule will always
    * throw a runtime error
    */
   "constructor-super": "error",

   /**
    * Enforce "for" loop update clause moving the counter in the
    * right direction.
    *
    * @remarks
    * This is level 2 because breaking this rule is basically
    * guaranteed to be both a mistake and a fatal bug.
    */
   "for-direction": "error",

   /**
    * Enforce `return` statements in getters
    *
    * @remarks
    * This is level 2 because breaking this rule is basically
    * guaranteed to be both a mistake and a fatal bug.
    */
   "getter-return": "error",

   /**
    * Disallow using an async function as a Promise executor
    *
    * @remarks
    * This is level 2 because it is a pointless complication of
    * the code that can hide errors. There are no reasons to do it,
    * and many reasons not to do it.
    */
   "no-async-promise-executor": "error",

   /**
    * Disallow `await` inside of loops
    *
    * @remarks
    * This is level 1 because it may be useful for simulations in
    * development; but most of the time it is either a mistake or an
    * indication that the code should be rewritten to be more efficient.
    */
   "no-await-in-loop": "error",

   /**
    * Disallow reassigning class members
    *
    * @remarks
    * Code such as this is usually a mistake, and when it is not a mistake
    * it is confusing and should be refactored.
    */
   "no-class-assign": "error",

   /**
    * Disallow comparing against -0
    *
    * @remarks
    * This rule is level 2 because there is no reason to use -0 in
    * this project, and therefore comparing against it is certainly
    * a mistake.
    */
   "no-compare-neg-zero": "error",

   /**
    * Disallow assignment operators in conditional expressions
    *
    * @remarks
    * This is level two because this is usually the result of a typo
    * (typing a single "=" instead of two "=="). There are valid cases
    * for using assignment operators in conditional statements, but such
    * statements are not clear, and the same result can be
    * achieved by other methods that are easier to understand.
    */
   "no-cond-assign": "error",

   /**
    * Disallow reassigning `const` variables
    *
    * @remarks
    * This is level 2 because such code will throw an error at runtime.
    */
   "no-const-assign": "error",

   /**
    * Disallow expressions where the operation doesn't affect the value.
    *
    * @remarks
    * This is level 2 because such code is useless and confusing.
    */
   "no-constant-binary-expression": "error",

   /**
    * Disallow constant expressions in conditions
    *
    * @remarks
    * This is level 2 because such code is pointless
    */
   "no-constant-condition": "error",

   /**
    * Disallow returning value from constructor
    *
    * @remarks
    * This is level 2 because such code is almost certainly a mistake or
    * a misunderstanding of constructors. If it was done on purpose, we
    * should consider refactoring to be clearer and more modular anyway.
    */
   "no-constructor-return": "error",

   /**
    * Disallow control characters in regular expressions
    *
    * @remarks
    * I don't know much about this area, but it is one of eslint's
    * recommended rules so I put it at level 1. Revisit in the future.
    */
   "no-control-regex": "warn",

   /**
    * Disallow the use of `debugger`
    *
    * @remarks
    * This is level 2 because it is an old, unused, and unnecessary
    * feature of javascript, and it would cause fatal bugs in production.
    */
   "no-debugger": "error",

   /**
    * Disallow duplicate arguments in `function` definitions
    *
    * @remarks
    * This is level 2 because it is very prone to bugs and does not provide
    * any benefit. In addition to being very confusing, the first of the
    * duplicated arguments becomes almost inaccessible.
    */
   "no-dupe-args": "error",

   /**
    * Disallow duplicate class members
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-dupe-class-members": "off",

   /**
    * Disallow duplicate conditions in if-else-if chains
    *
    * @remarks
    * This is level 2 because such code can be rewritten to be clearer
    * and more succinct. There is no reason to have a duplicate condition.
    */
   "no-dupe-else-if": "error",

   /**
    * Disallow duplicate keys in object literals
    *
    * @remarks
    * This is level 2 because it is a mistake and probably a bug. You
    * can't have duplicate keys in an object -- one would simply
    * overwrite the other.
    */
   "no-dupe-keys": "error",

   /**
    * Disallow duplicate case labels
    *
    * @remarks
    * This is level 2 because such code can be rewritten to be clearer
    * and more succinct. There is no reason to have a duplicate condition.
    */
   "no-duplicate-case": "error",

   /**
    * Disallow duplicate module imports
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-duplicate-imports": "off",

   /**
    * Disallow empty character classes in regular expressions
    *
    * @remarks
    * This is level 2 because such code is pointless and should be removed for
    * clarity.
    */
   "no-empty-character-class": "error",

   /**
    * Disallow empty destructuring patterns
    *
    * @remarks
    * This is level 2 because such code is pointless and is probably a
    * mistake.
    */
   "no-empty-pattern": "error",

   /**
    * Disallow reassigning exceptions in `catch` clauses
    *
    * @remarks
    * This is level 2 because it is unnecessary and can be very confusing.
    * It is likely a mistake.
    */
   "no-ex-assign": "error",

   /**
    * Disallow fallthrough of `case` statements
    *
    * @remarks
    * This is level 1, not because fallthrough is bad, but because we
    * should be explicit about it. Intentional fallthrough should be noted
    * in a comment.
    */
   "no-fallthrough": "warn",

   /**
    * Disallow reassigning `function` declarations
    *
    * @remarks
    * This is level 2 because violating it can cause confusing or buggy
    * code in some circumstances due to function hoisting, and may be a mistake.
    * It is better practice to assign the function to a scoped variable
    * in cases where a function needs to be reassigned, thus avoiding any
    * hoisting issues.
    */
   "no-func-assign": "error",

   /**
    * Disallow assigning to imported bindings
    *
    * @remarks
    * This is level 2 because it is very likely to cause bugs and is
    * probably a mistake. In cases where it seems like you should
    * reassign an import variable, something else is probably not
    * right (ie, the module you are importing from is not following
    * best practices)
    */
   "no-import-assign": "error",

   /**
    * Disallow variable or function declarations in nested blocks
    *
    * @remarks
    * There are two parts to this rule: variables and functions.
    * The variables part is not applicable because we have the no-var
    * rule turned on. This rule is set to level 2 because function
    * declarations that are not at file scope can be confusing and
    * buggy due to function hoisting.
    */
   "no-inner-declarations": "error",

   /**
    * Disallow invalid regular expression strings in RegExp constructors
    *
    * @remarks
    * This is level 2 because it will throw an error at runtime.
    */
   "no-invalid-regexp": "error",

   /**
    * Disallow irregular whitespace
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-irregular-whitespace": "off",

   /**
    * Disallow literal numbers that lose precision
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-loss-of-precision": "off",

   /**
    * Disallow characters which are made with multiple code points in
    * character class syntax
    *
    * @remarks
    * This is level 2 because such code won't work as intended and should
    * be rewritten.
    */
   "no-misleading-character-class": "error",

   /**
    * Disallow `new` operators with global non-constructor functions.
    *
    * @remarks
    * This is level 2 because such code will error at runtime. Typescript
    * should also catch this issue.
    */
   "no-new-native-nonconstructor": "error",

   /**
    * Disallow `new` operators with the `Symbol` object
    *
    * @remarks
    * This is level 0 because it is already covered by the
    * "no-new-native-constructor" rule.
    */
   "no-new-symbol": "error",

   /**
    * Disallow calling global object properties as functions
    *
    * @remarks
    * This is level 2 because such code will throw an error at runtime
    */
   "no-obj-calls": "error",

   /**
    * Disallow returning values from Promise executor functions
    *
    * @remarks
    * This is level 2 because, as explained in the docs, "The return
    * value of the executor is ignored. Returning a value from an
    * executor function is a possible error because the returned value
    * cannot be used and it doesn't affect the promise in any way."
    */
   "no-promise-executor-return": "error",

   /**
    * Disallow calling some `Object.prototype` methods directly on objects
    *
    * @remarks
    * This is level 1 because eslint recommends this rule. ESLint makes
    * some good arguments for it, but I didn't make it level 2 because I'm
    * not sure how this rule will shake out in the real world.
    */
   "no-prototype-builtins": "error",

   /**
    * Disallow assignments where both sides are exactly the same
    *
    * @remarks
    * This is level 2 because such code is obviously unnecessary and should
    * be removed.
    */
   "no-self-assign": "error",

   /**
    * Disallow comparisons where both sides are exactly the same
    *
    * @remarks
    * This is level 2 because such code is obviously unnecessary and should
    * be removed.
    */
   "no-self-compare": "error",

   /**
    * Disallow returning values from setters
    *
    * @remarks
    * Return values from setters are ignored, so such code is certainly
    * a mistake or misunderstanding.
    */
   "no-setter-return": "error",

   /**
    * Disallow sparse arrays
    *
    * @remarks
    * This is level 2 because sparse arrays are usually the result of a
    * typo (ie, an accidental extra comma) and are rarely useful. If you
    * think you need a sparse array, consider using a different data
    * structure or handling your array differently.
    */
   "no-sparse-arrays": "error",

   /**
    * Disallow template literal placeholder syntax in regular strings
    *
    * @remarks
    * Such code is usually a mistake -- the author probably intended for
    * the string to be a template literal -- but there may be rare cases where
    * this is intentional, so we have it turned off. Additionally, the IDE
    * syntax highlights should already make it obvious if there is a problem.
    */
   "no-template-curly-in-string": "off",

   /**
    * Disallow `this`/`super` before calling `super()` in constructors
    *
    * @remarks
    * This is level 2 because such code will throw an error at runtime.
    */
   "no-this-before-super": "error",

   /**
    * Disallow the use of undeclared variables unless mentioned in `global`
    * comments
    *
    * @remarks
    * This is turned off because Typescript will already warn us about it,
    * and Typescript is smarter about it.
    */
   "no-undef": "off",

   /**
    * Disallow confusing multiline expressions
    *
    * @remarks
    * Prettier already takes care of this.
    */
   "no-unexpected-multiline": "off",

   /**
    * Disallow unmodified loop conditions
    *
    * @remarks
    * Such code will lead to an infinite loop. The reason this is not level
    * 2 is because the rule is not perfect at detecting when a value is
    * modified by a side-effect. Of course, we should be avoiding side-effects
    * anyway, so maybe we should revisit this in the future and bump it up
    * to level 2
    */
   "no-unmodified-loop-condition": "warn",

   /**
    * Disallow unreachable code after `return`, `throw`, `continue`, and
    * `break` statements
    *
    * @remarks
    * Obviously, unreachable code is useless and should be removed.
    */
   "no-unreachable": "error",

   /**
    * Disallow loops with a body that allows only one iteration
    *
    * @remarks
    * Obviously, a loop that can only iterate once should not be a loop
    */
   "no-unreachable-loop": "error",

   /**
    * Disallow control flow statements in `finally` blocks
    *
    * @remarks
    * Control flow statements within `finally` do not behave intuitively
    * (see the eslint docs), and may indicate a poor design. This rule is
    * level 2 to avoid these issues.
    */
   "no-unsafe-finally": "error",

   /**
    * Disallow negating the left operand of relational operators
    *
    * @remarks
    * This is level 2 because it is almost certainly a mistake/bug.
    * See eslint docs.
    */
   "no-unsafe-negation": "error",

   /**
    * Disallow use of optional chaining in contexts where the undefined value is not allowed
    *
    * @remarks
    * This is level 0 because typescript and typescript-eslint already take care of it.
    */
   "no-unsafe-optional-chaining": "off",

   /**
    * Disallow unused private class members
    *
    * @remarks
    * Unused code should be removed. This is not level 2 because such code often
    * exists temporarily during development.
    */
   "no-unused-private-class-members": "warn",

   /**
    * Disallow unused variables
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-unused-vars": "off",

   /**
    * Disallow the use of variables before they are defined
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-use-before-define": "off",

   /**
    * Disallow useless backreferences in regular expressions
    *
    * @remarks
    * This is level 2 because, as the name suggests, such code is useless
    * and should be rewritten
    */
   "no-useless-backreference": "error",

   /**
    * Disallow assignments that can lead to race conditions due to usage
    * of `await` or `yield`
    *
    * @remarks
    * This rule will try to flag code when all of these conditions are met:
    *
    * 1. A variable or property is assigned or created before an await statement
    * 2. That same variable or property is modified after the await statement
    * 3. The parser cannot verify that the variable would not be accessible while the function is waiting.
    *
    * Following this rule reduces the risk of a race condition, such as
    *
    * ```typescript
    * let x = 0;
    * async function clickRedButton() {
    *    if (typeof x === "number") {
    *       const y = await someLongProcess(); //If the blue button is clicked while we are waiting...
    *       x += y; //...then this line will error because x is now an object.
    *    }
    * }
    * async function clickBlueButton() {
    *    x = {num: "off"};
    * }
    * ```
    *
    * However, this rule doesn't always flag code that meets the three conditions above.
    * It is not consistent. It also doesn't apply to `.then()` callbacks, only `await`.
    *
    * Because the docs are incomplete and the rule doesn't catch all cases, a lot of people think
    * this rule is broken (See the thread at https://github.com/eslint/eslint/issues/11899).
    * But it is actually really useful for finding possible race
    * conditions around `await` statements. Unfortunately, due to the problems mentioned
    * above, it is a very confusing rule to implement (unless you are reading this comment!).
    *
    * Code flagged by this rule could easily lead to bugs, and indicates a poor
    * design. It should be refactored to avoid race conditions. However, because
    * of the problems mentioned above, we have it turned off for now. We might revisit
    * in the future if these problems are mitigated.
    */
   "require-atomic-updates": "off",

   /**
    * Require calls to `isNaN()` when checking for `NaN`
    *
    * @remarks
    * This is level 2 because checking for NaN in other ways is often
    * not intuitive (see eslint docs), and there is no reason not to use
    * the isNaN() function instead.
    */
   "use-isnan": "error",

   /**
    * Enforce comparing `typeof` expressions against valid strings
    *
    * @remarks
    * This is level 2 because such code is always a mistake/bug.
    */
   "valid-typeof": "error"
};
