export function isEmpty(value) {
  if (typeof value === "string") {
    return value.trim().length !== 0;
  }
}
