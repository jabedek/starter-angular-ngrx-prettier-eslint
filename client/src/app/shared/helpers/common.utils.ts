export async function tryCatch<T = unknown>(
  promise: Promise<T>,
  shouldConsoleError = false,
): Promise<[T, undefined] | [undefined, unknown]> {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    if (shouldConsoleError) {
      consoleError(error);
    }
    return [undefined, error];
  }
}

export function consoleError(catchedError: any, prefix1 = '', prefix0 = '[App Error]') {
  console.error(`${prefix0}${prefix1}`, catchedError);
}
