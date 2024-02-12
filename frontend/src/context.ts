import React from 'react';

export interface TokenContextValue {
  token: string | null
  applyToken: (token: string | null) => void
}

const TokenContext = React.createContext<TokenContextValue>({
  token: null,
  applyToken: (_) => {}
});

export default TokenContext;
