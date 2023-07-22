/**
 * These rules relate to Typescript and come from the typescript-eslint plugin. See
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
 * for information on these rules and the plugin
 */

export const typescriptRules = {
   /**
    * Require that member overloads be consecutive
    *
    * @remarks
    * This is level 2 to enforce consistency and readability
    */
   "typescript/adjacent-overload-signatures": "error",

   /**
    * Requires using either `T[]` or `Array<T>` for arrays
    *
    * @remarks
    * We are leaving this off for now because it isn't high priority. We
    * may revisit in the future.
    */
   "typescript/array-type": "off",

   /**
    * Disallows awaiting a value that is not a Thenable
    *
    * @remarks
    * There is no reason to await a non-promise value. This is probably a
    * mistake, and should be removed.
    */
   "typescript/await-thenable": "error",

   /**
    * Bans `// @ts-<directive>` comments from being used or requires
    * descriptions after directive
    *
    * @remarks
    * The only reason to use such comments is to cover up an underlying
    * problem. The problem should be addressed instead.
    */
   "typescript/ban-ts-comment": "error",

   /**
    * Bans `// tslint:<rule-flag>` comments from being used
    *
    * @remarks
    * This rule is usually used for migrating from tslint. We don't use
    * tslint, but we might as well ban the comments anyway. We might
    * turn off this rule if it is having a performance impact.
    */
   "typescript/ban-tslint-comment": "error",

   /**
    * Bans specific types from being used
    *
    * @remarks
    * This is level 1 because these types should almost never be used.
    * See https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#general-types
    */
   "typescript/ban-types": ["warn", { extendDefaults: true }],

   /**
    * Ensures that literals on classes are exposed in a consistent style
    *
    * @remarks
    * This rule is helpful for typescript applications that are compiled
    * to javascript and used by other devs in its javascript form. That
    * does not apply to us. I don't think this rule is worthwhile at
    * this time.
    */
   "typescript/class-literal-property-style": "off",

   /**
    * Enforces consistent usage of type assertions
    *
    * @remarks
    * This is level 1 to enforce consistency and readability.
    * Also because objectLiteralTypeAssertions can hide type
    * errors
    */
   "typescript/consistent-type-assertions": [
      "warn",
      {
         assertionStyle: "as",
         objectLiteralTypeAssertions: "never"
      }
   ],

   /**
    * Consistent with type definition either interface or type
    *
    * @remarks
    * This is off because it is not a priority right now. We may
    * revisit in the future.
    */
   "typescript/consistent-type-definitions": "off",

   /**
    * Enforces consistent usage of type exports
    *
    * @remarks
    * Type exports allow the compiler to be more efficient.
    */
   "typescript/consistent-type-exports": "warn",

   /**
    * Enforces consistent usage of type imports
    *
    * @remarks
    * Type imports allow the compiler to be more efficient. We have it
    * off right now because we don't want to worry about it until we
    * really dive in to typescript. It also conflicts a little bit
    * with Angular "tokens" (as in dependency injection); it can be done,
    * but it is annoying.
    */
   "typescript/consistent-type-imports": "off",

   /**
    * Require explicit return types on functions and class methods
    *
    * @remarks
    * This is off for now because we are still in transition. We
    * will turn it on in the future when we get closer to the end
    * of the transition.
    */
   "typescript/explicit-function-return-type": "off",

   /**
    * Require explicit accessibility modifiers on class properties
    * and methods
    *
    * @remarks
    * Accessibility modifiers are an easy and powerful way to express
    * the intent or contract of the method/property. We have this set
    * to level 1 to remind developers to use them. We currently have
    * an exception for properties, simply because it requires a big
    * refactor that we haven't gotten to yet -- but we should revisit
    * in the future and remove the overrides.
    */
   "typescript/explicit-member-accessibility": [
      "warn",
      { overrides: { properties: "off" } }
   ],

   /**
    * Require explicit return and argument types on exported
    * functions' and classes' public class methods
    *
    * @remarks
    * This is off for now because we are still in transition. We will turn
    * it on in the future when we get closer to the end of the transition.
    * Note that this rule may be obsolete when `noImplicitAny` config is
    * used
    */
   "typescript/explicit-module-boundary-types": "off",

   /**
    * Require a specific member delimiter style for interfaces and type
    * literals
    *
    * @remarks
    * This is off because prettier takes care of it already.
    */
   "typescript/member-delimiter-style": "off",

   /**
    * Require a consistent member declaration order
    *
    * @remarks
    * This is level 1 to help enforce consistency. The rule is relatively
    * loose right now. At some point we may want to make it more specific.
    */
   "typescript/member-ordering": [
      "warn",
      {
         default: ["field", "constructor", "method"]
      }
   ],

   /**
    * Enforces using a particular method signature syntax
    *
    * @remarks
    * This is level 2 to enforce consistency and readability, and
    * because the "method syntax" does not play well
    * with typescript's `strictFunctionTypes` setting.
    */
   "typescript/method-signature-style": "error",

   /**
    * Enforces naming conventions for everything across a codebase
    *
    * @remarks
    * This is off because it is not a priority right now, and we
    * don't have much preference on naming conventions other than
    * the rules already used in this config.
    */
   "typescript/naming-convention": "off",

   /**
    * Requires that `.toString()` is only called on objects which
    * provide useful information when stringified
    *
    * @remarks
    * This is level 2 because such code is almost certainly a mistake.
    */
   "typescript/no-base-to-string": "error",

   /**
    * Disallow non-null assertion in locations that may be confusing
    *
    * @remarks
    * Not applicable when the `no-non-null-assertion` rule is on
    */
   "typescript/no-confusing-non-null-assertion": "off",

   /**
    * Requires expressions of type void to appear in statement position
    *
    * @remarks
    * This is level 2 because it helps avoid ambiguities around the `void` type
    */
   "typescript/no-confusing-void-expression": "error",

   /**
    * Disallow duplicate constituents of union or intersection types.
    *
    * @remarks
    * Such code is extraneous.
    */
   "typescript/no-duplicate-type-constituents": "error",

   /**
    * Disallow the delete operator with computed key expressions
    *
    * @remarks
    * This is a really good indicator of poor choice of data structure.
    * But there are too many instances where we violate the rule right now.
    * We should revisit after Plaid, because the move to Lookups should
    * address most of the violations.
    */
   "typescript/no-dynamic-delete": "off",

   /**
    * Disallow the declaration of empty interfaces
    *
    * @remarks
    * This is level 2 because such declarations are useless and should
    * be deleted
    */
   "typescript/no-empty-interface": "error",

   /**
    * Disallow usage of the `any` type
    *
    * @remarks
    * This is off for now because we are still in transition. We will turn
    * it on in the future when we get closer to the end of the transition.
    */
   "typescript/no-explicit-any": "off",

   /**
    * Disallow extra non-null assertion
    *
    * @remarks
    * Not applicable when the `no-non-null-assertion` rule is on
    */
   "typescript/no-extra-non-null-assertion": "off",

   /**
    * Forbids the use of classes as namespaces
    *
    * @remarks
    * This is level 2 because such code is unnecessarily confusing and does
    * not follow the norms of the language. We allow empty classes because
    * many classes in Angular appear empty (though they usually have a
    * decorator that makes them substantive at runtime)
    */
   "typescript/no-extraneous-class": [
      "error",
      { allowEmpty: true, allowConstructorOnly: true }
   ],

   /**
    * Requires Promise-like values to be handled appropriately
    *
    * @remarks
    * This is off because it doesn't seem to work as expected. We may
    * revisit it in the future.
    */
   "typescript/no-floating-promises": "off",

   /**
    * Disallow iterating over an array with a for-in loop
    *
    * @remarks
    * This is level 1 to enforce consistency and readability. It is not level
    * 2 because there are so many places where we violate the rule. We should
    * bump it to level 2 in the future.
    */
   "typescript/no-for-in-array": "warn",

   /**
    * Enforce the use of top-level import type qualifier when an import only
    * has specifiers with inline type qualifiers.
    *
    * @remarks
    * Helps improve tree shaking at typescript transpile time
    */
   "typescript/no-import-type-side-effects": "error",

   /**
    * Disallow usage of the implicit any type in catch clauses
    *
    * @remarks
    * Improves type safety, but not a priority right now.
    */
   "typescript/no-implicit-any-catch": "off",

   /**
    * Disallow the use of `eval()`-like methods
    *
    * @remarks
    * This is level 2 because such code raises security and performance
    * concerns, and indicates a poor design.
    */
   "typescript/no-implied-eval": "error",

   /**
    * Disallows explicit type declarations for variables or parameters
    * initialized to a number, string, or boolean
    *
    * @remarks
    * I have mixed feelings about this rule. On the one hand, unnecessary code
    * should generally be removed; but I don't see a problem with being a
    * little extra verbose in the type system, even if it is redundant. We
    * will leave it off for now.
    */
   "typescript/no-inferrable-types": "off",

   /**
    * Disallows usage of void type outside of generic or return types
    *
    * @remarks
    * This is level 2 because code that violates this rule is unnecessarily
    * complex or misleading, and may indicate a lack of understanding of the
    * `void` type.
    */
   "typescript/no-invalid-void-type": "error",

   /**
    * Disallow the void operator when its argument is already of type void or
    * undefined.
    *
    * @remarks
    * Not applicable when the `no-void` rule is turned on.
    */
   "typescript/no-meaningless-void-operator": "off",

   /**
    * Enforce valid definition of `new` and `constructor`
    *
    * @remarks
    * This is level 2 because such code is erroneous and probably a mistake.
    */
   "typescript/no-misused-new": "error",

   /**
    * Avoid using promises in places not designed to handle them
    *
    * @remarks
    * This is level 2 because such code is almost certainly a mistake or a
    * misunderstanding of how promises work.
    */
   "typescript/no-misused-promises": "error",

   /**
    * Disallow enums from having both number and string members.
    *
    * @remarks
    * Improves consistency and avoids likely bugs.
    */
   "typescript/no-mixed-enums": "error",

   /**
    * Disallow the use of custom TypeScript modules and namespaces
    *
    * @remarks
    * This is level 2 to enforce consistency and readability, and also to
    * discourage use of typescript features that have fallen out of favor.
    */
   "typescript/no-namespace": "error",

   /**
    * Disallows using a non-null assertion in the left operand of the nullish
    * coalescing operator
    *
    * @remarks
    * Not applicable when `no-non-null-assertion` is turned on.
    */
   "typescript/no-non-null-asserted-nullish-coalescing": "off",

   /**
    * Disallows using a non-null assertion after an optional chain expression
    *
    * @remarks
    * Not applicable when the `no-non-null-assertion` rule is on
    */
   "typescript/no-non-null-asserted-optional-chain": "off",

   /**
    * Disallows non-null assertions using the `!` postfix operator
    *
    * @remarks
    * This is level 2 because "non-null assertions cancels the benefits of
    * the strict null-checking mode", and if that mode is not used then
    * there is no reason to use the assertion.
    */
   "typescript/no-non-null-assertion": "error",

   /**
    * Disallow the use of parameter properties in class constructors
    *
    * @remarks
    * This is off because parameter properties are the norm in NestJS.
    */
   "typescript/no-parameter-properties": "off",

   /**
    * Disallows invocation of `require()`
    *
    * @remarks
    * This is level 2 to enforce the use of the newer ES6 imports/exports
    * instead. This enforces consistency and improves readability.
    */
   "typescript/no-require-imports": "error",

   /**
    * Disallow aliasing `this`
    *
    * @remarks
    * Assigning `this` to a variable instead of properly using arrow lambdas
    * may be a symptom of pre-ES6 practices or not managing scope well.
    */
   "typescript/no-this-alias": "warn",

   /**
    * Disallow throwing literals as exceptions
    *
    * @remarks
    * In addition to consistency and readability, throwing an error object
    * provides more benefits than throwing a literal, and there isn't a good
    * reason not to use an error object.
    */
   "typescript/no-throw-literal": "error",

   /**
    * Disallow the use of type aliases
    *
    * @remarks
    * This is off because I don't think it would be useful.
    */
   "typescript/no-type-alias": "off",

   /**
    * Flags unnecessary equality comparisons against boolean literals
    *
    * @remarks
    * This is turned off because I think there is value in being more
    * explicit.
    */
   "typescript/no-unnecessary-boolean-literal-compare": "off",

   /**
    * Prevents conditionals where the type is always truthy or always falsy
    *
    * @remarks
    * This is off because, though such code is probably unnecessary in the strictest
    * sense, sometimes it is desirable for runtime checking. For example, code like this
    * wil be flagged:
    * ```typescript
    * let a: 1 | 2 | 3 = 1;
    * //In some distant code block...
    * if (a === 1) {
    *    console.log(1);
    * } else if (a === 2) {
    *    console.log(2);
    * } else if (a === 3) { //warning: condition is always true
    *    console.log(3);
    * }
    * ```
    * According to typescript, the third conditional will always be true, and wants us to
    * rewrite the code like so:
    * ```typescript
    * let a: 1 | 2 | 3 = 1;
    * //In some distant code block...
    * if (a === 1) {
    *    console.log(1);
    * } else if (a === 2) {
    *    console.log(2);
    * } else {
    *    console.log(3);
    * }
    * ```
    * However, this revised block assumes that our type system is perfect and never wrong.
    * We hope that is true, but the benefits of removing the last `if` check don't outweigh
    * the risk of `a` possibly being something that the type system couldn't detect, like
    * 4, which would cause `console.log(3)` to run, introducing a bug.
    * Perhaps we can revisit in the future.
    */
   "typescript/no-unnecessary-condition": "off",

   /**
    * Warns when a namespace qualifier is unnecessary
    *
    * @remarks
    * This is level 1 because we want to use the newer syntax when possible.
    */
   "typescript/no-unnecessary-qualifier": "warn",

   /**
    * Enforces that type arguments will not be used if not required
    *
    * @remarks
    * This is off, because I think the added verbosity may actually be useful.
    */
   "typescript/no-unnecessary-type-arguments": "off",

   /**
    * Warns if a type assertion does not change the type of an expression
    *
    * @remarks
    * This is important because such assertions are unnecessary and should
    * be removed.
    */
   "typescript/no-unnecessary-type-assertion": "error",

   /**
    * Disallows unnecessary constraints on generic types
    *
    * @remarks
    * This is level 2 because extending from `unknown` or `any` in a generic
    * type is unnecessary.
    */
   "typescript/no-unnecessary-type-constraint": "error",

   /**
    * Disallows calling an function with an any type value
    *
    * @remarks
    * Improves type safety. We should turn on soon.
    */
   "typescript/no-unsafe-argument": "off",

   /**
    * Disallows assigning `any` to variables and properties
    *
    * @remarks
    * Improves type safety. We should turn on soon.
    */
   "typescript/no-unsafe-assignment": "off",

   /**
    * Disallows calling an `any` type value
    *
    * @remarks
    * Improves type safety. We should turn on soon.
    */
   "typescript/no-unsafe-call": "off",

   /**
    * Disallow unsafe declaration merging.
    *
    * @remarks
    * Such code is confusing and buggy.
    */
   "typescript/no-unsafe-declaration-merging": "error",

   /**
    * Disallow comparing an enum value with a non-enum value.
    *
    * @remarks
    * Typescript 5.0 already protects against most of what this rule is attempting
    * to mitigate. Leaving off for now.
    */
   "typescript/no-unsafe-enum-comparison": "off",

   /**
    * Disallows member access on `any` typed variables
    *
    * @remarks
    * Improves type safety. We should turn on soon.
    */
   "typescript/no-unsafe-member-access": "off",

   /**
    * Disallows returning any from a function
    *
    * @remarks
    * Improves type safety. We should turn on soon.
    */
   "typescript/no-unsafe-return": "off",

   /**
    * Disallows the use of require statements except in import statements
    *
    * @remarks
    * Not applicable when `no-require-imports` is on
    */
   "typescript/no-var-requires": "off",

   /**
    * Prefers a non-null assertion over explicit type cast when possible
    *
    * @remarks
    * Not applicable when `no-non-null-assertion` is on
    */
   "typescript/non-nullable-type-assertion-style": "off",

   /**
    * Prefer usage of `as const` over literal type
    *
    * @remarks
    * I'm not convinced that the `as const` syntax is better than the
    * alternative.
    */
   "typescript/prefer-as-const": "off",

   /**
    * Prefer initializing each enums member value
    *
    * @remarks
    * This is level 2 to improve consistency and readability in enums.
    */
   "typescript/prefer-enum-initializers": "error",

   /**
    * Prefer a ‘for-of’ loop over a standard ‘for’ loop if the index is only
    * used to access the array being iterated
    *
    * @remarks
    * This is level 1 to enforce consistency and readability. It is not level
    * 2 because for loops may be used temporarily during development.
    */
   "typescript/prefer-for-of": "warn",

   /**
    * Use function types instead of interfaces with call signatures
    *
    * @remarks
    * This is level 2 to enforce consistency and readability
    */
   "typescript/prefer-function-type": "error",

   /**
    * Enforce `includes` method over `indexOf` method
    *
    * @remarks
    * This is level 2 to enforce consistency and readability
    */
   "typescript/prefer-includes": "error",

   /**
    * Require that all enum members be literal values to prevent unintended
    * enum member name shadow issues
    *
    * @remarks
    * This is off for now just because I am wary that it will be more trouble
    * than it is worth. We may revisit in the future.
    */
   "typescript/prefer-literal-enum-member": "off",

   /**
    * Require the use of the `namespace` keyword instead of the `module` keyword
    * to declare custom TypeScript modules
    *
    * @remarks
    * This is level 2 to prevent deprecated use of the "module" keyword.
    */
   "typescript/prefer-namespace-keyword": "error",

   /**
    * Enforce the usage of the nullish coalescing operator instead of
    * logical chaining
    *
    * @remarks
    * This makes the code more concise and prevents errors that may occur
    * when using `||` in assignments.
    */
   "typescript/prefer-nullish-coalescing": "error",

   /**
    * Prefer using concise optional chain expressions instead of chained
    * logical ands
    *
    * @remarks
    * This greatly improves readability. However, it is not level 2 because the
    * documentation explicitly states "There are a few edge cases where this rule
    * will false positive."
    */
   "typescript/prefer-optional-chain": "warn",

   /**
    * Requires that private members are marked as `readonly` if they're never
    * modified outside of the constructor
    *
    * @remarks
    * This is turned on because `readonly` conveys intent (the same way `const`
    * does for variable declarations) that is valuable to future devs. It is
    * not level 2 because it may flag code during development.
    */
   "typescript/prefer-readonly": "warn",

   /**
    * Requires that function parameters are typed as readonly to prevent
    * accidental mutation of inputs
    *
    * @remarks
    * This is off for now because it would require a ton of refactoring.
    * We may revisit at some point in the future.
    */
   "typescript/prefer-readonly-parameter-types": "off",

   /**
    * Prefer using type parameter when calling `Array#reduce` instead of casting
    *
    * @remarks
    * Whenever there is an alternative to casting, we should take it.
    */
   "typescript/prefer-reduce-type-parameter": "error",

   /**
    * Enforce that `RegExp#exec` is used instead of `String#match` if no
    * global flag is provided
    *
    * @remarks
    * As the docs say, "`RegExp#exec` is faster than `String#match` and both
    * work the same when not using the /g flag."
    */
   "typescript/prefer-regexp-exec": "error",

   /**
    * Enforce that `this` is used when only `this` type is returned
    *
    * @remarks
    * Helps avoid inheritance issues
    */
   "typescript/prefer-return-this-type": "error",

   /**
    * Enforce the use of String#startsWith and String#endsWith instead of
    * other equivalent methods of checking substrings
    *
    * @remarks
    * This greatly improves readability
    */
   "typescript/prefer-string-starts-ends-with": "error",

   /**
    * Recommends using `// @ts-expect-error` over `// @ts-ignore`
    *
    * @remarks
    * Not applicable when the `ban-ts-comment` rule is turned on.
    */
   "typescript/prefer-ts-expect-error": "off",

   /**
    * Requires any function or method that returns a Promise to be marked async
    *
    * @remarks
    * As the docs say, this rule ensures that the function is capable
    * of either returning a rejected promise or throwing an Error
    * object, but not both. In contrast, non-async Promise-returning functions are
    * capable of either, which introduces unnecessary complexity. This is not
    * level 2 at the moment, but we may change this in the future.
    */
   "typescript/promise-function-async": "warn",

   /**
    * Requires `Array#sort` calls to always provide a compareFunction
    *
    * @remarks
    * This is not a priority at this time. We may revisit in the future.
    */
   "typescript/require-array-sort-compare": "off",

   /**
    * When adding two variables, operands must both be of type number or of
    * type string
    *
    * @remarks
    * Reduces bugs and improves readability. We should turn it on soon.
    */
   "typescript/restrict-plus-operands": ["off"],

   /**
    * Enforce template literal expressions to be of string type
    *
    * @remarks
    * This is off for now because we violate this rule in many places and
    * it is not a priority right now. We should revisit in the future.
    */
   "typescript/restrict-template-expressions": "off",

   /**
    * Enforces that members of a type union/intersection are sorted alphabetically
    *
    * @Remarks
    * This is not a priority at this time. We may revisit in the future.
    */
   "typescript/sort-type-union-intersection-members": "off",

   /**
    * Restricts the types allowed in boolean expressions
    *
    * @remarks
    * This is not a priority right now. We may revisit in the future.
    */
   "typescript/strict-boolean-expressions": "off",

   /**
    * Exhaustiveness checking in switch with union type
    *
    * @remarks
    * This will point out when a case in a switch statement is missing. Switch
    * statements should always consider all possible cases to prevent bugs.
    */
   "typescript/switch-exhaustiveness-check": "error",

   /**
    * Sets preference level for triple slash directives versus ES6-style
    * import declarations
    *
    * @remarks
    * This prevents use of deprecated syntax and enforces consistency.
    */
   "typescript/triple-slash-reference": "error",

   /**
    * Require consistent spacing around type annotations
    *
    * @remarks
    * Prettier already takes care of this
    */
   "typescript/type-annotation-spacing": "off",

   /**
    * Requires type annotations to exist
    *
    * @remarks
    * This rule seems to be discouraged by the documentation, so we leave
    * it turned off.
    */
   "typescript/typedef": "off",

   /**
    * Enforces unbound methods are called with their expected scope
    *
    * @remarks
    * This is level 2 because such code will usually cause bugs and won't
    * work as expected due to scope switching. If you want to purposefully
    * use scope switching, it probably should not be a class method.
    */
   "typescript/unbound-method": "error",

   /**
    * Warns for any two overloads that could be unified into one by using a
    * union or an optional/rest parameter
    *
    * @remarks
    * This is level 2 because code flagged by this rule should be simplified
    * for easier readability.
    */
   "typescript/unified-signatures": "error",

   /**
    * Disallow members of unions and intersections that do nothing or override
    * type information
    *
    * @remarks
    * This is turned on because we want to keep our type declarations clear.
    */
   "typescript/no-redundant-type-constituents": "error",

   /**
    * Disallow empty exports that don't change anything in a module file
    *
    * @remarks
    * This is turned on for obvious reasons
    */
   "typescript/no-useless-empty-export": "error",

   /**
    * Disallow duplicate enum member values.
    *
    * @remarks
    * This is level 2 because, as the docs state, "people usually expect
    * members to have unique values within the same enum. Duplicate values
    * can lead to bugs that are hard to track down."
    */
   "typescript/no-duplicate-enum-values": "error",

   /**
    * Enforce specifying generic type arguments on type annotation or
    * constructor name of a constructor call.
    *
    * @remarks
    * This is not a priority for us right now, but we may revisit in the future.
    */
   "typescript/consistent-generic-constructors": "off"
};
