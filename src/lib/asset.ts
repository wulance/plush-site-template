const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The address of a file under public/ (a path starting with "/"), wherever the site is hosted.
 * Anything else is kept as it is: a full address (https://…, mailto:…), a part of the page (#contact), a relative path.
 */
export function asset(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? basePath + path : path;
}
