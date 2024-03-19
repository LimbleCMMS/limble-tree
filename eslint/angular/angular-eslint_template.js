export const angularTemplateRules = {
   /**
    * Enforces alternate text for elements which allow the `alt`, `aria-label`, or
    * `aria-labelledby` attributes.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "template/alt-text": "off",
   /**
    * Ensures that the heading, anchor, and button elements have content in them.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "template/elements-content": "off",
   /**
    * Checks if a label component is associated with a form element
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "template/label-has-associated-control": "off",
   /**
    * Ensures that scope is not used on any element except th. The scope attribute
    * makes table navigation much easier for screen reader users, provided that it
    * is used correctly. If used incorrectly, it can make table navigation much harder
    * and less efficient.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "template/table-scope": "off",
   /**
    * Ensures that the correct ARIA attributes are used
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "template/valid-aria": "off",
   /**
    * Ensures that the two-way data binding syntax is correct;
    * eg, [(ngModel)] is correct whereas ([ngModel]) is not.
    *
    * @remarks
    * This is turned off because, since Angular 14, the Angular compiler already
    * provides this functionality. See https://angular.io/extended-diagnostics/NG8101
    */
   "template/banana-in-box": "off",
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
    * See also `template/cyclomatic-complexity` rule.
    *
    * This is set to our current highest complexity to prevent anything higher.
    * Ideally we would lower it at some point in the future, but for now we
    * don't because it would require some refactoring.
    */
   "template/conditional-complexity": ["warn", { maxComplexity: 14 }],
   /**
    * Ensures that click events are accompanied by at least one key event keyup,
    * keydown or keypress. This is important for users with physical disabilities
    * who cannot use the mouse.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "template/click-events-have-key-events": "off",
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
    * See also `template/conditional-complexity` rule.
    *
    * I'm arbitrarily setting the limit to 6 because it seems like a good limit
    * and it also appears to be the default value in the tslint rule this is based
    * on. If the cyclomatic complexity is too high, the component should be split
    * into multiple components.
    *
    * This is turned off for now because we don't follow it and it requires some
    * refactoring. Revisit in the future.
    */
   "template/cyclomatic-complexity": ["off", { maxComplexity: 6 }],
   /**
    * Requires `===` and `!==` in place of `==` and `!=`
    *
    * @remarks
    * Type coercion is confusing, and related bugs are very difficult to spot.
    * We currently violate this rule a lot, and it is hard to fix without better
    * typescript, so we are leaving it at level 0
    * until we can get more typescript implemented. Revisit in the future.
    */
   "template/eqeqeq": "off",
   /**
    * Enforces best practices for i18n.
    *
    * @remarks
    * I'm not sure what the status of our i18n system is right now,
    * so I will leave this turned off. But we will probably need to revisit
    * in the future.
    */
   "template/i18n": "off",
   /**
    * Ensures that mouse events are accompanied by Key Events focus and blur.
    * This is important for users with physical disabilities who cannot use the
    * mouse.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "template/mouse-events-have-key-events": "off",
   /**
    * Disallows using ‘$any’ in templates.
    *
    * @remarks
    * The use of ‘$any’ nullifies the compile-time benefits of the Angular's type system
    * and should not be used. Left it as level 1 because $any might need to be used during
    * development,
    */
   "template/no-any": "warn",
   /**
    * Ensures that the autofocus property is not used
    *
    * @remarks
    * I don't understand why this rule would be useful. We should revisit in the future.
    */
   "template/no-autofocus": "off",
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
   "template/no-call-expression": "off",
   /**
    * Enforces that no "distracting" elements are used
    *
    * @remarks
    * Accessibility is not a priority right now. Also, I'm not sure how such a rule would
    * work and how we would change the code to comply with it.
    */
   "template/no-distracting-elements": "off",
   /**
    * Prevents passing the same attribute more than once to the same component
    *
    * @remarks
    * Almost certainly a mistake, and can have unexpected results. Should be avoided.
    */
   "template/no-duplicate-attributes": "error",
   /**
    * Ensures that strict equality is used when evaluating negations on async pipe output
    *
    * @remarks
    * Angular’s async pipes emit null initially, prior to the observable emitting any
    * values, or the promise resolving. This can cause negations, like
    * *ngIf=”!(myConditional | async)” to thrash the layout and cause expensive
    * side-effects like firing off XHR requests for a component which should not be shown.
    */
   "template/no-negated-async": "error",
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
   "template/no-positive-tabindex": "off",
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
   "template/use-track-by-function": "off",

   /**
    * Ensures that a button has a valid type specified
    *
    * @remarks
    * This is not a priority for us right now.
    */
   "template/button-has-type": "off",

   /**
    * Ensures that elements with interactive handlers like `(click)` are focusable.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "template/interactive-supports-focus": "off",

   /**
    * Ensures elements with ARIA roles have all required properties for that role.
    *
    * @remarks
    * Accessibility is not a priority at this time.
    */
   "template/role-has-required-aria": "off",

   /**
    * Ensures that HTML attributes and Angular bindings are sorted based on an
    * expected order
    *
    * @remarks
    * Not a priority at this time. We may revisit in the future.
    */
   "template/attributes-order": "off",

   /**
    * Disallows the use of inline styles in HTML templates
    *
    * @remarks
    * Inline styles are harder to maintain and less reusable than classes.
    * We should implement this soon.
    */
   "template/no-inline-styles": "error",

   /**
    * Ensures that property-binding is used instead of interpolation in attributes.
    *
    * @remarks
    * This seems like a great rule, but we violate it too much right now.
    */
   "template/no-interpolation-in-attributes": "off",

   /**
    * Ensures that self-closing tags are used for elements with a closing tag but
    * no content.
    *
    * @remarks
    * Self-closing tags are more concise.
    */
   "template/prefer-self-closing-tags": "warn",

   /**
    * Ensures ngSrc is used instead of src for img elements
    *
    * @remarks
    * This would probably be a really good rule to turn on. Revisit in the future.
    */
   "template/prefer-ngsrc": "off",

   /**
    * Ensures that the template control flow syntax introduced in Angular 17 is used.
    *
    * @remarks
    * DEREK TODO: Turn this on as part of the Angular migration.
    */
   "template/prefer-control-flow": "off"
};
