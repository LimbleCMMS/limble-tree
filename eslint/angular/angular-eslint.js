/**
 * These rules come from angular-eslint and are categorized by them
 * as relating to angular's "functionality".
 */

export const angularRules = {
   /**
    * Ensures that certain decorators are only used in the appropriate class types.
    * For example, the decorator `@Input()` should not be used in a class decorated
    * with `@Injectable()`.
    *
    * @remarks
    * Such code will usually result in an error, and is usually a mistake or
    * misunderstanding of the framework.
    */
   "angular/contextual-decorator": "error",

   /**
    * Ensures that lifecycle methods are only used in the appropriate class types.
    * For example, `ngOnInit()` should not be used in a class decorated
    * with `@Injectable()`.
    *
    * @remarks
    * Such code will usually result in an error, and is usually a mistake or
    * misunderstanding of the framework.
    */
   "angular/contextual-lifecycle": "error",

   /**
    * Disallows use of `@Attribute()`
    *
    * @remarks
    * This is off because I don't know why the attribute decorator is detrimental.
    * It seems useful in certain circumstances.
    */
   "angular/no-attribute-decorator": "off",

   /**
    * Disallows explicit calls to lifecycle methods
    *
    * @remarks
    * Invoking lifecycle methods is Angular's responsibility. Calling them
    * directly indicates that we probably need to pull some functionality out of the
    * lifecycle method and put it in a separate function.
    */
   "angular/no-lifecycle-call": "error",

   /**
    * Disallows naming directive outputs as standard DOM events
    *
    * @remarks
    * Listeners subscribed to an output with such a name will also be invoked when
    * the native event is raised. This can cause confusion and bugs that are hard
    * to address.
    */
   "angular/no-output-native": "error",

   /**
    * Disallows the declaration of impure pipes.
    *
    * @remarks
    * Impure pipes should be avoided because they are invoked on each change-detection
    * cycle.
    */
   "angular/no-pipe-impure": "error",

   /**
    * Ensures that component change detection is set to `ChangeDetectionStrategy.OnPush`
    *
    * @remarks
    * By default Angular uses the ChangeDetectionStrategy.Default. This strategy doesn’t
    * assume anything about the application, therefore every time something changes in our
    * application, as a result of various user events, timers, XHR, promises, etc., a change
    * detection will run on all components.
    *
    * By using ChangeDetectionStrategy.OnPush, Angular will only run the change detection cycle
    * in the following cases:
    * - Inputs references change.
    * - An event originated from the component or one of its children.
    * - If manually called.
    *
    * This is a *really* good rule, but I don't think we are ready to implement it yet.
    * Definitely revisit in the future.
    */
   "angular/prefer-on-push-component-change-detection": "off",

   /**
    * Ensures classes implement lifecycle interfaces corresponding to the declared
    * lifecycle methods
    *
    * @remarks
    * See https://angular.io/styleguide#style-09-01
    */
   "angular/use-lifecycle-interface": "error",

   /**
    * Disallows having too many lines in inline template and styles.
    *
    * @remarks
    * Large inline templates and styles obscure the component’s purpose and
    * implementation, reducing readability and maintainability. See
    * https://angular.io/guide/styleguide#style-05-04
    */
   "angular/component-max-inline-declarations": [2, { styles: 3, template: 3 }],

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
   "angular/no-conflicting-lifecycle": "off",

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
   "angular/no-forward-ref": "off",

   /**
    * Input names should not be prefixed by the configured disallowed prefixes.
    *
    * @remarks
    * The idea here is that "enabled" is preferred over "isEnabled" for input names.
    * But I don't think this is a priority.
    */
   "angular/no-input-prefix": "off",

   /**
    * Disallows renaming directive inputs by providing a string to the decorator.
    *
    * @remarks
    * Two names for the same property (one private, one public) is inherently
    * confusing and should be avoided.
    */
   "angular/no-input-rename": "error",

   /**
    * Name events without the prefix `on`
    *
    * @remarks
    * Angular allows for an alternative syntax on-*. If the event itself was
    * prefixed with on this would result in an on-onEvent binding expression.
    *
    * See https://angular.io/guide/styleguide#dont-prefix-output-properties
    */
   "angular/no-output-on-prefix": "error",

   /**
    * Disallows renaming directive outputs by providing a string to the decorator.
    *
    * @remarks
    * Two names for the same property (one private, one public) is inherently
    * confusing and should be avoided.
    *
    * See https://angular.io/styleguide#style-05-13
    */
   "angular/no-output-rename": "error",

   /**
    * Ensures @Output is declared as a readonly
    *
    * @remarks
    * Outputs are not supposed to be reassigned
    */
   "angular/prefer-output-readonly": "error",

   /**
    * The ./ prefix is standard syntax for relative URLs
    *
    * @remarks
    * Don’t depend on Angular's current ability to do without that prefix.
    * See https://angular.io/styleguide#style-05-04
    */
   "angular/relative-url-prefix": "error",

   /**
    * Component selector must be declared
    *
    * @remarks
    * Explicitly declaring a selector precludes the need to know what the
    * implicit selector would be.
    */
   "angular/use-component-selector": "warn",

   /**
    * Disallows using ViewEncapsulation.None
    *
    * @remarks
    * We always want to use ViewEncapsulation so we can keep the
    * styles modular and contained.
    */
   "angular/use-component-view-encapsulation": "error",

   /**
    * Ensures that classes decorated with `@Pipe()` implement
    * `PipeTransform` interface.
    *
    * @remarks
    * This should be done for type safety.
    */
   "angular/use-pipe-transform-interface": "error",

   /**
    * Ensures that services use the `providedIn` syntax recommended by Angular.
    *
    * @remarks
    * This makes injectables subject to tree shaking.
    *
    * See https://angular.io/guide/styleguide#providing-a-service and
    * https://angular.io/guide/singleton-services#providing-a-singleton-service.
    *
    * We should definitely implement this, and it wouldn't be very hard, but it
    * isn't a priority right now.
    */
   "angular/use-injectable-provided-in": "off",

   /**
    * Ensures that $localize tagged messages contain helpful metadata to aid
    * with translations
    *
    * @remarks
    * I don't think this is applicable to us right now
    */
   "angular/require-localize-metadata": "off",

   /**
    * Classes decorated with @Component must have suffix “Component”
    * (or custom) in their name
    *
    * @remarks
    * This is required by Angular's style guide. See
    * https://angular.io/styleguide#style-02-03. We will leave it
    * off for now, but we should revisit in the future.
    */
   "angular/component-class-suffix": "off",

   /**
    * Enforces certain characteristics in component selectors.
    *
    * @remarks
    * This is required by Angular's style guide. See
    * https://angular.io/guide/styleguide#style-02-07,
    * https://angular.io/guide/styleguide#style-05-02, and
    * https://angular.io/guide/styleguide#style-05-03
    */
   "angular/component-selector": [2, { type: "element", style: "kebab-case" }],

   /**
    * Classes decorated with @Directive must have suffix “Directive”
    * (or custom) in their name.
    *
    * @remarks
    * This is required by Angular's style guide. See
    * https://angular.io/styleguide#style-02-03. We will leave it
    * off for now, but we should revisit in the future.
    */
   "angular/directive-class-suffix": "off",

   /**
    * Enforces certain characteristics in directive selectors.
    *
    * @remarks
    * This is required by Angular's style guide. See
    * https://angular.io/guide/styleguide#style-02-06 and
    * https://angular.io/guide/styleguide#style-02-08
    */
   "angular/directive-selector": [2, { type: "attribute", style: "camelCase" }],

   /**
    * Disallows usage of the inputs metadata property
    *
    * @remarks
    * Angular encourages use of @Input() instead. See
    * https://angular.io/styleguide#style-05-12
    */
   "angular/no-inputs-metadata-property": "error",

   /**
    * Disallows usage of the outputs metadata property
    *
    * @remarks
    * Angular encourages use of @Output() instead. See
    * https://angular.io/styleguide#style-05-12
    */
   "angular/no-outputs-metadata-property": "error",

   /**
    * Disallows usage of the queries metadata property
    *
    * @remarks
    * I'm not familiar with this property so I will leave this
    * rule off for now. Revisit in the future.
    */
   "angular/no-queries-metadata-property": "off",

   /**
    * Enforce consistent prefix for pipes
    *
    * @remarks
    * Not a priority right now. Revisit in the future.
    */
   "angular/pipe-prefix": "off",

   /**
    * Enforces sorting of values within NgModule metadata arrays
    *
    * @remarks
    * Not a priority right now. Revisit in the future.
    */
   "angular/sort-ngmodule-metadata-arrays": "off",

   /**
    * Ensures `standalone` property is set to `true` for Component, Pipe,
    * and Directive decorators.
    *
    * @remarks
    * Standalone is newer and better.
    */
   "angular/prefer-standalone": "error",

   /**
    * Ensures that lifecycle methods are declared in order of execution
    *
    * @remarks
    * Turned on to help enforce consistency and readability.
    */
   "angular/sort-lifecycle-methods": "warn",

   /**
    * Forbids async lifecycle hook methods.
    *
    * @remarks
    * Lifecycle hook methods can be async, but this is misleading: Angular does NOT
    * wait for the async operation to complete before continuing the lifecycle. Making
    * them async often causes race conditions and subtle bugs.
    */
   "angular/no-async-lifecycle-method": "error",

   /**
    * Ensures consistent usage of styles/styleUrls/styleUrl within Component metadata
    *
    * @remarks
    * This is off for now because it isn't a priority, but I would like to
    * revisit in the future.
    */
   "angular/consistent-component-styles": "off",

   /** Ensures that decorator metadata arrays do not contain duplicate entries. */
   "angular/no-duplicates-in-metadata-arrays": "error"
};
