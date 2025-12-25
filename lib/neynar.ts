import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const getClient = () => {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
        // Return a dummy client or handle the error gracefully
        // During build, we might not have the key
        return null;
    }
    return new NeynarAPIClient(apiKey);
};

export async function getFollowers(fid: number) {
    const client = getClient();
    if (!client) return [];

    try {
        const response = await client.fetchUserFollowers(fid);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (response as any).result?.users || [];
    } catch (error) {
        console.error("Error fetching followers from Neynar:", error);
        return [];
    }
}

export async function getRecentActivity(fid: number) {
    const client = getClient();
    if (!client) return [];

    try {
        const response = await client.fetchAllCastsCreatedByUser(fid);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (response as any).result?.casts || [];
    } catch (error) {
        console.error("Error fetching activity from Neynar:", error);
        return [];
    }
}

export async function getActiveCommenters(fid: number) {
    const client = getClient();
    if (!client) return [];

    try {
        const response = await client.fetchMentionAndReplyNotifications(fid);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (response as any).result?.notifications || [];
    } catch (error) {
        console.error("Error fetching comments from Neynar:", error);
        return [];
    }
}
