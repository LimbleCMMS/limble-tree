/**
 * These rules relate to better ways of doing things to help you avoid problems.
 * They are included in eslint
 */

module.exports = {
   /**
    * enforce getter and setter pairs in objects and classes
    *
    * @remarks
    * This is level 1 because it seems like a mistake to have
    * a setter without a getter, but i'm not familiar enough
    * with getters and setters to make it level 2. Revisit in
    * the future.
    */
   "accessor-pairs": 1,

   /**
    * enforce `return` statements in callbacks of array methods
    *
    * @remarks
    * This is level 2 because the array methods covered by this rule
    * require a return statement to be useful, so breaking this rule
    * is probably a mistake. If a return statement is not needed in your
    * logic, consider using forEach() instead.
    */
   "array-callback-return": 2,

   /**
    * enforce the use of variables within the scope they are defined
    *
    * @remarks
    * This is level 0 because it is not applicable when the no-var rule
    * is on.
    */
   "block-scoped-var": 0,

   /**
    * enforce that class methods utilize `this`
    *
    * @remarks
    * This is turned off because it isn't as high of a priority right
    * now compared to other rules. We should revisit this in the future.
    */
   "class-methods-use-this": 0,

   /**
    * enforce a maximum cyclomatic complexity allowed in a program
    *
    * @remarks
    * This is turned off because it marks large swaths of code, and that
    * was bugging some of our developers. We will almost certainly turn
    * this on slowly in the future.
    */
   "complexity": 0,

   /**
    * require `return` statements to either always or never specify values
    *
    * @remarks
    * This is set to level 2 because code that doesn't follow the rule will
    * not be typescript compliant when we make the switch. It is also just
    * less consistent/clear.
    */
   "consistent-return": 2,

   /**
    * enforce consistent brace style for all control statements
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "curly": 0,

   /**
    * require `default` cases in `switch` statements
    *
    * @remarks
    * This is level 1 because it is always better to have a default
    * case. The reason it is not level 2 is because we don't have the
    * tools yet to easily handle exceptions in many places where
    * we use switch statements. We will want to bump this to level 2
    * in the future.
    */
   "default-case": 1,

   /**
    * enforce default clauses in switch statements to be last
    *
    * @remarks
    * This is level 2 just to enforce consistency and readability.
    * There is no reason not to do this.
    */
   "default-case-last": 2,

   /**
    * enforce default parameters to be last
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "default-param-last": 0,

   /**
    * enforce consistent newlines before and after dots
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "dot-location": 0,

   /**
    * enforce dot notation whenever possible
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "dot-notation": 0,

   /**
    * require the use of `===` and `!==`
    *
    * @remarks
    * We are not ready to implement this yet, but we should revisit it
    * in the future (maybe after conversion to typescript).
    */
   "eqeqeq": 0,

   /**
    * require accessor pairs to be grouped in object literals and classes
    *
    * @remarks
    * This is level 2 just to enforce consistency and readability. There
    * is no reason to ignore this rule.
    */
   "grouped-accessor-pairs": 2,

   /**
    * require `for-in` loops to include an `if` statement
    *
    * @remarks
    * This is turned off because there are many instances where we do not
    * follow it, and it is not as high priority as other rules. We should
    * probably make this level 1 in the future.
    */
   "guard-for-in": 0,

   /**
    * enforce a maximum number of classes per file
    *
    * @remarks
    * This is set to level 2 because Angular and AngularJS both strongly
    * recommend "the rule of one", which indicates that every file should
    * only declare one thing. This rule matches that recommendation.
    */
   "max-classes-per-file": 2,

   /**
    * disallow the use of `alert`, `confirm`, and `prompt`
    *
    * @remarks
    * This is set to level 1 because these functions are generally a poor
    * user experience. It is not level 2 because it isn't a huge priority
    * right now, but we don't want new instances cropping up.  Revisit in
    * the future.
    */
   "no-alert": 1,

   /**
    * disallow the use of `arguments.caller` or `arguments.callee`
    *
    * @remarks
    * This is level 2 because this functionality has long been deprecated
    * and generally discouraged from use.
    */
   "no-caller": 2,

   /**
    * disallow lexical declarations in case clauses
    *
    * @remarks
    * This is level 2 because such code can be non-intuitive and buggy,
    * and there is no reason not to wrap case statements in braces.
    */
   "no-case-declarations": 2,

   /**
    * disallow returning value from constructor
    *
    * @remarks
    * This is level 2 because such code is almost certainly a mistake or
    * a misunderstanding of constructors. If it was done on purpose, we
    * should consider refactoring to be clearer and more modular anyway.
    */
   "no-constructor-return": 2,

   /**
    * Disallow Regular Expressions That Look Like Division
    *
    * @remarks
    * This is level 1 because I can see how this rule could be useful,
    * but I also wonder if it is useful enough to be worth the effort.
    * So I split the difference between 0 and 2. We may need to revisit
    * in the future.
    */
   "no-div-regex": 1,

   /**
    * disallow `else` blocks after `return` statements in `if` statements
    *
    * @remarks
    * This is level 1 because this rule leads to slightly cleaner and more
    * readable code, but it seems like overkill to say it is level 2.
    */
   "no-else-return": 0,

   /**
    * disallow empty functions
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-empty-function": 0,

   /**
    * disallow empty destructuring patterns
    *
    * @remarks
    * This is level 1 because I don't know anything about destructuring,
    * but eslint has it listed as one of the "recommended" rules. We
    * should take another look in the future.
    */
   "no-empty-pattern": 1,

   /**
    * disallow `null` comparisons without type-checking operators
    *
    * @remarks
    * This is off because we are not ready to fix these problems yet.
    * We should definitely turn this on in the future. Note that this
    * rule would not be applicable when the `eqeqeq` rule is on.
    */
   "no-eq-null": 0,

   /**
    * disallow the use of `eval()`
    *
    * @remarks
    * This is level 2 because eval() is widely considered to be unsafe,
    * and also indicates a poor design.
    */
   "no-eval": 2,

   /**
    * disallow extending native types
    *
    * @remarks
    * This is level 2 because it breaks several best practices and can
    * lead to bugs. If you think you need to add functionality to a
    * native data structure, think again.
    */
   "no-extend-native": 2,

   /**
    * disallow unnecessary calls to `.bind()`
    *
    * @remarks
    * This is level 2 because such code is not necessary and would
    * be cleaner without the unnecessary code.
    */
   "no-extra-bind": 2,

   /**
    * disallow unnecessary labels
    *
    * @remarks
    * This is turned off because it does not apply when the 'no-labels'
    * rule is turned on.
    */
   "no-extra-label": 0,

   /**
    * disallow fallthrough of `case` statements
    *
    * @remarks
    * This is level 1 because fallthrough is usually a mistake. It
    * is not level 2 because sometimes fallthrough cases are
    * intended.
    */
   "no-fallthrough": 1,

   /**
    * disallow leading or trailing decimal points in numeric literals
    *
    * @remarks
    * This is level 2 to enforce consistency and readability
    * (does prettier already take care of this?)
    */
   "no-floating-decimal": 2,

   /**
    * disallow assignments to native objects or read-only global
    * variables
    *
    * @remarks
    * This is level 2 because reassigning globals is a sure recipe for
    * bugs,
    */
   "no-global-assign": 2,

   /**
    * disallow shorthand type conversions
    *
    * @remarks
    * This is level 2 to enforce consistency and readability.
    */
   "no-implicit-coercion": 2,

   /**
    * disallow declarations in the global scope
    *
    * @remarks
    * This is level 2 because such declarations are usually a
    * mistake, and when they aren't mistakes they indicate poor
    * design and should be refactored.
    */
   "no-implicit-globals": 2,

   /**
    * disallow the use of `eval()`-like methods
    *
    * @remarks
    * This is level 2 because eval() is widely considered to be unsafe,
    * and also indicates a poor design.
    */
   "no-implied-eval": 2,

   /**
    * disallow `this` keywords outside of classes or class-like objects
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-invalid-this": 0,

   /**
    * disallow the use of the `__iterator__` property
    *
    * @remarks
    * This is level 2 because the __iterator__ property is deprecated
    * and superseded by ES6 for-loops.
    */
   "no-iterator": 2,

   /**
    * disallow labeled statements
    *
    * @remarks
    * This is level 2 because, as the eslint docs say, "While convenient
    * in some cases, labels tend to be used only rarely and are frowned
    * upon as a remedial form of flow control that is more error
    * prone and harder to understand."
    */
   "no-labels": 2,

   /**
    * disallow unnecessary nested blocks
    *
    * @remarks
    * This is level 2 because such code is unnecessary and should be
    * removed.
    */
   "no-lone-blocks": 2,

   /**
    * disallow function declarations that contain unsafe references
    * inside loop statements
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-loop-func": 0,

   /**
    * disallow magic numbers
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-magic-numbers": 0,

   /**
    * disallow multiple spaces
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-multi-spaces": 0,

   /**
    * disallow multiple spaces
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-multi-str": 0,

   /**
    * disallow `new` operators outside of assignments or comparisons
    *
    * @remarks
    * This is level 2 because constructors should not have side-effects,
    * and if they do they should not be used exclusively for the
    * side-effects. This indicates a poor design.
    */
   "no-new": 2,

   /**
    * disallow `new` operators with the `Function` object
    *
    * @remarks
    * This is set to level 2 because code like this is much harder to
    * read and debug than normal function declarations
    */
   "no-new-func": 2,

   /**
    * disallow `new` operators with the `String`, `Number`, and `Boolean`
    * objects
    *
    * @remarks
    * This is level 2 because "there aren't any good reasons to use these
    * primitive wrappers as constructors. They tend to confuse other
    * developers more than anything else because they seem like they
    * should act as primitives, but they do not."
    */
   "no-new-wrappers": 2,

   /**
    * Disallow \8 and \9 escape sequences in string literals
    *
    * @remarks
    * This is level 2 because such escape characters are not necessary
    * and may not be supported in the future.
    */
   "no-nonoctal-decimal-escape": 2,

   /**
    * disallow octal literals
    *
    * @remarks
    * This is level 2 because octal literals are deprecated and quite
    * confusing
    */
   "no-octal": 2,

   /**
    * disallow octal escape sequences in string literals
    *
    * @remarks
    * This is level 2 because octal escape sequences are deprecated. Also,
    * developers are typically not familiar with them. Use unicode instead.
    */
   "no-octal-escape": 2,

   /**
    * disallow reassigning `function` parameters
    *
    * @remarks
    * This is level 1 because such code can be confusing and bug-prone. It
    * is not level 2 mostly because we don't follow it very well and it
    * annoys some of the developers.
    */
   "no-param-reassign": 1,

   /**
    * disallow the use of the `__proto__` property
    *
    * @remarks
    * This is level 2 because the __proto__ property has been long
    * deprecated.
    */
   "no-proto": 2,

   /**
    * disallow variable redeclaration
    *
    * @remarks
    * This is level 1 because such code is often a mistake, can lead
    * to bugs, and is usually harder to read. It is not level 2 because
    * we don't follow this rule very well yet, and some developers are
    * annoyed by it.
    */
   "no-redeclare": 1,

   /**
    * disallow certain properties on certain objects
    */
   "no-restricted-properties": [
      2,
      {
         object: "$q",
         message: "Use native Promises or $http instead of the old $q library"
      },
      {
         object: "$provide",
         property: "provider",
         message: "Avoid creating providers dynamically: use module.provider instead."
      },
      {
         object: "$provide",
         property: "constant",
         message:
            "Use ES6 imports/exports for constants that need to be accessed across multiple files"
      },
      {
         object: "$provide",
         property: "value",
         message:
            "Avoid creating angular values dynamically. Consider using ES6 imports/exports for values that need to be accessed across multiple files. If needed, use a service instead."
      },
      {
         object: "$provide",
         property: "factory",
         message: "Use a service instead of a factory"
      },
      {
         object: "$provide",
         property: "service",
         message: "Avoid creating services dynamically: use module.service instead."
      },
      {
         object: "angular",
         property: "identity",
         message:
            "Angular's 'identity' function simply returns whatever is passed into it; if such a function is needed, write a function literal instead."
      },
      {
         object: "angular",
         property: "copy",
         message:
            "Angular's 'copy' function is not very efficient. Use the rfdc library instead."
      },
      {
         property: "$watch",
         message:
            "Watchers are inefficient and will not be available in Angular2+. Consider using an observable instead."
      },
      {
         property: "$watchGroup",
         message:
            "Watchers are inefficient and will not be available in Angular2+. Consider using an observable instead."
      },
      {
         property: "$watchCollection",
         message:
            "Watchers are inefficient and will not be available in Angular2+. Consider using an observable instead."
      }
   ],

   /**
    * disallow assignment operators in `return` statements
    *
    * @remarks
    * This is level 2 because such code is confusing and unnecessary,
    * and it may be a mistake/bug.
    */
   "no-return-assign": 2,

   /**
    * disallow unnecessary `return await`
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-return-await": 0,

   /**
    * disallow `javascript:` urls
    *
    * @remarks
    * This is level 2 because such code is widely considered to be unsafe,
    * and also indicates a poor design.
    */
   "no-script-url": 2,

   /**
    * disallow assignments where both sides are exactly the same
    *
    * @remarks
    * This is level 2 because such code is obviously unnecessary and should
    * be removed.
    */
   "no-self-assign": 2,

   /**
    * disallow comparisons where both sides are exactly the same
    *
    * @remarks
    * This is level 2 because such code is obviously unnecessary and should
    * be removed.
    */
   "no-self-compare": 2,

   /**
    * disallow comma operators
    *
    * @remarks
    * I think prettier should take care of this, but just in case...
    */
   "no-sequences": 2,

   /**
    * disallow throwing literals as exceptions
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-throw-literal": 0,

   /**
    * disallow unmodified loop conditions
    *
    * @remarks
    * Such code will lead to an infinite loop. The reason this is not level
    * 2 is because the rule is not perfect at detecting when a value is
    * modified by a side-effect. Of course, we should be avoiding side-effects
    * anyway, so maybe we should revisit this in the future and bump it up
    * to level 2
    */
   "no-unmodified-loop-condition": 1,

   /**
    * disallow unused expressions
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-unused-expressions": 0,

   /**
    * disallow unused labels
    *
    * @remarks
    * Turned off because it is not applicable when the `no-labels` rule is on.
    */
   "no-unused-labels": 0,

   /**
    * disallow unnecessary calls to `.call()` and `.apply()`
    *
    * @remarks
    * Since these calls are slower than normal function invocation and harder
    * to read, they should only be used where a normal invocation is not possible.
    */
   "no-useless-call": 2,

   /**
    * disallow unnecessary `catch` clauses
    *
    * @remarks
    * This is level 2 because such code is unnecessary and should be removed
    * to make the code easier to read.
    */
   "no-useless-catch": 2,

   /**
    * disallow unnecessary concatenation of literals or template literals
    *
    * @remarks
    * This is level 2 because such code is unnecessarily complex and
    * inefficient.
    */
   "no-useless-concat": 2,

   /**
    * disallow unnecessary escape characters
    *
    * @remarks
    * Useless escape characters are always a mistake and may demonstrate a
    * misunderstanding of the language.
    */
   "no-useless-escape": 2,

   /**
    * disallow redundant return statements
    *
    * @remarks
    * This is level 2 because such code is unnecessary and should be removed
    * to make the code easier to read.
    */
   "no-useless-return": 2,

   /**
    * disallow `void` operators
    *
    * @remarks
    * This is level 2 because the 'void' operator is not intuitive, especially
    * in a typescript environment where `void` is also used as a type declaration.
    * The `undefined` keyword should be used instead of the void operator.
    */
   "no-void": 2,

   /**
    * disallow specified warning terms in comments
    *
    * @remarks
    * This is useful because it helps developers remember to come back to code
    * that still needs attention. It is not level 2 because these comments
    * are common during development.
    */
   "no-warning-comments": 1,

   /**
    * disallow `with` statements
    *
    * @remarks
    * This is level 2 because such code is always more confusing than the
    * alternatives. `with` statements make it "impossible to tell what a variable
    * inside the block actually refers to".
    */
   "no-with": 2,

   /**
    * enforce using named capture group in regular expression
    *
    * @remarks
    * This is level 0 mostly because we don't currently follow this rule and I
    * don't understand it well enough to fix it at this time. We should
    * revisit it in the future.
    */
   "prefer-named-capture-group": 0,

   /**
    * require using Error objects as Promise rejection reasons
    *
    * @remarks
    * In addition to consistency and readability, rejecting with an error object
    * provides more benefits than rejecting with a literal, and there isn't a good
    * reason not to use an error object. This is not level 2 because we want it to
    * match the `no-throw-literal` rule. Revisit in the future.
    */
   "prefer-promise-reject-errors": 1,

   /**
    * disallow use of the `RegExp` constructor in favor of regular expression
    * literals.
    *
    * @remarks
    * This is off right now because it is not a priority compared to other rules.
    * I'm also concerned about whether this is a good rule to implement. We will
    * want to revisit this in the future.
    */
   "prefer-regex-literals": 0,

   /**
    * enforce the consistent use of the radix argument when using `parseInt()`
    *
    * @remarks
    * This is turned off because this rule is aimed at preventing behavior
    * that occurs in pre-ES5 environments, and does not provide enough benefit
    * in modern javascript to be used in this project.
    */
   "radix": 0,

   /**
    * disallow async functions which have no `await` expression
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "require-await": 0,

   /**
    * enforce the use of `u` flag on RegExp
    *
    * @remarks
    * This is not a priority at this time. We may revisit in the future.
    */
   "require-unicode-regexp": 0,

   /**
    * require `var` declarations be placed at the top of their containing scope
    *
    * @remarks
    * Not applicable when the `no-var` rule is turned on.
    */
   "vars-on-top": 0,

   /**
    * require parentheses around immediate `function` invocations
    *
    * @remarks
    * I'm not sure if Prettier already takes care of this, and I'm
    * also not very familiar with this area or the benefits of such a rule.
    * I also don't think this is a priority right now, since we don't often
    * use IIFEs. Because of these considerations, the rule is turned off.
    * We may need to revisit in the future.
    */
   "wrap-iife": 0,

   /**
    * require or disallow "Yoda" conditions
    *
    * @remarks
    * This is level 2 to enforce consistency and readability.
    */
   "yoda": 2,

   /**
    * require or disallow strict mode directives
    *
    * @remarks
    * This is turned off because strict mode is already enforced by both the
    * ES6 imports and the typescript compiler.
    */
   "strict": 0
};
