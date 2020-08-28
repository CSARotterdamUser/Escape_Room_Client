import {API_LOGIN_URL} from './Global'
import {AuthLoginResponse, AuthWhoAmIResponse, GroupJoinResponse, ServiceResponse,} from './ApiModels'

function request(
    requestType: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body: {}
) {
    return {
        method: requestType,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    }
}

function requestGet(
    headers: {}
):HeadersInit {
    return new Headers(headers)
}

export async function authWhoAmIRequest(
    token: string
): Promise<AuthWhoAmIResponse | string> {
    const options = requestGet({
            "Session-Id": token
        }
    )
    return handleRestResponseGet(`${API_LOGIN_URL}/api/auth/whoami`, options)
}

export async function authLoginRequest(
    mail: string,
    password: string
): Promise<AuthLoginResponse | string> {
    const options = request('POST',
        {
            email: mail,
            password: password
        }
    );
    return handleRestResponse(`${API_LOGIN_URL}/api/auth/login`, options)
}

export async function authRegisterRequest(
    mail: string,
    username: string,
    password: string
): Promise<boolean | string> {
    const options = request('POST',
        {
            email: mail,
            username: username,
            password: password
        }
    );
    return handleRestResponse(`${API_LOGIN_URL}/api/user/register`, options)
}

export async function joinGroupRequest(
    code: string,
    userid: number
): Promise<ServiceResponse<GroupJoinResponse> | string> {
    const options = request('POST',
        {
            Code: code,
            UserID: userid
        }
    );
    return handleRestResponse(`${API_LOGIN_URL}/api/group/update/addUser`, options);
}

export async function readGroupRequest(
    groupID: number,
    token: string
): Promise<ServiceResponse<GroupJoinResponse> | string> {
    const options = requestGet(
        {
            "Session-Id": token
        }
    );
    return handleRestResponseGet(`${API_LOGIN_URL}/api/group/read?id=${groupID}`, options);
}

export async function createGroupRequest(
    token: string
): Promise<ServiceResponse<GroupJoinResponse> | string> {
    const options = requestGet({
            "Session-Id": token
        }

    );
    const body = request("POST", {})
    return handleRestResponseHeader(`${API_LOGIN_URL}/api/group/create`, options, body);
}


async function handleRestResponseGet<T>(
    url: string,
    options: HeadersInit
): Promise<ServiceResponse<T> | string> {
    try {
        const requestHeaders: HeadersInit = new Headers(options);
        const response = await fetch(url, {method: 'GET', body: undefined, headers: requestHeaders})
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response.json()) as Promise<ServiceResponse<T>>
        } else {
            const message: string = "The backend returned an error, please contact an admin"

            return message
        }
    } catch (e) {
        return "ERR: " + e.message
    }
}


async function handleRestResponse<T>(
    url: string,
    options: RequestInit
): Promise<T | string> {
    try {
        const response = await fetch(url, options)
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response.json()) as Promise<T>
        } else {
            return "The backend returned an error, please contact an admin"
        }
    } catch (e) {
        return "ERR: " + e.message
    }
}

async function handleRestResponseHeader<T>(
    url: string,
    header: HeadersInit,
    options: RequestInit
): Promise<T | string> {
    try {
        const requestHeaders: HeadersInit = new Headers(header);
        const response = await fetch(url, {method: options.method, headers: requestHeaders, body: options.body})
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response.json()) as Promise<T>
        } else {
            return "The backend returned an error, please contact an admin"
        }
    } catch (e) {
        return "ERR: " + e.message
    }
}
