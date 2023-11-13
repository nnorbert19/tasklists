'use client';

import { CtxProvider } from './Context';

export function Providers({ children }) {
  return <CtxProvider>{children}</CtxProvider>;
}
