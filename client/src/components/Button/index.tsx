import styles from './button.module.scss';
import {DetailedHTMLProps, ReactNode} from "react";

interface Props {
    onClick(): void
    className?: string
    children: ReactNode,
    type: DetailedHTMLProps<any, any>;
}

const Button = ({children, onClick, type = "button", className}: Props) => {
    return <button onClick={onClick} className={`${styles.button} ${className}`} type={type}>{children}</button>
}

export default Button;
