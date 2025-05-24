// Authentication API utilities for cross-platform integration
import { ethers } from "ethers"
import { getProviderAndSigner, getCredentials, checkIdentityStatus } from "./contract"

// Generate authentication challenge
export const generateAuthChallenge = () => {
  const timestamp = Date.now()
  const nonce = Math.random().toString(36).substring(2, 15)
  const challenge = `DIM-Auth-${timestamp}-${nonce}`
  return {
    challenge,
    timestamp,
    nonce,
  }
}

// Sign authentication message
export const signAuthMessage = async (challenge, account) => {
  try {
    const { signer } = await getProviderAndSigner()
    const message = `DIM Authentication\nChallenge: ${challenge}\nAccount: ${account}\nTimestamp: ${Date.now()}`
    const signature = await signer.signMessage(message)

    return {
      message,
      signature,
      account,
    }
  } catch (error) {
    console.error("Error signing auth message:", error)
    throw error
  }
}

// Verify authentication signature
export const verifyAuthSignature = async (message, signature, expectedAccount) => {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature)
    return recoveredAddress.toLowerCase() === expectedAccount.toLowerCase()
  } catch (error) {
    console.error("Error verifying signature:", error)
    return false
  }
}

// Get user authentication profile
export const getUserAuthProfile = async (account) => {
  try {
    // Check if user is registered
    const identity = await checkIdentityStatus(account)
    if (!identity.isRegistered) {
      throw new Error("User not registered in DIM system")
    }

    // Get user credentials
    const credentials = await getCredentials(account)
    const validCredentials = credentials.filter((cred) => !cred.isRevoked)

    // Parse identity metadata
    let profileData = {}
    try {
      profileData = JSON.parse(identity.metadata)
    } catch (e) {
      profileData = { name: "Anonymous" }
    }

    return {
      account,
      isRegistered: true,
      profile: profileData,
      credentials: validCredentials,
      credentialCount: validCredentials.length,
      lastActivity: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error getting user auth profile:", error)
    throw error
  }
}

// Generate JWT-like token for session management
export const generateAuthToken = async (account, challenge, signature) => {
  const payload = {
    account,
    challenge,
    signature,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  }

  // In a real implementation, you'd use a proper JWT library and secret
  const token = btoa(JSON.stringify(payload))
  return token
}

// Verify auth token
export const verifyAuthToken = (token) => {
  try {
    const payload = JSON.parse(atob(token))
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp < now) {
      throw new Error("Token expired")
    }

    return payload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Create authentication session
export const createAuthSession = async (account) => {
  try {
    const challenge = generateAuthChallenge()
    const authData = await signAuthMessage(challenge.challenge, account)
    const profile = await getUserAuthProfile(account)
    const token = await generateAuthToken(account, challenge.challenge, authData.signature)

    return {
      token,
      profile,
      challenge: challenge.challenge,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  } catch (error) {
    console.error("Error creating auth session:", error)
    throw error
  }
}
