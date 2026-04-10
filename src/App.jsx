import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ApolloAppProvider } from './lib/apolloClient';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ApolloAppProvider>
          <Routes />
        </ApolloAppProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;