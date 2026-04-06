export default function NotFound() {
  return (
    <div className="mx-auto w-[min(960px,calc(100%-1rem))] py-6 md:w-[min(960px,calc(100%-2rem))] md:py-12">
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <p className="inline-block text-xs leading-none font-medium tracking-[0.08em] text-slate-500 uppercase">
          Not Found
        </p>
        <h1 className="text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-semibold tracking-tight">
          CMS content was not found
        </h1>
        <p className="text-slate-600">
          Check the slug, confirm the CMS record exists, and verify the current
          website ID is pointing at the right site.
        </p>
      </div>
    </div>
  );
}
