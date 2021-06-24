/**
 * These rules come from angular-eslint and are categorized by them
 * as relating to angular's "maintainability".
 */

module.exports = {
   /**
    * Disallows having too many lines in inline template and styles.
    *
    * @remarks
    * Large inline templates and styles obscure the component’s purpose and
    * implementation, reducing readability and maintainability. See
    * https://angular.io/guide/styleguide#style-05-04
    */
   "@angular-eslint/component-max-inline-declarations": [2, { styles: 3, template: 3 }],
   /**
    * Ensures that directives do not implement conflicting lifecycle interfaces.
    *
    * @remarks
    * The argument for this rule is that a directive or component typically should
    * not use both DoCheck and OnChanges to respond to changes on the same input,
    * since changes to the input would cause both functions to run.
    * However, I'm not sure I agree with this premise. While such code *may* be
    * a mistake or misunderstanding of the framework, there may also be some cases
    * where some code needs to run on every cycle and some code only needs to run on
    * changes, in which case having them separate seems ideal. But perhaps I am
    * misunderstanding something? I'll leave it turned off for now and revisit in
    * the future.
    */
   "@angular-eslint/no-conflicting-lifecycle": 0,
   /**
    * Disallows usage of forwardRef references for DI
    *
    * @remarks
    * I don't know much about forwardRef, but the argument for this rule is that
    * forwardRef makes code harder to understand.
    *
    * This is turned off for now because we don't follow it and it requires some
    * refactoring. Revisit in the future.
    */
   "@angular-eslint/no-forward-ref": 0,
   /**
    * Input names should not be prefixed by the configured disallowed prefixes.
    *
    * @remarks
    * The idea here is that "enabled" is preferred over "isEnabled" for input names.
    * But I don't think this is a priority.
    */
   "@angular-eslint/no-input-prefix": 0,
   /**
    * Disallows renaming directive inputs by providing a string to the decorator.
    *
    * @remarks
    * Two names for the same property (one private, one public) is inherently
    * confusing and should be avoided.
    */
   "@angular-eslint/no-input-rename": 2,
   /**
    * Name events without the prefix `on`
    *
    * @remarks
    * Angular allows for an alternative syntax on-*. If the event itself was
    * prefixed with on this would result in an on-onEvent binding expression.
    *
    * See https://angular.io/guide/styleguide#dont-prefix-output-properties
    */
   "@angular-eslint/no-output-on-prefix": 2,
   /**
    * Disallows renaming directive outputs by providing a string to the decorator.
    *
    * @remarks
    * Two names for the same property (one private, one public) is inherently
    * confusing and should be avoided.
    *
    * See https://angular.io/styleguide#style-05-13
    */
   "@angular-eslint/no-output-rename": 2,
   /**
    * Ensures @Output is declared as a readonly
    *
    * @remarks
    * Outputs are not supposed to be reassigned
    */
   "@angular-eslint/prefer-output-readonly": 2,
   /**
    * The ./ prefix is standard syntax for relative URLs
    *
    * @remarks
    * Don’t depend on Angular's current ability to do without that prefix.
    * See https://angular.io/styleguide#style-05-04
    */
   "@angular-eslint/relative-url-prefix": 2,
   /**
    * Component selector must be declared
    *
    * @remarks
    * Explicitly declaring a selector precludes the need to know what the
    * implicit selector would be.
    */
   "@angular-eslint/use-component-selector": 1,
   /**
    * Disallows using ViewEncapsulation.None
    *
    * @remarks
    * We always want to use ViewEncapsulation so we can keep the
    * styles modular and contained.
    */
   "@angular-eslint/use-component-view-encapsulation": 2,
   /**
    * Ensures that classes decorated with `@Pipe()` implement
    * `PipeTransform` interface.
    *
    * @remarks
    * This should be done for type safety.
    */
   "@angular-eslint/use-pipe-transform-interface": 2
};
