// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { Header } from '../components/layout/Header';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('next/link', () => ({ default: ({ prefetch, onClick, children, ...props }: any) => (
  <a {...props} data-prefetch={String(prefetch)} onClick={(event) => {
    onClick?.(event);
    expect(event.defaultPrevented).toBe(false);
    event.preventDefault(); // jsdom cannot perform Next.js navigation.
  }}>{children}</a>
) }));

it('keeps desktop/mobile Projects anchors and closes the mobile drawer on click', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(<Header />));
    const desktop = container.querySelector('a[href="/projects"]')!;
    expect(desktop.getAttribute('data-prefetch')).toBe('false');
    await act(async () => (container.querySelector('[aria-label="Open mobile navigation menu"]') as HTMLElement).click());
    const mobile = container.querySelector('#mobile-navigation-drawer a[href="/projects"]') as HTMLElement;
    expect(mobile.getAttribute('data-prefetch')).toBe('false');
    await act(async () => mobile.click());
    expect(container.querySelector('#mobile-navigation-drawer')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  } finally {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  }
});
