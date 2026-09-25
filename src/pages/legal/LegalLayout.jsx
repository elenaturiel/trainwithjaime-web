import PageHero from '../../components/PageHero.jsx'
import { LEGAL } from '../../config.js'

// Plantilla común de las páginas legales: hero corto + texto en columna legible.
export default function LegalLayout({ title, children }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title}>
        Última actualización: {LEGAL.updated}
      </PageHero>
      <section className="bg-ink py-16 md:py-24">
        <article className="legal mx-auto max-w-3xl px-5 text-fg-2 md:px-8">{children}</article>
      </section>
    </>
  )
}

export const H2 = ({ children }) => (
  <h2 className="mb-4 mt-12 font-display text-3xl uppercase leading-[1.05] text-fg first:mt-0 md:text-4xl">
    {children}
  </h2>
)
export const P = ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>
export const UL = ({ children }) => (
  <ul className="mb-4 list-disc space-y-2 pl-5 leading-relaxed marker:text-brand">{children}</ul>
)
export const A = (props) => (
  <a className="font-semibold text-fg underline underline-offset-4 hover:text-accent-ink" {...props} />
)

export function Table({ head, rows }) {
  return (
    <div className="mb-6 overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-panel text-xs uppercase tracking-wider text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3 align-top">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
