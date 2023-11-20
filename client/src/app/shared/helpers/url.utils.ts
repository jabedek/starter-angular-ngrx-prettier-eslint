export function splitRouteUrl(url: string | undefined) {
  console.log(url);

  if (!url) {
    return { url, parts: [] };
  }

  const [_, ...parts] = url.split('/').map((n: string) => `/${n}`);
  return { url, parts };
}
