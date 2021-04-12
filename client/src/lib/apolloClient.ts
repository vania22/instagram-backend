import {useMemo} from 'react'
import {ApolloClient, from, HttpLink, InMemoryCache} from '@apollo/client'
import {TokenRefreshLink} from "apollo-link-token-refresh";
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import jwtDecode from "jwt-decode";
import {getAccessToken, setAccessToken} from "../utils/accessToken";

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: any;

const httpLink = new HttpLink({
    uri: 'http://localhost:5000/graphql',
    credentials: 'include',
    headers: {
        Authentication: `Bearer ${getAccessToken()}`,
    },
});

const tokenRefreshLink = new TokenRefreshLink({
    accessTokenField: 'accessToken',
    fetchAccessToken: () => {
        return fetch('http://localhost:5000/refresh_token', {method: 'POST', credentials: 'include'})
    },
    handleFetch: (token) => {
        setAccessToken(token)
    },
    handleError: () => {
      setAccessToken('')
    },
    isTokenValidOrUndefined: (): boolean => {
        const token = getAccessToken();
        if(!token) return true

        try {
            const {exp}: any = jwtDecode(token)
            return Date.now() < exp;
        }catch (e) {
            return false
        }
    }
})

function createApolloClient() {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: from([
            tokenRefreshLink,
            httpLink,
        ]),
        cache: new InMemoryCache(),
    })
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient()

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState!, existingCache, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray: [], sourceArray: []) => [
                ...sourceArray,
                ...destinationArray.filter((d) =>
                    sourceArray.every((s) => !isEqual(d, s)),
                ),
            ],
        })

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export function addApolloState(client: any, pageProps: any) {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
    }

    return pageProps
}

export function useApollo(pageProps: any) {
    const state = pageProps[APOLLO_STATE_PROP_NAME]
    const store = useMemo(() => initializeApollo(state), [state])
    return store
}
