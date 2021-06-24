module.exports = {
   /**
    * Enforces alternate text for elements which allow the `alt`, `aria-label`, or
    * `aria-labelledby` attributes.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "@angular-eslint/template/accessibility-alt-text": 0,
   /**
    * Ensures that the heading, anchor, and button elements have content in them.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "@angular-eslint/template/accessibility-elements-content": 0,
   /**
    * Checks if a label component is associated with a form element
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "@angular-eslint/template/accessibility-label-has-associated-control": 0,
   /**
    * Ensures that scope is not used on any element except th. The scope attribute
    * makes table navigation much easier for screen reader users, provided that it
    * is used correctly. If used incorrectly, it can make table navigation much harder
    * and less efficient.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "@angular-eslint/template/accessibility-table-scope": 0,
   /**
    * Ensures that the correct ARIA attributes are used
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "@angular-eslint/template/accessibility-valid-aria": 0,
   /**
    * Ensures that the two-way data binding syntax is correct;
    * eg, [(ngModel)] is correct whereas ([ngModel]) is not.
    *
    * @remarks
    * Not following this rule will result in bugs. It is usually
    * a mistake or a misunderstanding of the framework/syntax.
    */
   "@angular-eslint/template/banana-in-box": 2,
   /**
    * The condition complexity shouldn’t exceed a rational limit in a template.
    *
    * @remarks
    * This rule applies cyclomatic complexity calculations to conditional
    * template expressions. So the line `*ngIf="A || B || C"` would be considered
    * to have a complexity of 3. I'm arbitrarily putting the limit at 4 because it
    * seems to me that any higher complexity becomes hard to read and understand.
    * It also appears to be the default value in the tslint rule this is based on.
    *
    * See also `@angular-eslint/template/cyclomatic-complexity` rule.
    *
    * This is turned off for now because we don't follow it and it requires some
    * refactoring. Revisit in the future.
    */
   "@angular-eslint/template/conditional-complexity": [0, { maxComplexity: 4 }],
   /**
    * Ensures that click events are accompanied by at least one key event keyup,
    * keydown or keypress. This is important for users with physical disabilities
    * who cannot use the mouse.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "@angular-eslint/template/click-events-have-key-events": 0,
   /**
    * Checks cyclomatic complexity against a specified limit.
    *
    * @remarks
    * This rule applies cyclomatic complexity calculations to angular templates.
    * The exact algorithm is not clear. It seems to calculate the complexity based
    * on the number of structural directives; eg, a single `*ngIf` or `*ngFor`
    * directive causes the complexity score to increase by one. The calculation does
    * not include conditional logic such as using `&&` in a directive expression.
    *
    * See also `@angular-eslint/template/conditional-complexity` rule.
    *
    * I'm arbitrarily setting the limit to 6 because it seems like a good limit
    * and it also appears to be the default value in the tslint rule this is based
    * on. If the cyclomatic complexity is too high, the component should be split
    * into multiple components.
    *
    * This is turned off for now because we don't follow it and it requires some
    * refactoring. Revisit in the future.
    */
   "@angular-eslint/template/cyclomatic-complexity": [0, { maxComplexity: 6 }],
   /**
    * Requires `===` and `!==` in place of `==` and `!=`
    *
    * @remarks
    * This is a very valuable rule that we should implement at some point: Type
    * coercion is not clear, and related bugs are very difficult to spot.
    * However, it will be easy to implement this after we have strict typescript.
    * So we will leave it off for now.
    */
   "@angular-eslint/template/eqeqeq": 0,
   /**
    * Enforces best practices for i18n.
    *
    * @remarks
    * I'm not sure what the status of our i18n system is right now,
    * so I will leave this turned off. But we will probably need to revisit
    * in the future.
    */
   "@angular-eslint/template/i18n": 0,
   /**
    * Ensures that mouse events are accompanied by Key Events focus and blur.
    * This is important for users with physical disabilities who cannot use the
    * mouse.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "@angular-eslint/template/mouse-events-have-key-events": 0,
   /**
    * Disallows using ‘$any’ in templates.
    *
    * @remarks
    * The use of ‘$any’ nullifies the compile-time benefits of the Angular's type system
    * and should not be used. However, we have not yet fully implemented typescript and
    * this isn't a priority right now. We should revisit in the future.
    */
   "@angular-eslint/template/no-any": 0,
   /**
    * Ensures that the autofocus property is not used
    *
    * @remarks
    * I don't understand why this rule would be useful. We should revisit in the future.
    */
   "@angular-eslint/template/no-autofocus": 0,
   /**
    * Disallows calling expressions in templates, except for output handlers
    *
    * @remarks
    * Calling expressions in templates causes it to run on every change detection cycle
    * and may cause performance issues. The exception, of course, is for output bindings
    * such as `(click)`, which do not run on every change detection cycle and should not
    * be flagged by this rule.
    *
    * This is turned off for now because we don't follow it and it requires some
    * refactoring. Revisit in the future.
    */
   "@angular-eslint/template/no-call-expression": 0,
   /**
    * Enforces that no "distracting" elements are used
    *
    * @remarks
    * Accessibility is not a priority right now. Also, I'm not sure how such a rule would
    * work and how we would change the code to comply with it.
    */
   "@angular-eslint/template/no-distracting-elements": 0,
   /**
    * Prevents passing the same attribute more than once to the same component
    *
    * @remarks
    * Almost certainly a mistake, and can have unexpected results. Should be avoided.
    */
   "@angular-eslint/template/no-duplicate-attributes": 2,
   /**
    * Ensures that strict equality is used when evaluating negations on async pipe output
    *
    * @remarks
    * Angular’s async pipes emit null initially, prior to the observable emitting any
    * values, or the promise resolving. This can cause negations, like
    * *ngIf=”!(myConditional | async)” to thrash the layout and cause expensive
    * side-effects like firing off XHR requests for a component which should not be shown.
    */
   "@angular-eslint/template/no-negated-async": 2,
   /**
    * Ensures that the tabindex attribute is not positive
    *
    * @remarks
    * Apparently, positive values for tabindex attributes should be avoided because
    * they conflict with the order of focus.
    *
    * This is turned off for now because we don't follow it and it requires some
    * refactoring. Revisit in the future.
    */
   "@angular-eslint/template/no-positive-tabindex": 0,
   /**
    * Ensures trackBy function is used in `*ngFor`.
    *
    * @remarks
    * Using trackBy helps Angular's change detection cycle to be more efficient.
    * Without a trackBy function, the entire *ngFor structure will be re-evaluated on
    * every cycle.
    *
    * This is turned off for now because we don't follow it and it requires some
    * refactoring. Revisit in the future.
    */
   "@angular-eslint/template/use-track-by-function": 0
};
