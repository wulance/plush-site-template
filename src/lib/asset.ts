const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** The address of a file under public/, wherever the site is hosted. */
export function asset(path: string) {
  return basePath + path;
}
