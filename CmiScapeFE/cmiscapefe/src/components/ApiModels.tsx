export interface UserLoggedIn {
    loggedIn: boolean
    role: AuthRole | null
}

export interface ServiceResponse<T> {
    outcome: T
    successful: boolean
    message: string
    actionType : ActionType | undefined
    status: number
}

export interface AuthWhoAmIResponse extends ServiceResponse<AuthorizedUser>{

}

export interface AuthorizedUser {
    id: number
    playerID: number
    userName: string
    group: number
    expireTime: number
    role: AuthRole
}

export interface AuthLoginResponse {
    res: ServiceResponse<string>
    user: AuthorizedUser
}

export interface AuthRole {
    role: string
    allowedInfo: Array<string>
    allowedCreate: Array<string>
    allowedRead: Array<string>
    allowedUpdate: Array<string>
    allowedDelete: Array<string>
}

export enum ActionType {
    INFO,
    CREATE,
    READ,
    UPDATE,
    DELETE
}

export interface GroupJoinResponse{
    groupID: number,
    leaderID: number,
    code: string,
    members: Array<AuthorizedUser>
}

export interface ConnectInfo{
    socketID: number,
}

