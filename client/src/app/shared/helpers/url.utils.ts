export function splitRouteUrl(url: string | undefined) {
  if (!url) {
    return { url, parts: [] };
  }

  const [_, ...parts] = url
    .split('/')
    .map((n: string) => `/${n}`)
    .map((part) => (part.includes('ap_session') ? '/#' : part));

  return { url, parts };
}
