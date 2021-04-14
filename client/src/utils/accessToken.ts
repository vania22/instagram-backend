import jwtDecode from "jwt-decode";

let accessToken: string;

export const setAccessToken = (token: string): void => {
    accessToken = token;
}

export const getAccessToken = (): string | null => {
    return accessToken;
};

export const getUserIDfromToken = (token: string = accessToken): string | null => {
    const {userId} = jwtDecode(token) as { userId: string };
    return userId ? userId : null;
}
