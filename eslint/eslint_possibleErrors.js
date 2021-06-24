/**
 * These rules relate to possible syntax or logic errors in the code.
 * They are included with eslint.
 */

module.exports = {
   /**
    * enforce "for" loop update clause moving the counter in the
    * right direction.
    *
    * @remarks
    * This is level 2 because breaking this rule is basically
    * guaranteed to be both a mistake and a fatal bug.
    */
   "for-direction": 2,

   /**
    * enforce `return` statements in getters
    *
    * @remarks
    * This is level 2 because breaking this rule is basically
    * guaranteed to be both a mistake and a fatal bug.
    */
   "getter-return": 2,

   /**
    * disallow using an async function as a Promise executor
    *
    * @remarks
    * This is level 2 because it is a pointless complication of
    * the code that can hide errors. There are no reasons to do it,
    * and many reasons not to do it.
    */
   "no-async-promise-executor": 2,

   /**
    * disallow `await` inside of loops
    *
    * @remarks
    * This is level 1 because there may be some very rare cases where
    * breaking this rule is acceptable. However, most of the time it
    * is either a mistake or an indication that the code should be
    * rewritten to be more efficient.
    */
   "no-await-in-loop": 1,

   /**
    * disallow comparing against -0
    *
    * @remarks
    * This rule is level 2 because there is no reason to use -0 in
    * this project, and therefore comparing against it is certainly
    * a mistake.
    */
   "no-compare-neg-zero": 2,

   /**
    * disallow assignment operators in conditional expressions
    *
    * @remarks
    * This is level two because this is usually the result of a typo
    * (typing a single "=" instead of two "=="). There are valid cases
    * for using assignment operators in conditional statements, but such
    * statements are not clear, and the same result can be
    * achieved by other methods that are easier to understand.
    */
   "no-cond-assign": 2,

   /**
    * disallow the use of `console`
    *
    * @remarks
    * This is off mostly because developers didn't like it. We might
    * turn it back on at level 1 in the future, and configure it to only
    * disallow `console.log`.
    */
   "no-console": 0,

   /**
    * disallow constant expressions in conditions
    *
    * @remarks
    * This is level 2 because such code is pointless
    */
   "no-constant-condition": 2,

   /**
    * disallow control characters in regular expressions
    *
    * @remarks
    * I don't know much about this area, but it is one of eslint's
    * recommended rules so I put it at level 1. Revisit in the future.
    */
   "no-control-regex": 1,

   /**
    * disallow the use of `debugger`
    *
    * @remarks
    * This is level 2 because it is an old, unused, and unnecessary
    * feature of javascript, and it would cause fatal bugs in production.
    */
   "no-debugger": 2,

   /**
    * disallow duplicate arguments in `function` definitions
    *
    * @remarks
    * This is level 2 because it is very prone to bugs and does not provide
    * any benefit. In addition to being very confusing, the first of the
    * duplicated arguments becomes almost inaccessible.
    */
   "no-dupe-args": 2,

   /**
    * disallow duplicate conditions in if-else-if chains
    *
    * @remarks
    * This is level 2 because such code can be rewritten to be clearer
    * and more succinct. There is no reason to have a duplicate condition.
    */
   "no-dupe-else-if": 2,

   /**
    * disallow duplicate keys in object literals
    *
    * @remarks
    * This is level 2 because it is a mistake and probably a bug. You
    * can't have duplicate keys in an object -- one would simply
    * overwrite the other.
    */
   "no-dupe-keys": 2,

   /**
    * disallow duplicate case labels
    *
    * @remarks
    * This is level 2 because such code can be rewritten to be clearer
    * and more succinct. There is no reason to have a duplicate condition.
    */
   "no-duplicate-case": 2,

   /**
    * disallow empty block statements
    *
    * @remarks
    * This is level 1 because empty blocks are usually a mistake, and when they
    * are not mistakes they should have a comment inside them explaining why
    * they are empty so that future developers don't delete it when they assume
    * it doesn't do anything. It is not level 2 because sometimes during development
    * empty blocks may hang around for a while.
    */
   "no-empty": 1,

   /**
    * disallow empty character classes in regular expressions
    *
    * @remarks
    * This is level 2 because such code is pointless and should be removed for
    * clarity.
    */
   "no-empty-character-class": 2,

   /**
    * disallow reassigning exceptions in `catch` clauses
    *
    * @remarks
    * This is level 2 because it is unnecessary and can be very confusing.
    * It is likely a mistake.
    */
   "no-ex-assign": 2,

   /**
    * disallow unnecessary boolean casts
    *
    * @remarks
    * This is level 2 because, as indicated in the description, it is
    * completely unnecessary. It uses extra processing power and extra
    * brain power, but provides no benefits.
    */
   "no-extra-boolean-cast": 2,

   /**
    * disallow unnecessary parentheses
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-extra-parens": 0,

   /**
    * disallow unnecessary semicolons
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-extra-semi": 0,

   /**
    * disallow reassigning `function` declarations
    *
    * @remarks
    * This is level 2 because violating it can cause confusing or buggy
    * code in some circumstances due to function hoisting, and may be a mistake.
    * It is better practice to assign the function to a scoped variable
    * in cases where a function needs to be reassigned, thus avoiding any
    * hoisting issues.
    */
   "no-func-assign": 2,

   /**
    * disallow assigning to imported bindings
    *
    * @remarks
    * This is level 2 because it is very likely to cause bugs and is
    * probably a mistake. In cases where it seems like you should
    * reassign an import variable, something else is probably not
    * right (ie, the module you are importing from is not following
    * best practices)
    */
   "no-import-assign": 2,

   /**
    * disallow variable or function declarations in nested blocks
    *
    * @remarks
    * There are two parts to this rule: variables and functions.
    * The variables part is not applicable because we have the no-var
    * rule turned on. This rule is set to level 2 because function
    * declarations that are not at file scope can be confusing and
    * buggy due to function hoisting.
    */
   "no-inner-declarations": 2,

   /**
    * disallow invalid regular expression strings in RegExp constructors
    *
    * @remarks
    * This is level 2 because it will throw an error at runtime.
    */
   "no-invalid-regexp": 2,

   /**
    * disallow irregular whitespace
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-irregular-whitespace": 0,

   /**
    * disallow literal numbers that lose precision
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-loss-of-precision": 0,

   /**
    * disallow characters which are made with multiple code points in
    * character class syntax
    *
    * @remarks
    * This is level 2 because such code won't work as intended and should
    * be rewritten.
    */
   "no-misleading-character-class": 2,

   /**
    * disallow calling global object properties as functions
    *
    * @remarks
    * This is level 2 because such code will throw an error at runtime
    */
   "no-obj-calls": 2,

   /**
    * disallow returning values from Promise executor functions
    *
    * @remarks
    * This is level 2 because, as explained in the docs, "The return
    * value of the executor is ignored. Returning a value from an
    * executor function is a possible error because the returned value
    * cannot be used and it doesn't affect the promise in any way."
    */
   "no-promise-executor-return": 2,

   /**
    * disallow calling some `Object.prototype` methods directly on objects
    *
    * @remarks
    * This is level 1 because eslint recommends this rule. ESLint makes
    * some good arguments for it, but I didn't make it level 2 because I'm
    * not sure how this rule will shake out in the real world.
    */
   "no-prototype-builtins": 2,

   /**
    * disallow multiple spaces in regular expressions
    *
    * @remarks
    * This is level 2 because multiple spaces in regex are hard to count,
    * and should be rewritten for clarity.
    */
   "no-regex-spaces": 2,

   /**
    * disallow returning values from setters
    *
    * @remarks
    * Return values from setters are ignored, so such code is certainly
    * a mistake or misunderstanding.
    */
   "no-setter-return": 2,

   /**
    * disallow sparse arrays
    *
    * @remarks
    * This is level 2 because sparse arrays are usually the result of a
    * typo (ie, an accidental extra comma) and are rarely useful. If you
    * think you need a sparse array, consider using a different data
    * structure or handling your array differently.
    */
   "no-sparse-arrays": 2,

   /**
    * disallow template literal placeholder syntax in regular strings
    *
    * @remarks
    * This is level 1 because such code is probably a mistake -- the author
    * probably intended for the string to a template literal. However, it is
    * not level 2 because there may be rare cases where this is intentional.
    */
   "no-template-curly-in-string": 1,

   /**
    * disallow confusing multiline expressions
    *
    * @remarks
    * Prettier will usually take care of these cases, but we made this rule
    * level 2 just to make sure prettier doesn't miss something. There is
    * no reason to have a confusing multiline statement.
    */
   "no-unexpected-multiline": 2,

   /**
    * disallow unreachable code after `return`, `throw`, `continue`, and
    * `break` statements
    *
    * @remarks
    * Obviously, unreachable code is useless and should be removed.
    */
   "no-unreachable": 2,

   /**
    * disallow loops with a body that allows only one iteration
    *
    * @remarks
    * Obviously, a loop that can only iterate once should not be a loop
    */
   "no-unreachable-loop": 2,

   /**
    * disallow control flow statements in `finally` blocks
    *
    * @remarks
    * Control flow statements within `finally` do not behave intuitively
    * (see the eslint docs), and may indicate a poor design. This rule is
    * level 2 to avoid these issues.
    */
   "no-unsafe-finally": 2,

   /**
    * disallow negating the left operand of relational operators
    *
    * @remarks
    * This is level 2 because it is almost certainly a mistake/bug.
    * See eslint docs.
    */
   "no-unsafe-negation": 2,

   /**
    * disallow useless backreferences in regular expressions
    *
    * @remarks
    * This is level 2 because, as the name suggests, such code is useless
    * and should be rewritten
    */
   "no-useless-backreference": 2,

   /**
    * disallow assignments that can lead to race conditions due to usage
    * of `await` or `yield`
    *
    * @remarks
    * This rule's documentation is incomplete. The rule actually flags a
    * lot more code than the docs indicate. See the thread at
    * https://github.com/eslint/eslint/issues/11899. A lot of people think
    * this rule is broken, but it is actually really good at finding race
    * conditions around `await` statements. But the fact that the docs are
    * wrong and the fact that it doesn't find other kinds of race conditions
    * (such as those in a .then() callback) makes it rather misleading.
    *
    * Code flagged by this rule could easily lead to bugs, and indicates a poor
    * design. It should be refactored to avoid race conditions. However, because
    * of the problems mentioned above, and because it would require a good
    * amount of refactoring, we have it turned off for now. We should turn it on
    * in the future.
    */
   "require-atomic-updates": 0,

   /**
    * require calls to `isNaN()` when checking for `NaN`
    *
    * @remarks
    * This is level 2 because checking for NaN in other ways is often
    * not intuitive (see eslint docs), and there is no reason not to use
    * the isNaN() function instead.
    */
   "use-isnan": 2,

   /**
    * enforce comparing `typeof` expressions against valid strings
    *
    * @remarks
    * This is level 2 because such code is always a mistake/bug.
    */
   "valid-typeof": 2
};
