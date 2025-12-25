import axios from "axios";

const AIRSTACK_API_URL = "https://api.airstack.xyz/gql";

export async function getVerifiedBuyers(fid: number) {
    const query = `
    query GetFollowersWithOnchainActivity($fid: String!) {
      SocialFollowers(
        input: {filter: {identity: {_eq: $fid}, dappName: {_eq: farcaster}}, blockchain: ethereum}
      ) {
        Follower {
          followerAddress {
            addresses
            socials(input: {filter: {dappName: {_eq: farcaster}}}) {
              profileName
              userId
            }
            tokenBalances(
              input: {filter: {blockchain: {_eq: base}, tokenAddress: {_neq: "0x0000000000000000000000000000000000000000"}}}
            ) {
              token {
                name
                symbol
              }
              amount
            }
          }
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            AIRSTACK_API_URL,
            {
                query,
                variables: { fid: `fc_fid:${fid}` },
            },
            {
                headers: {
                    Authorization: process.env.AIRSTACK_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.data.SocialFollowers.Follower;
    } catch (error) {
        console.error("Error fetching buyers from Airstack:", error);
        return [];
    }
}
