import { describe, expect, it } from 'vitest';
import { calculateReadingTime } from '../lib/sanity/reading-time';
import { normalizeBlogTable } from '../lib/sanity/table';

describe('blog reading time', () => {
  it('calculates a minimum one-minute reading time from Portable Text spans', () => {
    const body = [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Solar engineering turns careful planning into reliable energy.' }],
      },
    ];

    expect(calculateReadingTime(body)).toBe(1);
  });

  it('uses a 200 word-per-minute estimate', () => {
    expect(calculateReadingTime(Array.from({ length: 201 }, () => 'word').join(' '))).toBe(2);
  });
});

describe('blog table normalization', () => {
  it('preserves a three-column by three-row table', () => {
    const table = normalizeBlogTable({
      _type: 'table',
      headers: ['System', 'Capacity', 'Application'],
      rows: [
        { cells: ['On-grid', '10 kW', 'Commercial'] },
        { cells: ['Hybrid', '15 kW', 'Industrial'] },
        { cells: ['Off-grid', '5 kW', 'Remote site'] },
      ],
    });

    expect(table.headers).toHaveLength(3);
    expect(table.rows).toHaveLength(3);
    expect(table.rows.every((row) => row.length === 3)).toBe(true);
  });

  it('pads short rows and labels columns introduced by long rows', () => {
    const table = normalizeBlogTable({
      _type: 'table',
      headers: ['One'],
      rows: [{ cells: ['A', 'B'] }, { cells: [] }],
    });

    expect(table.headers).toEqual(['One', 'Column 2']);
    expect(table.rows).toEqual([
      ['A', 'B'],
      ['', ''],
    ]);
  });
});

