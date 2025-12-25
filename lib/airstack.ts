import axios from "axios";

const AIRSTACK_API_URL = "https://api.airstack.xyz/gql";

/**
 * Fetches "Post Buyers" logic based on Wow.xyz / Social Trade activity on Base.
 * Specifically looks for users who have bought tokens associated with the given FIDs.
 */
export async function getPostActivity(fids: number[]) {
  const query = `
    query GetPostActivity($fids: [String!]) {
      Socials(input: {filter: {userId: {_in: $fids}, dappName: {_eq: farcaster}}, blockchain: ethereum}) {
        Social {
          userId
          userAddress
          profileName
          tokenTransfers(input: {filter: {blockchain: {_eq: base}}, limit: 10}) {
            token {
              name
              symbol
              address
            }
            from {
              addresses
            }
            to {
              addresses
            }
            amount
            formattedAmount
            blockTimestamp
          }
        }
      }
      
      # Also fetch users who are buying these followers' tokens (if they exist)
      TokenBalances(
        input: {filter: {blockchain: {_eq: base}, owner: {_in: $fids}}, limit: 10}
      ) {
        TokenBalance {
          owner {
            addresses
          }
          token {
            name
            symbol
            address
            projectDetails {
              name
            }
          }
          amount
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      AIRSTACK_API_URL,
      {
        query,
        variables: { fids: fids.map(f => f.toString()) },
      },
      {
        headers: {
          Authorization: process.env.AIRSTACK_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching post activity from Airstack:", error);
    return null;
  }
}

/**
 * Specifically finds "Buyers" of social posts (tokens) on Base.
 */
export async function getVerifiedBuyers(fid: number) {
  // We look for token transfers on Base where the follower is the receiver of a social/meme token
  const query = `
    query GetRecentBuyers($fid: String!) {
      SocialFollowers(
        input: {filter: {identity: {_eq: $fid}, dappName: {_eq: farcaster}}, blockchain: ethereum}
      ) {
        Follower {
          followerAddress {
            addresses
            socials {
              profileName
              userId
            }
            # Check for token transfers to them (they bought something)
            tokenTransfers(input: {filter: {blockchain: {_eq: base}}, limit: 5}) {
              token {
                name
                symbol
                address
              }
              amount
              formattedAmount
              blockTimestamp
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
