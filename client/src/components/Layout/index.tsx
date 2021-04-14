import Header from "../Header";
import React from "react";
import Head from "next/head";

import styles from './layout.module.scss'

interface Props {
    header: boolean
    title: string;
}

const Layout: React.FC<Props> = ({children, header, title}): React.ReactElement => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            {header && <Header/>}
            <div className={styles.page_outer_container}>
                <div className={styles.page_inner_container}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout;
