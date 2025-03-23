import { auth } from "@clerk/nextjs/server";
import db from "./prisma";


export const authenticateUser = async () => {
    const { userId } = await auth()

    if (!userId) throw new Error("Unauthenticated");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) throw new Error("User not found")

    return user // Return the user object for further use
}