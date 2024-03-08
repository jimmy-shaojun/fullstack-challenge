import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

export const getApolloClientServerSide = () => {
    const endpoint = process.env['GRAPHQL_BACKEND_URL'];
    if (endpoint === undefined) {
        throw Error('Failed to create ApolloClient. Environement Variable "GRAPHQL_BACKEND_URL" is not set.')
    }
    return new ApolloClient({
        link: createHttpLink({ uri: endpoint} ),
        cache: new InMemoryCache()
    });
};
