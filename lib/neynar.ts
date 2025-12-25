import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY || "");

export async function getFollowers(fid: number) {
    try {
        const response = await client.fetchUserFollowers(fid);
        return response.users;
    } catch (error) {
        console.error("Error fetching followers from Neynar:", error);
        return [];
    }
}

export async function getRecentActivity(fid: number) {
    try {
        // Fetch relative activity/casts for followers
        const response = await client.fetchAllCastsByUser(fid);
        return response.casts;
    } catch (error) {
        console.error("Error fetching activity from Neynar:", error);
        return [];
    }
}

export async function getActiveCommenters(fid: number) {
    try {
        // This is a simplified version; real logic would involve scanning notifications or popular casts
        const response = await client.fetchMentionAndReplyNotifications(fid);
        return response.notifications;
    } catch (error) {
        console.error("Error fetching comments from Neynar:", error);
        return [];
    }
}
