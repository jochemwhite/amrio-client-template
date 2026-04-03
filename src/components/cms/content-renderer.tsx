import type {
  CmsCollectionEntry,
  CmsContentField,
  CmsContentSection,
  CmsFullPageData,
  CmsPageSummary,
} from "@/types/cms";

function formatFieldContent(content: unknown) {
  if (content == null) {
    return "No content";
  }

  if (typeof content === "string") {
    return content;
  }

  return JSON.stringify(content, null, 2);
}

function sortByOrder<T extends { order: number | null }>(items: T[]) {
  return [...items].sort((left, right) => {
    if (left.order === null && right.order === null) {
      return 0;
    }

    if (left.order === null) {
      return 1;
    }

    if (right.order === null) {
      return -1;
    }

    return left.order - right.order;
  });
}

function FieldCard({ field }: { field: CmsContentField }) {
  return (
    <article className="starter-field">
      <dl className="starter-kv">
        <dt>Field key</dt>
        <dd>{field.field_key ?? "Unmapped field"}</dd>
        <dt>Type</dt>
        <dd>{field.type}</dd>
        <dt>Order</dt>
        <dd>{field.order ?? "Not set"}</dd>
        <dt>Content</dt>
        <dd>
          <pre>{formatFieldContent(field.content)}</pre>
        </dd>
      </dl>
    </article>
  );
}

function SectionBlock({ section }: { section: CmsContentSection }) {
  const fields = sortByOrder(section.fields);

  return (
    <section className="starter-section">
      <div className="starter-stack">
        <div>
          <p className="starter-eyebrow">Section</p>
          <h2 className="text-2xl font-semibold">{section.name}</h2>
          <p className="starter-subtle">
            Order: {section.order ?? "Not set"} | Fields: {fields.length}
          </p>
        </div>
        <div className="starter-list">
          {fields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CmsPageView({ page }: { page: CmsFullPageData }) {
  const sections = sortByOrder(page.sections);

  return (
    <div className="starter-shell">
      <div className="starter-stack">
        <header className="starter-card">
          <p className="starter-eyebrow">CMS Page</p>
          <h1 className="starter-title">{page.page.name}</h1>
          <div className="starter-grid">
            <dl className="starter-kv">
              <dt>Slug</dt>
              <dd>{page.page.slug}</dd>
            </dl>
            <dl className="starter-kv">
              <dt>Status</dt>
              <dd>{page.page.status}</dd>
            </dl>
            <dl className="starter-kv">
              <dt>Layout overrides</dt>
              <dd>{page.layout.overrides.length}</dd>
            </dl>
          </div>
        </header>

        <section className="starter-card">
          <div className="starter-stack">
            <div>
              <p className="starter-eyebrow">Sections</p>
              <p className="starter-subtle">
                Minimal server-rendered output to verify CMS integration without
                coupling this starter to a visual component system.
              </p>
            </div>
            {sections.length === 0 ? (
              <p className="starter-subtle">This page currently has no sections.</p>
            ) : (
              sections.map((section) => (
                <SectionBlock key={section.id} section={section} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export function CmsCollectionEntryView({
  entry,
  sections,
}: {
  entry: CmsCollectionEntry;
  sections: CmsContentSection[];
}) {
  const orderedSections = sortByOrder(sections);

  return (
    <div className="starter-shell">
      <div className="starter-stack">
        <header className="starter-card">
          <p className="starter-eyebrow">Collection Entry</p>
          <h1 className="starter-title">{entry.name ?? entry.slug ?? entry.id}</h1>
          <div className="starter-grid">
            <dl className="starter-kv">
              <dt>Entry slug</dt>
              <dd>{entry.slug ?? "No slug"}</dd>
            </dl>
            <dl className="starter-kv">
              <dt>Collection ID</dt>
              <dd>{entry.collection_id}</dd>
            </dl>
            <dl className="starter-kv">
              <dt>Created at</dt>
              <dd>{entry.created_at}</dd>
            </dl>
          </div>
        </header>

        <section className="starter-card">
          <div className="starter-stack">
            <div>
              <p className="starter-eyebrow">Sections</p>
              <p className="starter-subtle">
                Reusable rendering placeholder for CMS collection data.
              </p>
            </div>
            {orderedSections.length === 0 ? (
              <p className="starter-subtle">
                This collection entry currently has no sections.
              </p>
            ) : (
              orderedSections.map((section) => (
                <SectionBlock key={section.id} section={section} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export function CmsRouteIntro({ pages = [] }: { pages?: CmsPageSummary[] }) {
  return (
    <div className="starter-shell">
      <div className="starter-stack">
        <section className="starter-card">
          <p className="starter-eyebrow">Next.js CMS Starter</p>
          <h1 className="starter-title">Reusable App Router foundation for CMS-driven sites</h1>
          <p className="starter-subtle">
            This template keeps the UI intentionally light and focuses on env
            setup, typed CMS services, server-first routing, and reusable data
            access patterns.
          </p>
        </section>

        <section className="starter-card">
          <div className="starter-stack">
            <div>
              <p className="starter-eyebrow">Configured routes</p>
              <p className="starter-subtle">
                CMS pages resolve through <span className="starter-code">/[...slug]</span>,
                while collection entries stay separate under{" "}
                <span className="starter-code">
                  /collections/[prefixSlug]/[entrySlug]
                </span>
                .
              </p>
            </div>
            <div className="starter-grid">
              <article className="starter-field">
                <strong>Pages</strong>
                <p className="starter-subtle">Examples: /about, /services</p>
              </article>
              <article className="starter-field">
                <strong>Collection entries</strong>
                <p className="starter-subtle">
                  Example: /collections/events/teslan-2025
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="starter-card">
          <div className="starter-stack">
            <div>
              <p className="starter-eyebrow">CMS service starter</p>
              <p className="starter-subtle">
                Add new endpoint helpers in{" "}
                <span className="starter-code">src/lib/cms.ts</span> and update{" "}
                <span className="starter-code">src/types/cms.ts</span> as your API
                evolves.
              </p>
            </div>
            {pages.length > 0 ? (
              <div className="starter-list">
                {pages.map((page) => (
                  <article key={page.id} className="starter-field">
                    <p className="font-semibold">{page.name}</p>
                    <p className="starter-subtle">
                      /{page.slug} | status: {page.status}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="starter-subtle">
                The homepage stays static so the starter can boot even before a
                local CMS is running. Dynamic CMS routes fetch data server-side
                when you visit them.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
