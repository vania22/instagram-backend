import styles from './input.module.scss';

interface Props {
    register: any;
    value?: string;
    onChange?(value: string): void;
    type?: string;
    name?: string;
    placeholder?: string;
    className?: string;
    error?: boolean | string;
}

const Input = ({value, onChange, name, register, type = 'text', placeholder, className, error}: Props) => {
    return (
        <div className={styles.input_container}>
            {onChange ?
                <input
                    type={type}
                    placeholder={placeholder}
                    autoComplete="false"
                    className={`${styles.input} ${className}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                :
                <input
                    name={name}
                    {...register(name)}
                    type={type}
                    placeholder={placeholder}
                    autoComplete="false"
                    className={`${styles.input} ${className}`}
                />
            }
            {error && <small className={styles.error}>{error}</small>}
        </div>
    )
}


export default Input;
