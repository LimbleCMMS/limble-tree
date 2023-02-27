/**
 * These rules come from angular-eslint and are categorized by them
 * as relating to angular's "functionality".
 */

module.exports = {
   /**
    * Ensures that certain decorators are only used in the appropriate class types.
    * For example, the decorator `@Input()` should not be used in a class decorated
    * with `@Injectable()`.
    *
    * @remarks
    * Such code will usually result in an error, and is usually a mistake or
    * misunderstanding of the framework.
    */
   "@angular-eslint/contextual-decorator": 2,
   /**
    * Ensures that lifecycle methods are only used in the appropriate class types.
    * For example, `ngOnInit()` should not be used in a class decorated
    * with `@Injectable()`.
    *
    * @remarks
    * Such code will usually result in an error, and is usually a mistake or
    * misunderstanding of the framework.
    */
   "@angular-eslint/contextual-lifecycle": 2,
   /**
    * Disallows use of `@Attribute()`
    *
    * @remarks
    * This rule is intended to prevent accidental misuse of the decorator; however, there
    * are perfectly valid reasons to use the decorator, so we have the rule turned off.
    * Any misuse is better addressed in code review than by a lint rule.
    */
   "@angular-eslint/no-attribute-decorator": 0,
   /**
    * Disallows explicit calls to lifecycle methods
    *
    * @remarks
    * Invoking lifecycle methods is Angular's responsibility. Calling them
    * directly indicates that we probably need to pull some functionality out of the
    * lifecycle method and put it in a separate function.
    */
   "@angular-eslint/no-lifecycle-call": 2,
   /**
    * Disallows naming directive outputs as standard DOM events
    *
    * @remarks
    * Listeners subscribed to an output with such a name will also be invoked when
    * the native event is raised. This can cause confusion and bugs that are hard
    * to address.
    */
   "@angular-eslint/no-output-native": 2,
   /**
    * Disallows the declaration of impure pipes.
    *
    * @remarks
    * Impure pipes should be avoided because they are invoked on each change-detection
    * cycle.
    */
   "@angular-eslint/no-pipe-impure": 2,
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
   "@angular-eslint/prefer-on-push-component-change-detection": 0,
   /**
    * Ensures that classes decorated with `@Injectable()` use the "providedIn" property.
    *
    * @remarks
    * This makes injectables subject to tree shaking. It is the recommended way to inject
    * services since Angular 6, if I remember correctly. We should look into this in the
    * future. Right now it is not a high priority.
    */
   "@angular-eslint/use-injectable-provided-in": 0,
   /**
    * Ensures classes implement lifecycle interfaces corresponding to the declared
    * lifecycle methods
    *
    * @remarks
    * See https://angular.io/styleguide#style-09-01
    */
   "@angular-eslint/use-lifecycle-interface": 2
};
