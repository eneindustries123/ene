import { normalizeBlogTable } from '@/lib/sanity/table';
import type { BlogTable as BlogTableValue } from '@/lib/sanity/types';

export function BlogTable({ value }: { value: BlogTableValue }) {
  const { headers, rows } = normalizeBlogTable(value);

  if (!headers.length) return null;

  return (
    <div className="my-8 max-w-full overflow-x-auto rounded-2xl border border-solix-border bg-white shadow-sm">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead className="bg-solix-dark text-white">
          <tr>
            {headers.map((header, index) => (
              <th
                key={`${header}-${index}`}
                scope="col"
                className="px-5 py-4 text-xs font-bold uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-solix-border">
          {rows.map((row, rowIndex) => (
            <tr key={value.rows?.[rowIndex]?._key || `row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="px-5 py-4 align-top leading-relaxed text-solix-text"
                >
                  {cell || <span className="sr-only">Empty cell</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

