import * as React from 'react';
import {useRouter} from "next/router";
import {getAccessToken} from "../utils/accessToken";
import Layout from "../components/Layout";
import {gql, useQuery} from "@apollo/client";

const Home = () => {
    const router = useRouter()
    const {loading, data} = useQuery(GET_POSTS, {
        onError: error => console.log(error),
        onCompleted: data => console.log(data)
    });

    React.useEffect(() => {
        if (!getAccessToken()) {
            router.push('/login')
        }
    }, [])

    return (
        <Layout header title="Instagram">
            <h1 style={{height: 2000}}>Hello Next.js 👋</h1>
            {loading ? <h1>Loading</h1> : data ? <h1>{JSON.stringify(data)}</h1> : null}
        </Layout>
    );
}

export default Home;

const GET_POSTS = gql`
    query getFeaturedPosts {
        getFeaturedPosts{
            description
        }
    }
`;

