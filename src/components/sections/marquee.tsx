/** What the factory makes, running across the page on a lit band. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="display flex items-center gap-8 pr-8 text-2xl md:gap-12 md:pr-12 md:text-4xl">
          {item}
          <span aria-hidden className="marquee-spark">✳</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section className="pop-marquee lit overflow-hidden bg-warm py-5 md:py-7">
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
