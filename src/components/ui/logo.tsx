import brand from "@brand";
import type { Locale } from "@/i18n/config";
import { asset } from "@/lib/asset";

/** The brand's mark and name. Without a logo file, the mark is the first letter of the name. */
export function Logo({ locale }: { locale: Locale }) {
  const name = brand.name[locale];
  return (
    <span className="flex items-center gap-2.5">
      {brand.logo ? (
        <img src={asset(brand.logo)} alt="" width={36} height={36} className="size-9" />
      ) : (
        <span aria-hidden className="display grid size-9 place-items-center rounded-full bg-accent text-lg text-ink">
          {Array.from(name)[0]}
        </span>
      )}
      <span className="flex flex-col leading-none">
        <span className="display text-[1.375rem]">{name}</span>
        <span className="note mt-1 text-[0.5625rem] text-ink-soft">{brand.descriptor[locale]}</span>
      </span>
    </span>
  );
}
