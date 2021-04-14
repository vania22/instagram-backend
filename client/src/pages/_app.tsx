import type { AppProps } from 'next/app'
import '../styles/global.scss';
import {ApolloProvider} from "@apollo/client";
import {useApollo} from "../lib/apolloClient";
import AppWrapper from "../AppWrapper";

function MyApp({ Component, pageProps }: AppProps) {
    const apolloClient = useApollo(pageProps);
    return (
        <ApolloProvider client={apolloClient}>
            <AppWrapper>
                <Component {...pageProps} />
            </AppWrapper>
        </ApolloProvider>
    )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp
