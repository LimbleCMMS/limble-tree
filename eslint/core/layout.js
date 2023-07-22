export const layoutRules = {
   /**
    * Enforce linebreaks after opening and before closing array brackets
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "array-bracket-newline": "off",

   /**
    * Enforce consistent spacing inside array brackets
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "array-bracket-spacing": "off",

   /**
    * Enforce line breaks after each array element
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "array-element-newline": "off",

   /**
    * Require parentheses around arrow function arguments
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "arrow-parens": "off",

   /**
    * Enforce consistent spacing before and after the arrow in arrow functions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "arrow-spacing": "off",

   /**
    * Disallow or enforce spaces inside of blocks after opening block and
    * before closing block
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "block-spacing": "off",

   /**
    * Enforce consistent brace style for blocks
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "brace-style": "off",

   /**
    * Require or disallow trailing commas
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "comma-dangle": "off",

   /**
    * Enforce consistent spacing before and after commas
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "comma-spacing": "off",

   /**
    * Enforce consistent comma style
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "comma-style": "off",

   /**
    * Enforce consistent spacing inside computed property brackets
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "computed-property-spacing": "off",

   /**
    * Enforce consistent newlines before and after dots
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "dot-location": "off",

   /**
    * Require or disallow newline at the end of files
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "eol-last": "off",

   /**
    * Require or disallow spacing between function identifiers and their
    * invocations
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "func-call-spacing": "off",

   /**
    * Enforce line breaks between arguments of a function call
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "function-call-argument-newline": "off",

   /**
    * Enforce consistent line breaks inside function parentheses
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "function-paren-newline": "off",

   /**
    * Enforce consistent spacing around `*` operators in generator functions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "generator-star-spacing": "off",

   /**
    * Enforce the location of arrow function bodies
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "implicit-arrow-linebreak": "off",

   /**
    * Enforce consistent indentation
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "indent": "off",

   /**
    * Enforce the consistent use of either double or single quotes in
    * JSX attributes
    *
    * @remarks
    * This is turned off because we do not use jsx
    */
   "jsx-quotes": "off",

   /**
    * Enforce consistent spacing between keys and values in object
    * literal properties
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "key-spacing": "off",

   /**
    * Enforce consistent spacing before and after keywords
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "keyword-spacing": "off",

   /**
    * Enforce position of line comments
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "line-comment-position": "off",

   /**
    * Enforce consistent linebreak style
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "linebreak-style": "off",

   /**
    * Require empty lines around comments
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "lines-around-comment": "off",

   /**
    * Require or disallow an empty line between class members
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "lines-between-class-members": "off",

   /**
    * Enforce a maximum line length
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "max-len": "off",

   /**
    * Enforce a maximum number of statements allowed per line
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "max-statements-per-line": "off",

   /**
    * Enforce newlines between operands of ternary expressions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "multiline-ternary": "off",

   /**
    * Enforce or disallow parentheses when invoking a constructor with no arguments
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "new-parens": "off",

   /**
    * Require a newline after each call in a method chain
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "newline-per-chained-call": "off",

   /**
    * Disallow unnecessary parentheses
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "no-extra-parens": "off",

   /**
    * Disallow mixed spaces and tabs for indentation
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-mixed-spaces-and-tabs": "off",

   /**
    * Disallow multiple spaces
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-multi-spaces": "off",

   /**
    * Disallow multiple empty lines
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-multiple-empty-lines": "off",

   /**
    * Disallow all tabs
    *
    * @remarks
    * This is level 0 because Prettier already takes care of tabbing.
    */
   "no-tabs": "off",

   /**
    * Disallow trailing whitespace at the end of lines
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-trailing-spaces": "off",

   /**
    * Disallow whitespace before properties
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "no-whitespace-before-property": "off",

   /**
    * Enforce the location of single-line statements
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "nonblock-statement-body-position": "off",

   /**
    * Enforce consistent line breaks inside braces
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "object-curly-newline": "off",

   /**
    * Enforce consistent spacing inside braces
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "object-curly-spacing": "off",

   /**
    * Enforce placing object properties on separate lines
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "object-property-newline": "off",

   /**
    * Enforce consistent linebreak style for operators
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "operator-linebreak": "off",

   /**
    * Require or disallow padding within blocks
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "padded-blocks": "off",

   /**
    * Require or disallow padding lines between statements
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule
    * that overrides it.
    */
   "padding-line-between-statements": "off",

   /**
    * Enforce the consistent use of either backticks, double, or single quotes
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "quotes": "off",

   /**
    * Enforce spacing between rest and spread operators and their expressions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "rest-spread-spacing": "off",

   /**
    * Require or disallow semicolons instead of ASI
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "semi": "off",

   /**
    * Enforce consistent spacing before and after semicolons
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "semi-spacing": "off",

   /**
    * Enforce location of semicolons
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "semi-style": "off",

   /**
    * Enforce consistent spacing before blocks
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "space-before-blocks": "off",

   /**
    * Enforce consistent spacing before `function` definition opening
    * parenthesis
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "space-before-function-paren": "off",

   /**
    * Enforce consistent spacing inside parentheses
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "space-in-parens": "off",

   /**
    * Require spacing around infix operators
    *
    * @remarks
    * This is level 0 because there is a typescript extension rule which
    * overrides it.
    */
   "space-infix-ops": "off",

   /**
    * Enforce consistent spacing before or after unary operators
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "space-unary-ops": "off",

   /**
    * Enforce spacing around colons of switch statements
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "switch-colon-spacing": "off",

   /**
    * Require or disallow spacing around embedded expressions of template strings
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "template-curly-spacing": "off",

   /**
    * Require or disallow spacing between template tags and their
    * literals
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "template-tag-spacing": "off",

   /**
    * Require or disallow Unicode byte order mark (BOM)
    *
    * @remarks
    * This is turned off because it is not a priority at this time. We may
    * revisit in the future.
    */
   "unicode-bom": "off",

   /**
    * Require parentheses around immediate `function` invocations
    *
    * @remarks
    * I'm not sure if Prettier already takes care of this, and I'm
    * also not very familiar with this area or the benefits of such a rule.
    * I also don't think this is a priority right now, since we don't often
    * use IIFEs. Because of these considerations, the rule is turned off.
    * We may need to revisit in the future.
    */
   "wrap-iife": "off",

   /**
    * Require parenthesis around regex literals
    *
    * @remarks
    * This is turned off because it is not a priority at this time. We may
    * revisit in the future.
    */
   "wrap-regex": "off",

   /**
    * Require or disallow spacing around the `*` in `yield*` expressions
    *
    * @remarks
    * This is level 0 because Prettier already takes care of it.
    */
   "yield-star-spacing": "off"
};
