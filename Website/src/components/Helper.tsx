export function isString(arg: any): arg is string {
    return typeof arg === 'string'
}

export function toNumberOrUndefined(value: number) {
    return isNaN(value) ? undefined : value
}

export function toNumberOrNull(value: number) {
    return toNumberOrUndefined(value) === undefined ? null : value
}

export function toNumber(value: number) {
    const v = toNumberOrUndefined(value)
    return v === undefined ? 0 : v
}

export function toUndefinedIfNull(value: any) {
    return value === null ? undefined : value
}