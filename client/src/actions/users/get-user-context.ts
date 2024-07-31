"use server"

import { User } from "@/interfaces/users"

export default async function getUserContext() {
    return {
        ok: true,
        response: {
            data: {
                id: "1",
                username: "testuser",
                email: "testuser@example.com",
                fullName: "Test User",
                phone: "123-456-7890",
                address: "123 Test St, Test City, TX",
                birthDate: "1990-01-01",
                registrationNumber: "123456",
                registrationOrigin: "Test Origin",
                specialization: "Test Specialization",
                accountType: "PATIENT",
                userRoles: "USER",
                createdAt: "2023-01-01T00:00:00Z",
                updatedAt: "2023-01-01T00:00:00Z",
            } as User,
        },
    }
}
