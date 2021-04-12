import jwtDecode from "jwt-decode";

let accessToken: string;

const setTokenToLocalStorage = (token: string): void => {
    localStorage.setItem("accessToken", token)
}

const getTokenFromLocalStorage = (): string | null => {
    return localStorage.getItem("accessToken");
}

export const setAccessToken = (token: string): void => {
    setTokenToLocalStorage(token);
    accessToken = token;
}

export const getAccessToken = (): string | null => {
    return accessToken ? accessToken : getTokenFromLocalStorage();
};

export const getUserIDfromToken = (token: string = accessToken): string | null => {
    const {userId} = jwtDecode(token) as { userId: string };
    return userId ? userId : null;
}
