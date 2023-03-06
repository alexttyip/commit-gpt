const isString = (apiKey: unknown): apiKey is string =>
  typeof apiKey === "string";

export default isString;
