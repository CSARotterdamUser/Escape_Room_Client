import {AuthLoginResponse, AuthWhoAmIResponse, UserLoggedIn} from "./ApiModels";
import {isString} from "./Helper";
import {authWhoAmIRequest} from "./Requests";


export function saveAuth(
    authLoginResponse: AuthLoginResponse
) {
    localStorage.setItem("userId", authLoginResponse.user.id.toString())
    localStorage.setItem("token", authLoginResponse.res.outcome)
}


function isAuth(): boolean {
    const userId: string | null = localStorage.getItem("userId")
    const token: string | null = localStorage.getItem("token")
    return userId !== null && token !== null
}

export async function checkAuthIsValid(): Promise<UserLoggedIn> {
    console.log("Checking auth")
    if (!isAuth()) {
        return {
            loggedIn: false,
            role: null
        }
    }
    const token: string | null = localStorage.getItem("token")

    if (token !== null) {
        const res: AuthWhoAmIResponse | string = await authWhoAmIRequest(token)
        const validAuth: boolean = !isString(res)
        if (!validAuth) {
            clearAuth()
        }
        const role = !isString(res) ? (res.successful ? res.outcome.role : null) : null
        console.log(role)
        return {
            loggedIn: validAuth,
            role: role
        }
    } else {
        return {
            loggedIn: false,
            role: null
        }
    }
}

export function clearAuth() {
    localStorage.removeItem("userId")
    localStorage.removeItem("token")
}