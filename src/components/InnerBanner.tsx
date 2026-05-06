import type { InnerBannerProps } from "@/interfaces";
import Link from "next/link";

export function InnerBanner({ title, imageSrc, imageAlt, breadcrumbs }: InnerBannerProps) {
  return (
    <section className="innerBannerWrapper">
      <div className="bannerTxt">
        <h2 className="text-uppercase fw-600 color-white">{title}</h2>
      </div>
      <img src={imageSrc} alt={imageAlt} />
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="breadcrumb">
          <ol className="breadcrumb__list">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="breadcrumb__item">
                {item.href ? (
                  <Link href={item.href} className="breadcrumb__link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumb__link">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </section>
  );
}
