import type { BlogTable, BlogTableRow } from './types';

export type NormalizedBlogTable = {
  headers: string[];
  rows: string[][];
};

export function normalizeBlogTable(table: BlogTable): NormalizedBlogTable {
  const sourceHeaders = Array.isArray(table.headers) ? table.headers : [];
  const sourceRows = Array.isArray(table.rows) ? table.rows : [];
  const widestRow = sourceRows.reduce(
    (largest, row) => Math.max(largest, getCells(row).length),
    0
  );
  const columnCount = Math.max(sourceHeaders.length, widestRow);

  const headers = Array.from({ length: columnCount }, (_, index) => {
    const header = sourceHeaders[index];
    return typeof header === 'string' && header.trim()
      ? header
      : `Column ${index + 1}`;
  });

  const rows = sourceRows.map((row) => {
    const cells = getCells(row);
    return Array.from({ length: columnCount }, (_, index) => cells[index] ?? '');
  });

  return { headers, rows };
}

function getCells(row: BlogTableRow): string[] {
  if (!Array.isArray(row?.cells)) return [];
  return row.cells.map((cell) => (typeof cell === 'string' ? cell : ''));
}

