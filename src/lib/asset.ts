const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** The address of a file under public/, wherever the site is hosted. A full address (https://…, mailto:…) is kept as it is. */
export function asset(path: string) {
  return /^([a-z][a-z\d+.-]*:|\/\/)/i.test(path) ? path : basePath + path;
}
