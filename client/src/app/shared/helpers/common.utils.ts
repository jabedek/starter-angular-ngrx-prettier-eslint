export async function tryCatch<T = unknown>(
  promise: Promise<T>,
  label = 'promise',
): Promise<[T, undefined] | [undefined, unknown]> {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

export function consoleError(catchedError: any, prefix1 = '', prefix0 = '[App Error]') {
  console.error(`${prefix0}${prefix1}`, catchedError);
}
