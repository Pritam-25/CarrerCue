"use server"
import db from '@/lib/prisma';
import { DemandLevel, MarketOutlook, User } from '@prisma/client';
import { authenticateUser } from "@/lib/authenticateUser"

//*  update user data 
export async function updateUser(data: Partial<User>) {

    // check weather user is authenticated or not
    const user = await authenticateUser();

    try {
        const result = await db.$transaction(
            async (tx) => {
                // fine if the industry exist
                let industryInsight = await tx.industryInsight.findUnique({
                    where: {
                        industry: data.industry!
                    }
                })

                // if industry does't exist, create it with default values -will replace with ai later
                // update the user

                if (!industryInsight) {
                    industryInsight = await tx.industryInsight.create({
                        data: {
                            industry: data.industry!,
                            salaryRange: [],
                            growthRate: 0,
                            demandLevel: DemandLevel.MEDIUM,
                            topSkills: [],
                            marketOutlook: MarketOutlook.NEUTRAL,
                            keyTrends: [],
                            recommendedSkills: [],
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 1 week
                            lastUpdated: new Date()
                        }
                    })
                }


                // update the user
                const updatedUser = await tx.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        industry: data.industry ?? undefined,  // Keeps existing industry if not provided
                        experience: data.experience ?? undefined,
                        bio: data.bio ?? undefined,
                        skills: data.skills ?? undefined
                    }
                })

                // return 
                return { updatedUser, industryInsight }
            },
            { timeout: 10000 }  // default: 5000
        )

        return { success: true, ...result }

    } catch (error) {
        console.error("Error updating user and industry: ", (error as Error).message);
        throw new Error("Failed to update profile")
    }

}

//* getUserOnboardingStatus 
export async function getUserOnboardingStatus() {
    // Check if the user is authenticated
    const user = await authenticateUser();

    try {
        return { isOnboard: !!user.industry };
    } catch (error) {
        console.error("Error checking onboarding status: ", (error as Error).message);
        throw new Error("Failed to check onboarding status");
    }
}