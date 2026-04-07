import { ContentFieldsRenderer } from "@/components/content/content-renderer";
import {
  sampleDemoFields,
  sampleEmptyStates,
} from "@/components/content/sample-data";
import { CONTENT_FIELD_TYPES } from "@/types/content";

const shellClass =
  "mx-auto w-[min(960px,calc(100%-1rem))] py-6 md:w-[min(960px,calc(100%-2rem))] md:py-12";
const stackClass = "grid gap-6";
const cardClass =
  "rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-elevated)]";
const eyebrowClass =
  "inline-block text-xs leading-none font-medium tracking-[0.08em] text-subtle uppercase";

export function ContentTemplateDemo() {
  return (
    <div className={shellClass}>
      <div className={stackClass}>
        <header className={cardClass}>
          <p className={eyebrowClass}>Content Components Demo</p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-semibold tracking-tight">
            Cloneable CMS field renderer starter
          </h1>
          <p className="mt-3 text-muted">
            The defaults are intentionally quiet. Clone this repo, change the
            tokens and component classes, then keep the rendering structure.
          </p>
        </header>

        <section className={cardClass}>
          <div className={stackClass}>
            <div>
              <p className={eyebrowClass}>Supported field types</p>
              <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                {CONTENT_FIELD_TYPES.map((type) => (
                  <article
                    key={type}
                    className="rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <strong>{type}</strong>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <div className={stackClass}>
            <div>
              <p className={eyebrowClass}>Example renderer</p>
              <p className="mt-2 text-muted">
                This loops over representative sample content and renders every
                registered field component, including recursive sections and an
                unsupported-type fallback.
              </p>
            </div>
            <ContentFieldsRenderer fields={sampleDemoFields} />
          </div>
        </section>

        <section className={cardClass}>
          <div className={stackClass}>
            <div>
              <p className={eyebrowClass}>Empty states</p>
              <p className="mt-2 text-muted">
                Each component exposes minimal fallback UI so content gaps stay
                obvious during integration.
              </p>
            </div>
            <ContentFieldsRenderer fields={sampleEmptyStates} />
          </div>
        </section>
      </div>
    </div>
  );
}
