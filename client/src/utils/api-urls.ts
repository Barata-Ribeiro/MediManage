const BACKEND_URL = process.env.BACKEND_ORIGIN ?? "http://localhost:8080"

// Auth
export const AUTH_REGISTER = () => `${BACKEND_URL}/api/v1/auth/register`
export const AUTH_REGISTER_BY_ASSISTANT = () => `${BACKEND_URL}/api/v1/auth/register-by-assistant`
export const AUTH_REGISTER_NEW_EMPLOYEE = () => `${BACKEND_URL}/api/v1/auth/register-new-employee`
export const AUTH_LOGIN = () => `${BACKEND_URL}/api/v1/auth/login`

// User
export const USER_GET_CONTEXT = () => `${BACKEND_URL}/api/v1/users/me/context`
