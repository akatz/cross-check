import { ErrorPath, ValidationError } from "@cross-check/core";
import { ValidationBuilder, validators } from "@cross-check/dsl";
import { Dict, dict, entries } from "ts-std";

export { JSON as JSONValue } from "ts-std";

export function exhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}

export interface Multiple {
  message: {
    name: "multiple";
    details: ValidationError[][];
  };
  path: ErrorPath;
}

function isMultiple(error: ValidationError): error is Multiple {
  return error.message.name === "multiple";
}

export type MapDict<
  D extends Dict,
  C extends (value: any, key?: any) => unknown
> = { [P in keyof D]: ReturnType<C> };

export function mapDict<T, U>(
  input: Dict<T>,
  callback: (value: T, key: keyof typeof input) => U
): MapDict<typeof input, typeof callback> {
  let out = dict();

  for (let [key, value] of entries(input)) {
    let result = callback(value!, key);
    if (result !== undefined) {
      out[key] = result;
    }
  }

  return out as MapDict<typeof input, typeof callback>;
}

export function maybe<T>(validator: ValidationBuilder<T>) {
  // This validators allows values to be absent, but if they are present,
  // requires them to comply with the specified validator. The `catch`
  // unwraps the `or` error join.
  //
  // This situation is the expected use-case for an `.if` combinator,
  // something like:
  //
  // validators.if(validators.isAbsent()).then(validator)
  //
  // If that combinator lands upstream, this could be removed or pared
  // down.

  return validators
    .isAbsent()
    .or(validator)
    .catch(errors => {
      let first = errors[0];
      if (isMultiple(first)) {
        let suberrors = first.message.details;

        if (suberrors.length === 2) {
          return suberrors[1];
        }
      }

      return errors;
    });
}

export function titleize(s: string): string {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
}
