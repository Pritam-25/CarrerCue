export const ApiRoute = {
    ONBOARDING: "/onboarding",
    DASHBOARD: "/dashboard",
    RESUME:"/resume",
    INTERVIEW:"/interview",
    AI_COVER_LETTER:"/ai-cover/letter"
} as const

export type API_ROUTES = typeof ApiRoute[keyof typeof ApiRoute]

