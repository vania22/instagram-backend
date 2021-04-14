import styles from './login.module.scss';

import Link from 'next/link';
import { useRouter } from 'next/router'
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {gql, useMutation} from "@apollo/client";
import * as yup from 'yup';

import {setAccessToken} from "../../utils/accessToken";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {useState} from "react";

type LoginInput = {
    username: string;
    password: string;
}

const schema = yup.object().shape({
    username: yup.string().required('Username must not be empty'),
    password: yup.string().trim().min(6, 'Password must be at least 6 characters long').required('Password must not be empty'),
});

const LoginPage = () => {
    const router = useRouter()
    const [error, setError] = useState<string>('')
    const {register, formState: {errors}, reset: resetForm,  handleSubmit } = useForm<LoginInput>({
        resolver: yupResolver(schema)
    });

    const [login] = useMutation(LOGIN_MUTATION, {
        onCompleted:(data) => {
        setAccessToken(data.login.accessToken);
        resetForm();
        router.push('/')},
        onError: (error) => {
            setError(error.message)
            resetForm();
        }
    });

    const onSubmit = (data: LoginInput) => login({variables: data})

    return (
        <main className={styles.centered_container}>
            <div className={styles.login_screen_container}>
                <div className={styles.left_side}>
                    <img src='/images/login-page/phone_screen_1.jpg' alt="phone-screen" className={styles.inner_phone_image}/>
                </div>
                <div className={styles.right_side}>
                    <div className={styles.login_box}>
                        <img src='/logos/instagram_logo.svg' alt='logo'/>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                register={register}
                                name="username"
                                placeholder="Username"
                                error={errors?.username?.message}
                            />
                            <br/>
                            <Input
                                register={register}
                                name="password"
                                placeholder="Password"
                                type="password"
                                error={errors?.password?.message}
                            />
                            <Button className={styles.login_button} onClick={() => {}} type="submit">Log In</Button>
                        </form>
                        {error && <small className={styles.error}>{error}</small>}
                        <small className={styles.forgot_password}><Link href='/forgot-password'>Forgot Password?</Link></small>
                    </div>
                    <div className={styles.secondary_box}>
                        <p>Don't have an account? <Link href='/register'>Sign Up</Link></p>
                    </div>
                    <div className={styles.appstore_box}>
                        <p>Get the app.</p>
                        <div>
                            <img src='/images/login-page/app_store.png' alt='app store'/>
                            <img src='/images/login-page/play_market.png' alt='play market'/>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

const LOGIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password){
            accessToken
            user{
                username
                email
            }
        }
    }
`;

export default LoginPage;
