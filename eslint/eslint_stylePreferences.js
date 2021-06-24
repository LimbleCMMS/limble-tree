/**
 * These rules relate to style guidelines, and are therefore quite subjective
 * They are included with eslint.
 */

module.exports = {
   /**
    * enforce linebreaks after opening and before closing array brackets
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "array-bracket-newline": 0,

   /**
    * enforce consistent spacing inside array brackets
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "array-bracket-spacing": 0,

   /**
    * enforce line breaks after each array element
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "array-element-newline": 0,

   /**
    * disallow or enforce spaces inside of blocks after opening block and
    * before closing block
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "block-spacing": 0,

   /**
    * enforce consistent brace style for blocks
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "brace-style": 0,

   /**
    * enforce camelcase naming convention
    *
    * @remarks
    * This is turned off because it is not a priority right now compared
    * to other rules. We will probably turn this on in the future.
    */
   "camelcase": 0,

   /**
    * enforce or disallow capitalization of the first letter of a comment
    *
    * @remarks
    * Not worth the effort, probably more annoying than helpful.
    */
   "capitalized-comments": 0,

   /**
    * require or disallow trailing commas
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "comma-dangle": 0,

   /**
    * enforce consistent spacing before and after commas
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "comma-spacing": 0,

   /**
    * enforce consistent comma style
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "comma-style": 0,

   /**
    * enforce consistent spacing inside computed property brackets
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "computed-property-spacing": 0,

   /**
    * enforce consistent naming when capturing the current execution
    * context
    *
    * @remarks
    * This is not a priority right now compared to other rules, but we
    * may want to use it in the future.
    *
    * Note that the `no-this-alias` rule from typescript-eslint, if used,
    * would render this rule obsolete.
    */
   "consistent-this": 0,

   /**
    * require or disallow newline at the end of files
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "eol-last": 0,

   /**
    * require or disallow spacing between function identifiers and their
    * invocations
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "func-call-spacing": 0,

   /**
    * require function names to match the name of the variable or property
    * to which they are assigned
    *
    * @remarks
    * This is turned off because it is not a priority right now. We
    * can revisit later.
    */
   "func-name-matching": 0,

   /**
    * require or disallow named `function` expressions
    *
    * @remarks
    * This is turned off because it is not a priority right now, but
    * it seems like something we would want to implement in the future.
    */
   "func-names": 0,

   /**
    * enforce the consistent use of either `function` declarations or
    * expressions
    *
    * @remarks
    * This is not a priority at this time. We can revisit in the future.
    */
   "func-style": 0,

   /**
    * enforce line breaks between arguments of a function call
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "function-call-argument-newline": 0,

   /**
    * enforce consistent line breaks inside function parentheses
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "function-paren-newline": 0,

   /**
    * disallow specified identifiers
    *
    * @remarks
    * This is level 1 because it will take significant refactoring to
    * get rid of "$q". But we may want to revisit this in the future.
    */
   "id-denylist": [
      1,
      /** We want to encourage the use of native Promises instead of
       * the old "q" library. Native promises are clearer and much more
       * widely used, and they don't require a third-party library. Also,
       * the "q" library's last update was in 2017.
       */
      "$q"
   ],

   /**
    * enforce minimum and maximum identifier lengths
    *
    * @remarks
    * This is level 2 to enforce the use of clear and semantically
    * meaningful identifiers.
    */
   "id-length": [
      2,
      {
         min: 3,
         max: 50,
         exceptions: [
            "$q",
            "PO",
            "po",
            "PR",
            "pr",
            "id",
            "DD",
            "MM",
            "YY",
            "dd",
            "mm",
            "yy",
            "WO",
            "wo",
            "PM",
            "pm",
            "at",
            "on",
            "On",
            "to",
            "To",
            "is",
            "$"
         ]
      }
   ],

   /**
    * require identifiers to match a specified regular expression
    *
    * @remarks
    * This is turned off because we have no preference on identifier
    * names beyond the other rules in this config.
    */
   "id-match": 0,

   /**
    * enforce the location of arrow function bodies
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "implicit-arrow-linebreak": 0,

   /**
    * enforce consistent indentation
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "indent": 0,

   /**
    * enforce the consistent use of either double or single quotes in
    * JSX attributes
    *
    * @remarks
    * This is turned off because we do not use jsx
    */
   "jsx-quotes": 0,

   /**
    * enforce consistent spacing between keys and values in object
    * literal properties
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "key-spacing": 0,

   /**
    * enforce consistent spacing before and after keywords
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "keyword-spacing": 0,

   /**
    * enforce position of line comments
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "line-comment-position": 0,

   /**
    * enforce consistent linebreak style
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "linebreak-style": 0,

   /**
    * require empty lines around comments
    *
    * @remarks
    * This is turned off because I don't think it is useful
    */
   "lines-around-comment": 0,

   /**
    * require or disallow an empty line between class members
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "lines-between-class-members": 0,

   /**
    * enforce a maximum depth that blocks can be nested
    *
    * @remarks
    * This is turned off because I don't think it is appropriate
    * to create a blanket rule in this matter.
    */
   "max-depth": 0,

   /**
    * enforce a maximum line length
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "max-len": 0,

   /**
    * enforce a maximum number of lines per file
    *
    * @remarks
    * This is turned off because it would require massive refactoring
    * at this time in order to comply with it. We may turn this up to
    * level 1 at some point in the future, but we will have
    * to revisit whether it will be useful.
    */
   "max-lines": 0,

   /**
    * enforce a maximum number of lines of code in a function
    *
    * @remarks
    * This is turned off because it would require massive refactoring
    * at this time in order to comply with it. We may turn this up to
    * level 1 at some point in the future. This should be used
    * in association with the `max-statements` rule
    */
   "max-lines-per-function": 0,

   /**
    * enforce a maximum depth that callbacks can be nested
    *
    * @remarks
    * This is turned off because I don't think it is appropriate
    * to create a blanket rule in this matter.
    */
   "max-nested-callbacks": 0,

   /**
    * enforce a maximum number of parameters in function definitions
    *
    * @remarks
    * This is turned off because it is not a priority at this time, and
    * it would be hard to find a number that is appropriate as a
    * blanket rule. We may revisit in the future.
    */
   "max-params": 0,

   /**
    * enforce a maximum number of statements allowed in function blocks
    *
    * @remarks
    * This is turned off because it would require massive refactoring
    * at this time in order to comply with it. We may turn this up to
    * level 1 at some point in the future. This should be used
    * in association with the `max-lines-per-function` rule
    */
   "max-statements": 0,

   /**
    * enforce a maximum number of statements allowed per line
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "max-statements-per-line": 0,

   /**
    * enforce a particular style for multiline comments
    *
    * @remarks
    * This is turned off because it is not something we want to enforce.
    */
   "multiline-comment-style": 0,

   /**
    * enforce newlines between operands of ternary expressions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "multiline-ternary": 0,

   /**
    * require constructor names to begin with a capital letter
    *
    * @remarks
    * This is level 2 to enforce consistency and readability
    */
   "new-cap": [
      2,
      {
         capIsNewExceptions: [
            /* Angular Decorators */
            "NgModule",
            "Injectable",
            "Inject",
            "Component",
            "Input",
            "Directive",
            "Pipe",
            "Output",
            "HostBinding",
            "HostListener",
            "ContentChild",
            "ContentChildren",
            "ViewChild",
            "ViewChildren",
            "Attribute",
            "SkipSelf",
            "Host",
            "Optional"
            /* End of Angular Decorators */
         ]
      }
   ],

   /**
    * enforce or disallow parentheses when invoking a constructor with no arguments
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "new-parens": 0,

   /**
    * require a newline after each call in a method chain
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "newline-per-chained-call": 0,

   /**
    * disallow `Array` constructors
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-array-constructor": 0,

   /**
    * disallow bitwise operators
    *
    * @remarks
    * This is level 2 because it is almost always a mistake. If there is a
    * valid use case, disable this rule for that line and leave a comment.
    */
   "no-bitwise": 2,

   /**
    * disallow `continue` statements
    *
    * @remarks
    * This is turned off because it is not a priority at this time,
    * and I wonder how useful it is.
    */
   "no-continue": 0,

   /**
    * disallow inline comments after code
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-inline-comments": 0,

   /**
    * disallow `if` statements as the only statement in `else` blocks
    *
    * @remarks
    * This is level 2 because such code can be rewritten to be
    * simpler and easier to read.
    * Bryan disabled for the time being.  After refactoring it wasn't adding clarity.  I will reenable it later and test to see if code written is confusing
    */
   "no-lonely-if": 0,

   /**
    * disallow mixed binary operators
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-mixed-operators": 0,

   /**
    * disallow mixed spaces and tabs for indentation
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-mixed-spaces-and-tabs": 0,

   /**
    * disallow use of chained assignment expressions
    *
    * @remarks
    * This is level 2 because "chaining the assignment of variables can
    * lead to unexpected results and be difficult to read". Such
    * statements should be separated.
    */
   "no-multi-assign": 2,

   /**
    * disallow multiple empty lines
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-multiple-empty-lines": 0,

   /**
    * disallow negated conditions
    *
    * @remarks
    * This is level 1 because such code is slightly harder to read than
    * the alternative. This is not level 2 because there currently
    * many violations, and it is not as high priority compared to
    * other rules.
    */
   "no-negated-condition": 1,

   /**
    * disallow nested ternary expressions
    *
    * @remarks
    * This is level 2 because such code is very difficult to read.
    */
   "no-nested-ternary": 2,

   /**
    * disallow `Object` constructors
    *
    * @remarks
    * This is level 2 because it enforces consistency and readability
    */
   "no-new-object": 2,

   /**
    * disallow the unary operators `++` and `--`
    *
    * @remarks
    * This is turned off because it does not appear to be useful.
    */
   "no-plusplus": 0,

   /**
    * disallow specified syntax
    *
    * @remarks
    * This is turned off because we do not have any syntax we would
    * like to restrict at this time beyond the other rules in this
    * config.
    */
   "no-restricted-syntax": 0,

   /**
    * disallow all tabs
    *
    * @remarks
    * This is level 0 because Prettier already takes care of tabbing.
    */
   "no-tabs": 0,

   /**
    * disallow ternary operators
    *
    * @remarks
    * This is turned off because it is not a priority at this time.
    * However, I like the idea of this rule and we may turn it on
    * in the future.
    */
   "no-ternary": 0,

   /**
    * disallow trailing whitespace at the end of lines
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-trailing-spaces": 0,

   /**
    * disallow dangling underscores in identifiers
    *
    * @remarks
    * This is level 0 because it is not a priority at this time,
    * and I wonder if the benefit is worth the effort.
    */
   "no-underscore-dangle": 0,

   /**
    * disallow ternary operators when simpler alternatives exist
    *
    * @remarks
    * This is level 2 because the simpler alternatives are more
    * readable, and there is no reason not to use them.
    */
   "no-unneeded-ternary": 2,

   /**
    * disallow use of optional chaining in contexts where the undefined value is not allowed
    *
    * @remarks
    * This is level 0 because typescript and typescript-eslint already take care of it.
    */
   "no-unsafe-optional-chaining": 0,

   /**
    * disallow whitespace before properties
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-whitespace-before-property": 0,

   /**
    * enforce the location of single-line statements
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "nonblock-statement-body-position": 0,

   /**
    * enforce consistent line breaks inside braces
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "object-curly-newline": 0,

   /**
    * enforce consistent spacing inside braces
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "object-curly-spacing": 0,

   /**
    * enforce placing object properties on separate lines
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "object-property-newline": 0,

   /**
    * enforce variables to be declared either together or separately in
    * functions
    *
    * @remarks
    * This is turned off because it is not a priority at this time. We may
    * revisit in the future.
    */
   "one-var": 0,

   /**
    * require or disallow newlines around variable declarations
    *
    * @remarks
    * This is turned off because it is not a priority at this time. We may
    * revisit in the future.
    */
   "one-var-declaration-per-line": 0,

   /**
    * require or disallow assignment operator shorthand where possible
    *
    * @remarks
    * This is turned off because it is not a priority at this time. We may
    * revisit in the future.
    */
   "operator-assignment": 0,

   /**
    * enforce consistent linebreak style for operators
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "operator-linebreak": 0,

   /**
    * require or disallow padding within blocks
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "padded-blocks": 0,

   /**
    * require or disallow padding lines between statements
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "padding-line-between-statements": 0,

   /**
    * disallow the use of `Math.pow` in favor of the `**` operator
    *
    * @remarks
    * This is turned off because it is not a priority at this time,
    * and I wonder how useful it would be.
    */
   "prefer-exponentiation-operator": 0,

   /**
    * disallow using Object.assign with an object literal as the first
    * argument and prefer the use of object spread instead.
    *
    * @remarks
    * This is level 2 to enforce consistency and readability
    */
   "prefer-object-spread": 2,

   /**
    * require quotes around object literal property names
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "quote-props": 0,

   /**
    * enforce the consistent use of either backticks, double, or single quotes
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "quotes": 0,

   /**
    * require or disallow semicolons instead of ASI
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "semi": 0,

   /**
    * enforce consistent spacing before and after semicolons
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "semi-spacing": 0,

   /**
    * enforce location of semicolons
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "semi-style": 0,

   /**
    * require object keys to be sorted
    *
    * @remarks
    * This is level 0 for the time being because it would require
    * large-scale refactoring. We should revisit this in the future.
    */
   "sort-keys": 0,

   /**
    * This is level 0 for the time being because it would require
    * large-scale refactoring. We should revisit this in the future.
    */
   "sort-vars": 0,

   /**
    * enforce consistent spacing before blocks
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "space-before-blocks": 0,

   /**
    * enforce consistent spacing before `function` definition opening
    * parenthesis
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "space-before-function-paren": 0,

   /**
    * enforce consistent spacing inside parentheses
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "space-in-parens": 0,

   /**
    * require spacing around infix operators
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "space-infix-ops": 0,

   /**
    * enforce consistent spacing before or after unary operators
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "space-unary-ops": 0,

   /**
    * enforce consistent spacing after the `//` or `/*` in a comment
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "spaced-comment": 0,

   /**
    * enforce spacing around colons of switch statements
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "switch-colon-spacing": 0,

   /**
    * require or disallow spacing between template tags and their
    * literals
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "template-tag-spacing": 0,

   /**
    * require or disallow Unicode byte order mark (BOM)
    *
    * @remarks
    * This is turned off because it is not a priority at this time. We may
    * revisit in the future.
    */
   "unicode-bom": 0,

   /**
    * require parenthesis around regex literals
    *
    * @remarks
    * This is turned off because it is not a priority at this time. We may
    * revisit in the future.
    */
   "wrap-regex": 0
};
