/**
 * These rules come from angular-eslint and are categorized by them
 * as relating to angular's code "style".
 */

module.exports = {
   /**
    * Classes decorated with @Component must have suffix “Component”
    * (or custom) in their name
    *
    * @remarks
    * This is required by Angular's style guide. See
    * https://angular.io/styleguide#style-02-03. We will leave it
    * off for now, but we should revisit in the future.
    */
   "@angular-eslint/component-class-suffix": 0,
   /**
    * Enforces certain characteristics in component selectors.
    *
    * @remarks
    * This is required by Angular's style guide. See
    * https://angular.io/guide/styleguide#style-02-07,
    * https://angular.io/guide/styleguide#style-05-02, and
    * https://angular.io/guide/styleguide#style-05-03
    */
   "@angular-eslint/component-selector": [2, { type: "element", style: "kebab-case" }],
   /**
    * Classes decorated with @Directive must have suffix “Directive”
    * (or custom) in their name.
    *
    * @remarks
    * This is required by Angular's style guide. See
    * https://angular.io/styleguide#style-02-03. We will leave it
    * off for now, but we should revisit in the future.
    */
   "@angular-eslint/directive-class-suffix": 0,
   /**
    * Enforces certain characteristics in directive selectors.
    *
    * @remarks
    * This is required by Angular's style guide. See
    * https://angular.io/guide/styleguide#style-02-06 and
    * https://angular.io/guide/styleguide#style-02-08
    */
   "@angular-eslint/directive-selector": [2, { type: "attribute", style: "camelCase" }],
   /**
    * Disallows usage of the host metadata property
    *
    * @remarks
    * Angular encourages use of @HostBinding() and @HostListener() instead.
    * See https://angular.io/styleguide#style-06-03
    */
   "@angular-eslint/no-host-metadata-property": 2,
   /**
    * Disallows usage of the inputs metadata property
    *
    * @remarks
    * Angular encourages use of @Input() instead. See
    * https://angular.io/styleguide#style-05-12
    */
   "@angular-eslint/no-inputs-metadata-property": 2,
   /**
    * Disallows usage of the outputs metadata property
    *
    * @remarks
    * Angular encourages use of @Output() instead. See
    * https://angular.io/styleguide#style-05-12
    */
   "@angular-eslint/no-outputs-metadata-property": 2,
   /**
    * Disallows usage of the queries metadata property
    *
    * @remarks
    * I'm not familiar with this property so I will leave this
    * rule off for now. Revisit in the future.
    */
   "@angular-eslint/no-queries-metadata-property": 0,
   /**
    * Enforce consistent prefix for pipes
    *
    * @remarks
    * Not a priority right now. Revisit in the future.
    */
   "@angular-eslint/pipe-prefix": 0,
   /**
    * Enforces sorting of values within NgModule metadata arrays
    *
    * @remarks
    * Not a priority right now. Revisit in the future.
    */
   "@angular-eslint/sort-ngmodule-metadata-arrays": 0
};
