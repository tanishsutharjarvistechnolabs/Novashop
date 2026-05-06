import { Fragment } from "react";
import { SectionBadge } from "@/components/SectionBadge";
import type { SupportSectionProps } from "@/interfaces";
import { supportSectionData } from "@/lib/storefront-data";

export function SupportSection({ data = supportSectionData }: SupportSectionProps) {
  return (
    <section className="supportWrapper py-100">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center pb-100">
            <SectionBadge mirrored>{data.eyebrow}</SectionBadge>
            <h2 className="title fs-60 mb-3">{data.title}</h2>
            <p className="fs-18 fw-500">{data.description}</p>
          </div>

          {data.items.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="support-item">
                <div className="support-icon">
                  <i className={item.iconClassName}></i>
                </div>
                <div className="support-content">
                  <h6 className="support-title">
                    <span className="color-blue text-uppercase">{item.number}</span>
                    <span className="text-uppercase">
                      {item.titleLines.map((line, index) => (
                        <Fragment key={`${item.id}-${line}`}>
                          {index > 0 ? <br /> : null}
                          {line}
                        </Fragment>
                      ))}
                    </span>
                  </h6>
                  <p className="support-description">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
