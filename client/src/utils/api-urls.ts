const BACKEND_URL = process.env.BACKEND_ORIGIN ?? "http://localhost:8080"

// Auth
export const AUTH_REGISTER = () => `${BACKEND_URL}/api/v1/auth/register`
export const AUTH_REGISTER_BY_ASSISTANT = () => `${BACKEND_URL}/api/v1/auth/register-by-assistant`
export const AUTH_REGISTER_NEW_EMPLOYEE = () => `${BACKEND_URL}/api/v1/auth/register-new-employee`
export const AUTH_LOGIN = () => `${BACKEND_URL}/api/v1/auth/login`

// User
export const USER_GET_CONTEXT = () => `${BACKEND_URL}/api/v1/users/me/context`
export const USER_UPDATE_ACCOUNT = () => `${BACKEND_URL}/api/v1/users/me`
export const USER_GET_ALL = (
    page = 0,
    perPage = 10,
    type: string | null = null,
    direction = "ASC",
    orderBy = "createdAt",
) => {
    let url = `${BACKEND_URL}/api/v1/users?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`

    if (type) {
        url += `&type=${type}`
    }

    return url
}
