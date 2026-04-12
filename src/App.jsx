import React from 'react';
import Routes from './Routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { ApolloAppProvider } from './lib/apolloClient';

function App() {
  return (
    <LanguageProvider>
      <ApolloAppProvider>
        <Routes />
      </ApolloAppProvider>
    </LanguageProvider>
  );
}

export default App;