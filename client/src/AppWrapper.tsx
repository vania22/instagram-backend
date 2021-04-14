import * as React from "react";
import {setAccessToken} from "./utils/accessToken";

const AppWrapper: React.FC = ({children}) => {
    const [render, setRender] = React.useState(false)

    React.useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const response: any = await fetch('http://localhost:5000/refresh_token', {
                    method: 'POST',
                    credentials: 'include',
                })
                const {accessToken} = await response.json()
                setAccessToken(accessToken);
            } catch (e) {
                setAccessToken('')
            }
        }

        (async () => {
            await fetchAccessToken()
            setRender(true)
        })()
    }, [])

    if(!render) {
        return <div>loading</div>
    }

    return <>{children}</>
}

export default AppWrapper;
