import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Change to your backend GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client; 

export const ApolloAppProvider = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);
