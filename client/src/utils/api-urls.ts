export const BACKEND_URL = process.env.BACKEND_ORIGIN ?? "http://localhost:8080"

// Auth
export const AUTH_REGISTER = () => `${BACKEND_URL}/api/v1/auth/register`
export const AUTH_REGISTER_BY_ASSISTANT = () => `${BACKEND_URL}/api/v1/auth/register-by-assistant`
export const AUTH_REGISTER_NEW_EMPLOYEE = () => `${BACKEND_URL}/api/v1/auth/register-new-employee`
export const AUTH_LOGIN = () => `${BACKEND_URL}/api/v1/auth/login`

// Home
export const HOME_GET_ADMIN_INFO = () => `${BACKEND_URL}/api/v1/home/administrator-info`
export const HOME_GET_PATIENT_INFO = () => `${BACKEND_URL}/api/v1/home/patient-info`
export const HOME_GET_ASSISTANT_INFO = () => `${BACKEND_URL}/api/v1/home/assistant-info`
export const HOME_GET_DOCTOR_INFO = () => `${BACKEND_URL}/api/v1/home/doctor-info`

// User
export const USER_GET_CONTEXT = () => `${BACKEND_URL}/api/v1/users/me/context`
export const USER_UPDATE_ACCOUNT = () => `${BACKEND_URL}/api/v1/users/me`
export const USER_GET_ALL = (
    page: number,
    perPage: number,
    type: string | null,
    direction: string,
    orderBy: string,
) => {
    let url = `${BACKEND_URL}/api/v1/users?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
    if (type) url += `&type=${type}`
    return url
}
export const USER_GET_PROFILE_BY_ID = (id: string) => `${BACKEND_URL}/api/v1/users/${id}`
export const USER_GET_SEARCH_SUGGESTIONS = (query: string, type: string) => {
    let url = `${BACKEND_URL}/api/v1/users/search-suggestions?accountType=${type}`
    if (query) url += `&search=${query}`
    return url
}
export const USER_DELETE_PROFILE_BY_ID = (id: string) => `${BACKEND_URL}/api/v1/users/${id}`
export const USER_UPDATE_PROFILE_BY_ID = (id: string) => `${BACKEND_URL}/api/v1/users/${id}`

// Notifications
export const NOTIFICATIONS_GET_ALL = (
    id: string,
    page: number,
    perPage: number,
    direction: string,
    orderBy: string,
    isRead: string | null,
) => {
    let url = `${BACKEND_URL}/api/v1/notifications/${id}?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
    if (isRead) url += `&isRead=${isRead}`
    return url
}
export const NOTIFICATIONS_GET_LATEST = (id: string) => `${BACKEND_URL}/api/v1/notifications/${id}/latest`
export const NOTIFICATION_GET_BY_ID = (userId: string, notifId: number) =>
    `${BACKEND_URL}/api/v1/notifications/${userId}/${notifId}`
export const NOTIFICATION_CHANGE_STATUS = (userId: string, notifId: string, newStatus: boolean) =>
    `${BACKEND_URL}/api/v1/notifications/${userId}/${notifId}?isRead=${newStatus}`
export const NOTIFICATION_DELETE_BY_ID = (userId: string, notifId: string) =>
    `${BACKEND_URL}/api/v1/notifications/${userId}/${notifId}`

// Consultations
export const CONSULTATIONS_GET_ALL = (
    page: number,
    perPage: number,
    search: string | null,
    direction: string,
    orderBy: string,
) => {
    let url = `${BACKEND_URL}/api/v1/consultations?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
    if (search) url += `&search=${search}`
    return url
}
export const CONSULTATIONS_GET_BY_PATIENT_ID = (
    id: string,
    page: number,
    perPage: number,
    direction: string,
    orderBy: string,
) => {
    return `${BACKEND_URL}/api/v1/consultations/patient/${id}?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
}
export const CONSULTATION_CREATE = () => `${BACKEND_URL}/api/v1/consultations`
export const CONSULTATIONS_UPDATE_BY_ID = (id: string) => `${BACKEND_URL}/api/v1/consultations/${id}`

// Medical Records
export const MEDICAL_RECORDS_GET_ALL = (
    page: number,
    perPage: number,
    search: string | null,
    direction: string,
    orderBy: string,
) => {
    let url = `${BACKEND_URL}/api/v1/records?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
    if (search) url += `&search=${search}`
    return url
}

export const MEDICAL_RECORDS_GET_BY_ID = (id: string) => `${BACKEND_URL}/api/v1/records/${id}`

// Prescription
export const PRESCRIPTIONS_GET_ALL_BY_PATIENT_ID = (
    id: string,
    page: number,
    perPage: number,
    direction: string,
    orderBy: string,
) => {
    return `${BACKEND_URL}/api/v1/prescriptions/patients/${id}?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
}

export const PRESCRIPTION_GET_BY_ID_AND_USERNAME = (id: string, username: string) =>
    `${BACKEND_URL}/api/v1/prescriptions/${id}?username=${username}`

export const PRESCRIPTION_CREATE = (id: string) => `${BACKEND_URL}/api/v1/prescriptions/patients/${id}`
