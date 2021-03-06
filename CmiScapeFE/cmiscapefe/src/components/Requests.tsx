import {API_LOGIN_URL, API_GAME_URL} from './Global'
import {
    AuthLoginResponse,
    AuthorizedUser,
    AuthWhoAmIResponse,
    ConnectInfo,
    GroupJoinResponse,
    ServiceResponse,
} from './ApiModels'

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
): HeadersInit {
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

export async function userReadRequest(
    id: number,
    token: string
): Promise<ServiceResponse<AuthorizedUser> | string> {
    const options = requestGet(
        {
            "Session-Id": token
        }
    );
    return handleRestResponseGet(`${API_LOGIN_URL}/api/user/read?id=${id}`, options);

}

export async function joinGroupRequest(
    code: string,
    userid: number,
    token: string
): Promise<ServiceResponse<GroupJoinResponse> | string> {
    const header = requestGet({
        "Session-Id": token,
        "Content-Type": "Application/Json"
    })
    const options = request('POST',
        {
            Code: code,
            UserID: userid
        }
    );
    return handleRestResponseHeader(`${API_LOGIN_URL}/api/group/update/addUser`, header ,options);
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

export async function removeUserRequest(
    playerID: number,
    groupID: number,
    token: string,
): Promise<ServiceResponse<GroupJoinResponse> | string> {
    const options = requestGet({
            "Session-Id": token,
            "Content-Type": "Application/Json"
        }
    );
    const body = request("POST", {
        "UserID":
            playerID,
        "GroupID":
            groupID
    })
    return handleRestResponseHeader(`${API_LOGIN_URL}/api/group/update/removeUser`, options, body);
}

export async function deleteGroupRequest(
    groupID: number,
    token: string,
): Promise<ServiceResponse<boolean> | string> {
    const options = requestGet({
            "Session-Id": token,
            "Content-Type": "Application/Json"
        }
    );
    const body = request("DELETE", {
         "GroupId":
        groupID
    })
    return handleRestResponseHeader(`${API_LOGIN_URL}/api/group/delete`, options, body);
}

export async function UpdatePOIStateRequest(
    token: string,
    groupID: number,
    playerID: number,
    FunctionID: string
): Promise<ServiceResponse<string> | string> {
    const options = requestGet({
            "Session-Id": token,
            "Player-Id": playerID.toString(),
            "Group-Id": groupID.toString(),

        }
    );

    return handleRestResponseGet(`${API_GAME_URL}/api/poi/${FunctionID}`, options)
}

export async function UpdatePOIInUseRequest(
    token: string,
    groupID: number,
    playerID: number,
    POIName: string,
): Promise<ServiceResponse<string> | string> {
    const options = requestGet({
            "Session-Id": token,
            "Player-Id": playerID.toString(),
            "Group-Id": groupID.toString(),
            "POI-Name": POIName,
        }
    );

    return handleRestResponseGet(`${API_GAME_URL}/api/poi/updatepoiinuse`, options)
}

export async function socketDisconnectRequest(
    playerID: number
): Promise<ServiceResponse<boolean> | string> {
    const options = requestGet({
            "Player-Id": playerID.toString(),
        }
    );
    return handleRestResponseGet(`${API_GAME_URL}/api/socket/disconnect`, options)
}

export async function UpdateItemStateRequest(
    token: string,
    groupID: number,
    playerID: number,
    FunctionID: string,
    RoomID: number,
    pickup: boolean
): Promise<ServiceResponse<string> | string> {
    const options = requestGet({
            "Session-Id": token,
            "Player-Id": playerID.toString(),
            "Group-Id": groupID.toString(),
            "Room-Id" : RoomID.toString(),
            "pickup" : pickup
        }
    );
    return handleRestResponseGet(`${API_GAME_URL}/api/item/${FunctionID}`, options)
}

export async function UpdateTraversableStateRequest(
    token: string,
    groupID: number,
    playerID: number,
    FunctionID: string
): Promise<ServiceResponse<string> | string> {
    const options = requestGet({
            "Session-Id": token,
            "Player-Id": playerID.toString(),
            "Group-Id": groupID.toString(),
        }
    );
    return handleRestResponseGet(`${API_GAME_URL}/api/door/${FunctionID}`, options)
}

export async function PuzzleAnswerRequest(
    token: string,
    groupID: number,
    playerID: number,
    FunctionID: string,
    answer: string,
): Promise<ServiceResponse<string> | string> {
    const options = requestGet({
            "Session-Id": token,
            "Player-Id": playerID.toString(),
            "Group-Id": groupID.toString(),
            "input": answer
        }
    );
    return handleRestResponseGet(`${API_GAME_URL}/api/poi/${FunctionID}`, options)
}



export async function openWebSocketRequest(
    token: string,
    groupID: number
): Promise<ServiceResponse<ConnectInfo> | string> {
    const options = requestGet(
        {
            "Session-Id": token,
            "Group-Id": groupID.toString(),
            // "Access-Control-Allow-Origin" : "*"
        });
    return handleRestResponseGet(`${API_GAME_URL}/api/socket/create`, options)
}

export async function startGameRequest(
    token: string
): Promise<ServiceResponse<ConnectInfo> | string> {
    const options = requestGet(
        {
            "Session-Id": token
        });
    return handleRestResponseGet(`${API_GAME_URL}/api/socket/start`, options)
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
            return "The backend returned an error, please contact an admin" + response.status.toString()
        }
    } catch (e) {
        return "ERR: " + e.message
    }
}
