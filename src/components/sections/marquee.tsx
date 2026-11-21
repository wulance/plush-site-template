/** What the factory makes, running across the page on a lit band. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="display flex items-center gap-8 pr-8 text-xl md:gap-12 md:pr-12 md:text-2xl">
          {item}
          <span aria-hidden className="size-1.5 rounded-full bg-accent/60" />
        </li>
      ))}
    </ul>
  );
  return (
    <section className="lit overflow-hidden border-y border-line bg-warm/35 py-5 md:py-6">
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
