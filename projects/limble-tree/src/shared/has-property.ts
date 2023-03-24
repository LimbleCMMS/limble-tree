export function hasProperty<T extends string>(
   input: unknown,
   prop: T
): input is { [Key in T]: unknown } {
   return typeof input === "object" && input !== null && prop in input;
}
