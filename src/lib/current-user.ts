import { prisma } from "@/db/prisma";
import { getAuthCookie, verifyAuthToken } from "./auth";

type AuthPayload = {
    userId: string;
};

export async function getCurrentUser() {
    try {
        const token = await getAuthCookie();
        if (!token) {
            return null;
        }

        const payload = (await verifyAuthToken<AuthPayload>(token)) as AuthPayload;
        if (!payload || !payload.userId) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
}
