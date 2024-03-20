export const suggestionRules = {
   /**
    * Enforce getter and setter pairs in objects and classes
    *
    * @remarks
    * This is level 1 because it seems like a mistake to have
    * a setter without a getter, but i'm not familiar enough
    * with getters and setters to make it level 2. Revisit in
    * the future.
    */
   "accessor-pairs": "warn",

   /**
    * Require braces around arrow function bodies
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "arrow-body-style": "off",

   /**
    * Enforce the use of variables within the scope they are defined
    *
    * @remarks
    * This is level 0 because it is not applicable when the no-var rule
    * is on.
    */
   "block-scoped-var": "off",

   /**
    * Enforce camelcase naming convention
    *
    * @remarks
    * This is a good rule, but it doesn't work well with data from the database,
    * which intentionally avoids uppercase characters.
    */
   "camelcase": "off",

   /**
    * Enforce or disallow capitalization of the first letter of a comment
    *
    * @remarks
    * Comments should be written in full sentences, including capitalization.
    * We should turn this on in the future.
    */
   "capitalized-comments": "warn",

   /**
    * Enforce that class methods utilize `this`
    *
    * @remarks
    * This rule is off because there is a typescript rule that overrides it.
    */
   "class-methods-use-this": "off",

   /**
    * Enforce a maximum cyclomatic complexity allowed in a program
    *
    * @remarks
    * High complexity leads to a high number of bugs and low maintainability. We
    * should keep complexity as low as possible. The default is 20, which is
    * probably a good goal.
    *
    * This is set very high for now, but we should lower it soon.
    */
   "complexity": ["warn", { max: 260 }],

   /**
    * Require `return` statements to either always or never specify values
    *
    * @remarks
    * There is a typescript rule that overrides this
    */
   "consistent-return": "off",

   /**
    * Enforce consistent naming when capturing the current execution
    * context
    *
    * @remarks
    * The `no-this-alias` rule from typescript-eslint render this rule obsolete.
    */
   "consistent-this": "off",

   /**
    * Enforce consistent brace style for all control statements
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "curly": "off",

   /**
    * Require `default` cases in `switch` statements
    *
    * @remarks
    * This is level 2 because it is always clearer to have a default
    * case, even if it only contains a comment and no executable code.
    */
   "default-case": "warn",

   /**
    * Enforce default clauses in switch statements to be last
    *
    * @remarks
    * This is level 1 just to enforce consistency and readability.
    */
   "default-case-last": "warn",

   /**
    * Enforce default parameters to be last
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "default-param-last": "off",

   /**
    * Enforce dot notation whenever possible
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "dot-notation": "off",

   /**
    * Require the use of `===` and `!==`
    *
    * @remarks
    * Greatly reduces confusion surrounding type coercion. We currently
    * violate this rule a lot, and it is hard to fix without better typescript,
    * so we are leaving it at level 0 until we can get on top of it.
    * Revisit in the future.
    */
   "eqeqeq": "off",

   /**
    * Require function names to match the name of the variable or property
    * to which they are assigned
    *
    * @remarks
    * This is turned off because it is not a priority right now. We
    * can revisit later.
    */
   "func-name-matching": 0,

   /**
    * Require or disallow named `function` expressions
    *
    * @remarks
    * Not a priority at this time.
    */
   "func-names": "off",

   /**
    * Enforce the consistent use of either `function` declarations or
    * expressions
    *
    * @remarks
    * This is not a priority at this time. We can revisit in the future.
    */
   "func-style": "off",

   /**
    * Require accessor pairs to be grouped in object literals and classes
    *
    * @remarks
    * This is level 2 just to enforce consistency and readability. There
    * is no reason to ignore this rule.
    */
   "grouped-accessor-pairs": "error",

   /**
    * Require `for-in` loops to include an `if` statement
    *
    * @remarks
    * This is turned off because it is not as high priority as other rules.
    * We may consider making this level 1 in the future.
    */
   "guard-for-in": "off",

   /**
    * Disallow specified identifiers
    */
   "id-denylist": ["error"],

   /**
    * Enforce minimum and maximum identifier lengths
    *
    * @remarks
    * This is level 2 to enforce the use of clear and semantically
    * meaningful identifiers.
    */
   "id-length": [
      "error",
      {
         min: 2,
         max: 50,
         exceptions: ["$"]
      }
   ],

   /**
    * Require identifiers to match a specified regular expression
    *
    * @remarks
    * This is turned off because we have no preference on identifier
    * names beyond the other rules in this config.
    */
   "id-match": "off",

   /**
    * Require or disallow initialization in variable declarations
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "init-declarations": "off",

   /**
    * Require or disallow logical assignment operator shorthand.
    *
    * @remarks
    * Using these operators is more concise and readable.
    */
   "logical-assignment-operators": ["off", { enforceForIfStatements: true }],

   /**
    * Enforce a maximum number of classes per file
    *
    * @remarks
    * This is set to level 2 to enforce code cohesion and organization.
    */
   "max-classes-per-file": "error",

   /**
    * Enforce a maximum depth that blocks can be nested
    *
    * @remarks
    * This is level 1 to prevent the arrow code smell.
    */
   "max-depth": ["warn", { max: 8 }],

   /**
    * Enforce a maximum number of lines per file
    *
    * @remarks
    * Small files are easier to read and maintain, and correlates with
    * better code organization, decoupling, and cohesion.
    *
    * Note that this rule excludes comments and blank lines by default.
    * It only counts lines of executable code.
    *
    * This limit is set very high for now. We should revisit in the future.
    */
   "max-lines": ["warn", { max: 8537 }],

   /**
    * Enforce a maximum number of lines of code in a function
    *
    * @remarks
    * Small functions are the number one rule of clean code.
    *
    * Note that this rule includes comments and blank lines by default.
    *
    * This limit is set very high for now. We should revisit in the future.
    */
   "max-lines-per-function": ["warn", { max: 2161 }],

   /**
    * Enforce a maximum depth that callbacks can be nested
    *
    * @remarks
    * nested callbacks are confusing
    */
   "max-nested-callbacks": ["warn", { max: 5 }],

   /**
    * Enforce a maximum number of parameters in function definitions
    *
    * @remarks
    * Too many params is a code smell. The book "Clean Code" recommends
    * no more than 3 params per function, and even that should be rare.
    *
    * This limit is set very high for now. We should revisit in the future.
    */
   "max-params": ["error", { max: 34 }],

   /**
    * Enforce a maximum number of statements allowed in function blocks
    *
    * @remarks
    * This limit is set very high for now. We should revisit in the future.
    */
   "max-statements": ["warn", { max: 885 }],

   /**
    * Enforce a particular style for multiline comments
    *
    * @remarks
    * This is turned off because it is not something we want to enforce.
    */
   "multiline-comment-style": "off",

   /**
    * Require constructor names to begin with a capital letter
    *
    * @remarks
    * This is level 2 to enforce consistency and readability. We have the
    * `capIsNew` option turned off because there are a lot of valid exceptions,
    * such as NestJS decorators.
    */
   "new-cap": ["error", { capIsNew: false }],

   /**
    * Disallow the use of `alert`, `confirm`, and `prompt`
    *
    * @remarks
    * Such code is not viable on the backend.
    */
   "no-alert": "error",

   /**
    * Disallow `Array` constructors
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-array-constructor": "off",

   /**
    * Disallow bitwise operators
    *
    * @remarks
    * This is level 2 because it is almost always a mistake at the level of
    * abstraction we typically work with in this repo. If there is a
    * valid use case, disable this rule for that line and leave a comment.
    */
   "no-bitwise": "error",

   /**
    * Disallow the use of `arguments.caller` or `arguments.callee`
    *
    * @remarks
    * This is level 2 because this functionality has long been deprecated
    * and generally discouraged from use.
    */
   "no-caller": "error",

   /**
    * Disallow lexical declarations in case clauses
    *
    * @remarks
    * This is level 2 because such code can be non-intuitive and buggy,
    * and there is no reason not to wrap case statements in braces.
    */
   "no-case-declarations": "error",

   /**
    * Disallow the use of `console`
    *
    * @remarks
    * This is level 1 because it is often necessary to use `console` in
    * development, but most console methods should not exist in production.
    * Some possible exceptions are allowed.
    */
   "no-console": [
      "warn",
      { allow: ["assert", "debug", "error", "info", "warn"] }
   ],

   /**
    * Disallow `continue` statements
    *
    * @remarks
    * This is turned off because it is not a priority at this time,
    * and I wonder how useful it is.
    */
   "no-continue": "off",

   /**
    * Disallow deleting variables
    *
    * @remarks
    * This is level 2 because such code is syntactically incorrect and may lead
    * to undefined behavior.
    */
   "no-delete-var": "error",

   /**
    * Disallow Regular Expressions That Look Like Division
    *
    * @remarks
    * This is level 1 because I can see how this rule could be useful,
    * but I also wonder if it is useful enough to be worth the effort.
    * So I split the difference between 0 and 2. We may need to revisit
    * in the future.
    */
   "no-div-regex": "warn",

   /**
    * Disallow `else` blocks after `return` statements in `if` statements
    *
    * @remarks
    * This is level 1 because this rule leads to slightly cleaner and more
    * readable code, but it seems like overkill to say it is level 2.
    */
   "no-else-return": "warn",

   /**
    * Disallow empty block statements
    *
    * @remarks
    * This is level 1 because empty blocks are usually a mistake, and when they
    * are not mistakes they should have a comment inside them explaining why
    * they are empty so that future developers don't delete it when they assume
    * it doesn't do anything. It is not level 2 because sometimes during development
    * empty blocks may hang around for a while.
    */
   "no-empty": "warn",

   /**
    * Disallow empty functions
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-empty-function": "off",

   /**
    * Disallow empty static blocks
    *
    * @remarks
    * Same as `no-empty` but for static blocks.
    */
   "no-empty-static-block": "warn",

   /**
    * Disallow `null` comparisons without type-checking operators
    *
    * @remarks
    * Not applicable when the `eqeqeq` rule is on.
    */
   "no-eq-null": "off",

   /**
    * Disallow the use of `eval()`
    *
    * @remarks
    * This is level 2 because eval() is widely considered to be unsafe,
    * and also indicates a poor design.
    */
   "no-eval": "error",

   /**
    * Disallow extending native types
    *
    * @remarks
    * This is level 2 because it breaks several best practices and can
    * lead to bugs. If you think you need to add functionality to a
    * native data structure, think again.
    */
   "no-extend-native": "error",

   /**
    * Disallow unnecessary calls to `.bind()`
    *
    * @remarks
    * This is level 2 because such code is not necessary and would
    * be cleaner without the unnecessary code.
    */
   "no-extra-bind": "error",

   /**
    * Disallow unnecessary boolean casts
    *
    * @remarks
    * This is level 2 because, as indicated in the description, it is
    * completely unnecessary. It uses extra processing power and extra
    * brain power, but provides no benefits.
    */
   "no-extra-boolean-cast": "error",

   /**
    * Disallow unnecessary labels
    *
    * @remarks
    * This is turned off because it does not apply when the 'no-labels'
    * rule is turned on.
    */
   "no-extra-label": "off",

   /**
    * Disallow assignments to native objects or read-only global
    * variables
    *
    * @remarks
    * This is level 2 because reassigning globals is a sure recipe for
    * bugs,
    */
   "no-global-assign": "error",

   /**
    * Disallow shorthand type conversions
    *
    * @remarks
    * This is level 2 to enforce consistency and readability.
    */
   "no-implicit-coercion": "error",

   /**
    * Disallow declarations in the global scope
    *
    * @remarks
    * This is level 2 because such declarations are usually a
    * mistake, and when they aren't mistakes they indicate poor
    * design and should be refactored.
    */
   "no-implicit-globals": "error",

   /**
    * Disallow the use of `eval()`-like methods
    *
    * @remarks
    * This is level 2 because eval() is widely considered to be unsafe,
    * and also indicates a poor design.
    */
   "no-implied-eval": "error",

   /**
    * Disallow inline comments after code
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-inline-comments": "off",

   /**
    * Disallow `this` keywords outside of classes or class-like objects
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-invalid-this": "off",

   /**
    * Disallow the use of the `__iterator__` property
    *
    * @remarks
    * This is level 2 because the __iterator__ property is deprecated
    * and superseded by ES6 for-loops.
    */
   "no-iterator": "error",

   /**
    * Disallow labels that share a name with a variable
    *
    * @remarks
    * Not applicable when the `no-labels` rule is turned on.
    */
   "no-label-var": "off",

   /**
    * Disallow labeled statements
    *
    * @remarks
    * This is level 2 because, as the eslint docs say, "While convenient
    * in some cases, labels tend to be used only rarely and are frowned
    * upon as a remedial form of flow control that is more error
    * prone and harder to understand."
    */
   "no-labels": "error",

   /**
    * Disallow unnecessary nested blocks
    *
    * @remarks
    * This is level 2 because such code is unnecessary and should be
    * removed.
    */
   "no-lone-blocks": "error",

   /**
    * Disallow `if` statements as the only statement in `else` blocks
    *
    * @remarks
    * This is level 2 because such code can be rewritten to be
    * simpler and easier to read.
    * Bryan disabled for the time being.  After refactoring it wasn't adding clarity.  I will reenable it later and test to see if code written is confusing
    */
   "no-lonely-if": "off",

   /**
    * Disallow function declarations that contain unsafe references
    * inside loop statements
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-loop-func": "off",

   /**
    * Disallow magic numbers
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-magic-numbers": "off",

   /**
    * Disallow use of chained assignment expressions
    *
    * @remarks
    * This is level 2 because "chaining the assignment of variables can
    * lead to unexpected results and be difficult to read". Such
    * statements should be separated.
    */
   "no-multi-assign": ["error", { ignoreNonDeclaration: true }],

   /**
    * Disallows multi-line strings
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-multi-str": "off",

   /**
    * Disallow negated conditions
    *
    * @remarks
    * Such code is slightly harder to read than the alternative.
    */
   "no-negated-condition": "warn",

   /**
    * Disallow nested ternary expressions
    *
    * @remarks
    * This is level 2 because such code is very difficult to read.
    */
   "no-nested-ternary": "error",

   /**
    * Disallow `new` operators outside of assignments or comparisons
    *
    * @remarks
    * This is level 2 because constructors should not have side-effects,
    * and if they do they should not be used exclusively for the
    * side-effects. This indicates a poor design.
    */
   "no-new": "error",

   /**
    * Disallow `new` operators with the `Function` object
    *
    * @remarks
    * This is set to level 2 because code like this is much harder to
    * read and debug than normal function declarations
    */
   "no-new-func": "error",

   /**
    * Disallow `new` operators with the `String`, `Number`, and `Boolean`
    * objects
    *
    * @remarks
    * This is level 2 because "there aren't any good reasons to use these
    * primitive wrappers as constructors. They tend to confuse other
    * developers more than anything else because they seem like they
    * should act as primitives, but they do not."
    */
   "no-new-wrappers": "error",

   /**
    * Disallow \8 and \9 escape sequences in string literals
    *
    * @remarks
    * This is level 2 because such escape characters are not necessary
    * and may not be supported in the future.
    */
   "no-nonoctal-decimal-escape": "error",

   /**
    * Disallow calls to the Object constructor without an argument
    *
    * @remarks
    * This is level 2 to enforce consistency and readability.
    */
   "no-object-constructor": "error",

   /**
    * Disallow octal literals
    *
    * @remarks
    * This is level 2 because octal literals are deprecated and quite
    * confusing
    */
   "no-octal": "error",

   /**
    * Disallow octal escape sequences in string literals
    *
    * @remarks
    * This is level 2 because octal escape sequences are deprecated. Also,
    * developers are typically not familiar with them. Use unicode instead.
    */
   "no-octal-escape": "error",

   /**
    * Disallow reassigning `function` parameters
    *
    * @remarks
    * This is level 2 because such code can be confusing and bug-prone.
    */
   "no-param-reassign": "error",

   /**
    * Disallow the unary operators `++` and `--`
    *
    * @remarks
    * This is turned off because it does not appear to be useful when Prettier
    * is in effect.
    */
   "no-plusplus": "off",

   /**
    * Disallow the use of the `__proto__` property
    *
    * @remarks
    * This is level 2 because the __proto__ property has been long
    * deprecated.
    */
   "no-proto": "error",

   /**
    * Disallow variable redeclaration
    *
    * @remarks
    * This is level 1 because such code is often a mistake, can lead
    * to bugs, and is usually harder to read.
    */
   "no-redeclare": "error",

   /**
    * Disallow multiple spaces in regular expressions
    *
    * @remarks
    * This is level 2 because multiple spaces in regex are hard to count,
    * and should be rewritten for clarity.
    */
   "no-regex-spaces": "error",

   /**
    * Disallow specified names in exports
    *
    * @remarks
    * This is turned off because we do not have any exports we would like
    * to restrict at this time beyond the other rules of this config. We
    * may revisit at some point in the future.
    */
   "no-restricted-exports": "off",

   /**
    * Disallow specified global variables
    *
    * @remarks
    * This is turned off because we don't have any globals we would like to
    * disallow at this time. We may revisit in the future.
    */
   "no-restricted-globals": "off",

   /**
    * Disallow specified modules when loaded by `import`
    *
    * @remarks
    * There is a typescript extension rule which overrides this.
    */
   "no-restricted-imports": "off",

   /**
    * Disallow certain properties on certain objects
    *
    * @remarks
    * We don't have any restricted properties right now, but we have in
    * the past and may again in the future.
    */
   "no-restricted-properties": "error",

   /**
    * Disallow specified syntax
    *
    * @remarks
    * We have this turned off because it would require a lot of refactoring.
    * Revisit in the future.
    */
   "no-restricted-syntax": [
      "off",
      // Do not allow setTimeout to be called with multiple arguments. There are many
      // Ways to make code run "later", and setTimeout is almost always the worst option.
      // Use observables, events, or callbacks instead. The one exception is when you want
      // To simply put some code at the back of the macrotask queue, in which case you
      // Can use setTimeout without a second parameter.
      {
         selector:
            "CallExpression[callee.name='setTimeout'][arguments.length>1]",
         message:
            "setTimeout should not be used with a delay. Use observables, events, or callbacks instead."
      }
   ],

   /**
    * Disallow assignment operators in `return` statements
    *
    * @remarks
    * This is level 2 because such code is confusing and unnecessary,
    * and it may be a mistake/bug.
    */
   "no-return-assign": "error",

   /**
    * Disallow `javascript:` urls
    *
    * @remarks
    * This is level 2 because such code is widely considered to be unsafe,
    * and also indicates a poor design.
    */
   "no-script-url": "error",

   /**
    * Disallow comma operators
    *
    * @remarks
    * I think prettier should take care of this, but just in case...
    */
   "no-sequences": "error",

   /**
    * Disallow variable declarations from shadowing variables declared in the
    * outer scope
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-shadow": "off",

   /**
    * Disallow identifiers from shadowing restricted names
    *
    * @remarks
    * This is level 2 because such code is very likely to cause bugs and is
    * probably a mistake. There is no good reason to shadow restricted names.
    */
   "no-shadow-restricted-names": "error",

   /**
    * Disallow ternary operators
    *
    * @remarks
    * Ternary operators are often confusing and hard to read. But it is not
    * a priority at this time.
    */
   "no-ternary": "off",

   /**
    * Disallow throwing literals as exceptions
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-throw-literal": "off",

   /**
    * Disallow initializing variables to `undefined`
    *
    * @remarks
    * This rule may be detrimental when using typescript. For example, a variable
    * declared as `const abc: number | undefined;` would throw an error because const
    * variables must be initialized at declaration. If we want it to be undefined,
    * we have to initialize it that way, which would break this rule.
    */
   "no-undef-init": "off",

   /**
    * Disallow the use of `undefined` as an identifier
    *
    * @remarks
    * Not applicable when `no-global-assign` and `no-shadow-restricted-names`
    * are turned on.
    */
   "no-undefined": "off",

   /**
    * Disallow dangling underscores in identifiers
    *
    * @remarks
    * This is level 0 because we don't see its value.
    */
   "no-underscore-dangle": "off",

   /**
    * Disallow ternary operators when simpler alternatives exist
    *
    * @remarks
    * This is level 2 because the simpler alternatives are more
    * readable, and there is no reason not to use them.
    */
   "no-unneeded-ternary": "error",

   /**
    * Disallow unused expressions
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-unused-expressions": "off",

   /**
    * Disallow unused labels
    *
    * @remarks
    * Turned off because it is not applicable when the `no-labels` rule is on.
    */
   "no-unused-labels": "off",

   /**
    * Disallow unnecessary calls to `.call()` and `.apply()`
    *
    * @remarks
    * Since these calls are slower than normal function invocation and harder
    * to read, they should only be used where a normal invocation is not possible.
    */
   "no-useless-call": "error",

   /**
    * Disallow unnecessary `catch` clauses
    *
    * @remarks
    * This is level 2 because such code is unnecessary and should be removed
    * to make the code easier to read.
    */
   "no-useless-catch": "error",

   /**
    * Disallow unnecessary computed property keys in objects and classes
    *
    * @remarks
    * This is level 2 because such code is unnecessary and confusing.
    */
   "no-useless-computed-key": "error",

   /**
    * Disallow unnecessary concatenation of literals or template literals
    *
    * @remarks
    * This is level 2 because such code is unnecessarily complex and
    * inefficient.
    */
   "no-useless-concat": "error",

   /**
    * Disallow unnecessary constructors
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-useless-constructor": "off",

   /**
    * Disallow unnecessary escape characters
    *
    * @remarks
    * Useless escape characters are always a mistake and may demonstrate a
    * misunderstanding of the language.
    */
   "no-useless-escape": "error",

   /**
    * Disallow renaming import, export, and destructured assignments to
    * the same name
    *
    * @remarks
    * Obviously, such code is useless and should be removed.
    */
   "no-useless-rename": "error",

   /**
    * Disallow redundant return statements
    *
    * @remarks
    * This is level 2 because such code is unnecessary and should be removed
    * to make the code easier to read.
    */
   "no-useless-return": "error",

   /**
    * Require `let` or `const` instead of `var`
    *
    * @remarks
    * let and const are more intuitive and less likely to cause name
    * conflicts or unintended shadowing. They are also more efficient
    * and easier to minify.
    */
   "no-var": "error",

   /**
    * Disallow `void` operators
    *
    * @remarks
    * This is level 2 because the 'void' operator is not intuitive, especially
    * in a typescript environment where `void` is also used as a type declaration.
    * The `undefined` keyword should be used instead of the void operator.
    */
   "no-void": "error",

   /**
    * Disallow specified warning terms in comments
    *
    * @remarks
    * This is useful because it helps developers remember to come back to code
    * that still needs attention. It is not level 2 because these comments
    * are common during development.
    *
    * We removed TODO comments from the rule because we now have a well-defined
    * style guide for managing todo comments. Those rules are currently enforced
    * by the developer and code reviewer rather than a lint rule, though we may
    * introduce a custom lint rule for TODO comments in the future.
    */
   "no-warning-comments": ["warn", { terms: ["fixme", "xxx"] }],

   /**
    * Disallow `with` statements
    *
    * @remarks
    * This is level 2 because such code is always more confusing than the
    * alternatives. `with` statements make it "impossible to tell what a variable
    * inside the block actually refers to".
    */
   "no-with": "error",

   /**
    * Require or disallow method and property shorthand syntax for object
    * literals
    *
    * @remarks
    * This is turned off right now because it is not a priority. We should
    * revisit in the future.
    */
   "object-shorthand": "off",

   /**
    * Enforce variables to be declared either together or separately in
    * functions
    *
    * @remarks
    * This is turned off because it is not a priority at this time. We may
    * revisit in the future.
    */
   "one-var": 0,

   /**
    * Require or disallow assignment operator shorthand where possible
    *
    * @remarks
    * I don't see value in this rule.
    */
   "operator-assignment": "off",

   /**
    * Require using arrow functions for callbacks
    *
    * @remarks
    * Level 2 because we want lexical scoping in callbacks
    */
   "prefer-arrow-callback": "error",

   /**
    * Require `const` declarations for variables that are never reassigned
    * after declared
    *
    * @remarks
    * const is more efficient and easier to minify. It is also an important
    * indicator of intent that future developers can use to better
    * understand the code. It is not level 2 because sometimes it may be
    * violated while the code is being written.
    */
   "prefer-const": "warn",

   /**
    * Require destructuring from arrays and/or objects
    *
    * @remarks
    * This is off because there is a typescript extension rule which overrides it.
    */
   "prefer-destructuring": "off",

   /**
    * Disallow the use of `Math.pow` in favor of the `**` operator
    *
    * @remarks
    * This is turned off because it is not a priority at this time,
    * and I wonder how useful it would be.
    */
   "prefer-exponentiation-operator": "off",

   /**
    * Enforce using named capture group in regular expression
    *
    * @remarks
    * This is level 0 mostly because we don't currently follow this rule and I
    * don't understand it well enough to fix it at this time. We should
    * revisit it in the future.
    */
   "prefer-named-capture-group": "off",

   /**
    * Disallow `parseInt()` and `Number.parseInt()` in favor of binary,
    * octal, and hexadecimal literals
    *
    * @remarks
    * I'm not as familiar with this area, but it seems like a good idea.
    * So I've set it to level 1 for now. Revisit in the future.
    */
   "prefer-numeric-literals": "warn",

   /**
    * Prefer use of `Object.hasOwn()` over `Object.prototype.hasOwnProperty.call()`
    *
    * @remarks
    * `hasOwn` is intended to replace `hasOwnProperty` see
    * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
    */
   "prefer-object-has-own": "error",

   /**
    * Disallow using Object.assign with an object literal as the first
    * argument and prefer the use of object spread instead.
    *
    * @remarks
    * This is level 2 to enforce consistency and readability
    */
   "prefer-object-spread": "error",

   /**
    * Require using Error objects as Promise rejection reasons
    *
    * @remarks
    * There is a typescript rule that overrides it.
    */
   "prefer-promise-reject-errors": "off",

   /**
    * Disallow use of the `RegExp` constructor in favor of regular expression
    * literals.
    *
    * @remarks
    * This is off right now because it is not a priority compared to other rules.
    * I'm also concerned about whether this is a good rule to implement. We will
    * want to revisit this in the future.
    */
   "prefer-regex-literals": "off",

   /**
    * Require rest parameters instead of `arguments`
    *
    * @remarks
    * Rest parameters are more versatile and easier to use. This rule is
    * set to level 2 to enforce consistency.
    */
   "prefer-rest-params": "error",

   /**
    * Require spread operators instead of `.apply()`
    *
    * @remarks
    * This is set to level 2 to enforce consistency and readability.
    */
   "prefer-spread": "error",

   /**
    * Require template literals instead of string concatenation
    *
    * @remarks
    * This is set to level 2 to enforce consistency and readability.
    */
   "prefer-template": "error",

   /**
    * Enforce the consistent use of the radix argument when using `parseInt()`
    *
    * @remarks
    * This is turned off because this rule is aimed at preventing behavior
    * that occurs in pre-ES5 environments, and does not provide enough benefit
    * in modern javascript to be used in this project.
    */
   "radix": "off",

   /**
    * Disallow async functions which have no `await` expression
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "require-await": "off",

   /**
    * Enforce the use of `u` flag on RegExp
    *
    * @remarks
    * This is not a priority at this time. We may revisit in the future.
    */
   "require-unicode-regexp": "off",

   /**
    * Require generator functions to contain `yield`
    *
    * @remarks
    * A generator without a yield is probably a mistake.
    */
   "require-yield": "error",

   /**
    * Enforce sorted import declarations within modules
    *
    * @remarks
    * Improves readability, but requires more refactoring than is a priority
    * right now.
    */
   "sort-imports": "off",

   /**
    * Require object keys to be sorted
    *
    * @remarks
    * Probably not worthwhile at this time. We may revisit later.
    */
   "sort-keys": "off",

   /**
    * Require variables within the same declaration block to be sorted
    *
    * @remarks
    * Not applicable when the `one-var` rule is set to "never"
    */
   "sort-vars": "off",

   /**
    * Enforce consistent spacing after the `//` or `/*` in a comment
    *
    * @remarks
    * Ensures consistency and readability. We should turn on in the future.
    */
   "spaced-comment": "warn",

   /**
    * Require or disallow strict mode directives
    *
    * @remarks
    * This is turned off because strict mode is already enforced by both the
    * ESM imports and the typescript compiler.
    */
   "strict": "off",

   /**
    * Require symbol descriptions
    *
    * @remarks
    * This is set to level 2 because adding a description can aid in
    * debugging and code clarity, and there isn't really a good reason
    * not to include it.
    */
   "symbol-description": "error",

   /**
    * Require `var` declarations be placed at the top of their containing scope
    *
    * @remarks
    * Not applicable when the `no-var` rule is turned on.
    */
   "vars-on-top": "off",

   /**
    * Require or disallow "Yoda" conditions
    *
    * @remarks
    * This is level 2 to enforce consistency and readability.
    */
   "yoda": "error"
};
