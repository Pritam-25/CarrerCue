export interface UserData {
    id: string;
    clerkUserId: string;
    email: string;
    imageUrl?: string;
    industry?: string;
    createdAt: Date;
    updatedAt: Date;
    bio?: string;
    experience?: number;
    skill: string[];
  }
  