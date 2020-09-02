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
    if (!isAuth()) {
        return {
            loggedIn: false,
        }
    }
    const token: string | null = localStorage.getItem("token")

    if (token !== null) {
        const res: AuthWhoAmIResponse | string = await authWhoAmIRequest(token)
        console.log(isString(res))
        if (isString(res)) {
            clearAuth()
        }else{
            console.log(res)
            if(!res.successful){
                clearAuth()
            }
        }
        return {
            loggedIn: !isString(res),
        }
    } else {
        return {
            loggedIn: false,
        }
    }
}

export function clearAuth() {
    localStorage.removeItem("userId")
    localStorage.removeItem("token")
}