import { describe, expect, it } from 'vitest';
import { calculateReadingTime } from '../lib/sanity/reading-time';
import { normalizeBlogTable } from '../lib/sanity/table';
import { partitionBlogBody } from '../lib/sanity/partition-body';

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

describe('blog body partitioning for Solar Analyzer CTA', () => {
  it('omits inline CTA for short articles (< 5 blocks)', () => {
    const shortBody = [
      { _type: 'block', style: 'normal', children: [{ text: 'Intro' }] },
      { _type: 'block', style: 'normal', children: [{ text: 'Point 1' }] },
      { _type: 'block', style: 'normal', children: [{ text: 'Point 2' }] },
      { _type: 'block', style: 'normal', children: [{ text: 'Conclusion' }] },
    ];

    const result = partitionBlogBody(shortBody);
    expect(result.showInlineCTA).toBe(false);
    expect(result.firstChunk).toHaveLength(4);
    expect(result.secondChunk).toHaveLength(0);
  });

  it('partitions normal articles (>= 5 blocks) at ~35% boundary', () => {
    const body = Array.from({ length: 10 }, (_, i) => ({
      _type: 'block',
      style: i === 5 ? 'h2' : 'normal',
      children: [{ text: `Block ${i}` }],
    }));

    const result = partitionBlogBody(body);
    expect(result.showInlineCTA).toBe(true);
    expect(result.firstChunk.length + result.secondChunk.length).toBe(10);
    expect(result.firstChunk.length).toBeGreaterThanOrEqual(2);
    expect(result.firstChunk.length).toBeLessThanOrEqual(5);
  });

  it('never splits inside a list sequence', () => {
    const body = [
      { _type: 'block', style: 'normal', children: [{ text: 'Intro' }] },
      { _type: 'block', style: 'normal', children: [{ text: 'Paragraph 1' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', children: [{ text: 'List 1' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', children: [{ text: 'List 2' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', children: [{ text: 'List 3' }] },
      { _type: 'block', style: 'normal', children: [{ text: 'Paragraph 2' }] },
      { _type: 'block', style: 'normal', children: [{ text: 'Paragraph 3' }] },
    ];

    const result = partitionBlogBody(body);
    expect(result.showInlineCTA).toBe(true);

    const splitIndex = result.firstChunk.length;
    // Check that splitIndex is not between List 1 and List 2, or List 2 and List 3
    const prevBlock = body[splitIndex - 1];
    const currBlock = body[splitIndex];
    const isInsideList = Boolean(prevBlock?.listItem && currBlock?.listItem);
    expect(isInsideList).toBe(false);
  });
});

