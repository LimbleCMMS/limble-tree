module.exports = {
   "accessor-pairs": 1,
   "array-callback-return": 2,
   "block-scoped-var": 0,
   "class-methods-use-this": 0,
   "complexity": 0,
   "consistent-return": 2,
   "curly": 0,
   "default-case": 1,
   "default-case-last": 2,
   "default-param-last": 0,
   "dot-location": 0,
   "dot-notation": 0,
   "eqeqeq": 0,
   "grouped-accessor-pairs": 2,
   "guard-for-in": 0,
   "max-classes-per-file": 2,
   "no-alert": 1,
   "no-caller": 2,
   "no-case-declarations": 2,
   "no-constructor-return": 2,
   "no-div-regex": 1,
   "no-else-return": 0,
   "no-empty-function": 0,
   "no-empty-pattern": 1,
   "no-eq-null": 0,
   "no-eval": 2,
   "no-extend-native": 2,
   "no-extra-bind": 2,
   "no-extra-label": 0,
   "no-fallthrough": 1,
   "no-floating-decimal": 2,
   "no-global-assign": 2,
   "no-implicit-coercion": 2,
   "no-implicit-globals": 2,
   "no-implied-eval": 2,
   "no-invalid-this": 0,
   "no-iterator": 2,
   "no-labels": 2,
   "no-lone-blocks": 2,
   "no-loop-func": 0,
   "no-magic-numbers": 0,
   "no-multi-spaces": 0,
   "no-multi-str": 0,
   "no-new": 2,
   "no-new-func": 2,
   "no-new-wrappers": 2,
   "no-nonoctal-decimal-escape": 2,
   "no-octal": 2,
   "no-octal-escape": 2,
   "no-param-reassign": 1,
   "no-proto": 2,
   "no-redeclare": 1,
   "no-restricted-properties": [
      2,
      {
         object: "$q",
         message: "Use native Promises or $http instead of the old $q library"
      },
      {
         object: "$provide",
         property: "provider",
         message:
            "Avoid creating providers dynamically: use module.provider instead."
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
         message:
            "Avoid creating services dynamically: use module.service instead."
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
   "no-return-assign": 2,
   "no-return-await": 0,
   "no-script-url": 2,
   "no-self-assign": 2,
   "no-self-compare": 2,
   "no-sequences": 2,
   "no-throw-literal": 0,
   "no-unmodified-loop-condition": 1,
   "no-unused-expressions": 0,
   "no-unused-labels": 0,
   "no-useless-call": 2,
   "no-useless-catch": 2,
   "no-useless-concat": 2,
   "no-useless-escape": 2,
   "no-useless-return": 2,
   "no-void": 2,
   "no-warning-comments": 1,
   "no-with": 2,
   "prefer-named-capture-group": 0,
   "prefer-promise-reject-errors": 1,
   "prefer-regex-literals": 0,
   "radix": 0,
   "require-await": 0,
   "require-unicode-regexp": 0,
   "vars-on-top": 0,
   "wrap-iife": 0,
   "yoda": 2,
   "strict": 0
};
