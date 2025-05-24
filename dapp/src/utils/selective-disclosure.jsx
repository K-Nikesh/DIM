// Selective disclosure and consent management utilities
import { ethers } from "ethers"
import { uploadMetadataToPinata } from "./pinata"
import { getProviderAndSigner } from "../utils/contract" // Import getProviderAndSigner

// Data categories that can be selectively shared
export const DATA_CATEGORIES = {
  BASIC_IDENTITY: {
    id: "basic_identity",
    name: "Basic Identity",
    description: "Name and basic profile information",
    fields: ["name", "profileImage"],
    required: false,
  },
  WALLET_ADDRESS: {
    id: "wallet_address",
    name: "Wallet Address",
    description: "Your blockchain wallet address",
    fields: ["account"],
    required: true, // Usually required for authentication
  },
  CREDENTIALS_COUNT: {
    id: "credentials_count",
    name: "Credential Count",
    description: "Number of verified credentials you hold",
    fields: ["credentialCount"],
    required: false,
  },
  SPECIFIC_CREDENTIALS: {
    id: "specific_credentials",
    name: "Specific Credentials",
    description: "Individual credential details",
    fields: ["credentials"],
    required: false,
  },
  REGISTRATION_DATE: {
    id: "registration_date",
    name: "Registration Date",
    description: "When you registered your identity",
    fields: ["registrationDate"],
    required: false,
  },
  ISSUER_INFORMATION: {
    id: "issuer_information",
    name: "Issuer Information",
    description: "Details about who issued your credentials",
    fields: ["issuerDetails"],
    required: false,
  },
}

// Create a consent record
export const createConsentRecord = async (userAccount, appDomain, permissions, signature) => {
  const consentData = {
    userAccount,
    appDomain,
    permissions,
    timestamp: new Date().toISOString(),
    signature,
    version: "1.0",
  }

  // Store consent record on IPFS
  const consentHash = await uploadMetadataToPinata(consentData)

  // Store locally for quick access
  const localConsents = getLocalConsents()
  localConsents[`${userAccount}-${appDomain}`] = {
    ...consentData,
    ipfsHash: consentHash,
  }
  localStorage.setItem("dim_consents", JSON.stringify(localConsents))

  return consentHash
}

// Get local consent records
export const getLocalConsents = () => {
  try {
    return JSON.parse(localStorage.getItem("dim_consents") || "{}")
  } catch {
    return {}
  }
}

// Check if user has given consent for specific data sharing
export const hasConsent = (userAccount, appDomain, dataCategory) => {
  const consents = getLocalConsents()
  const consentKey = `${userAccount}-${appDomain}`
  const consent = consents[consentKey]

  if (!consent) return false

  return consent.permissions.includes(dataCategory)
}

// Revoke consent for an application
export const revokeConsent = (userAccount, appDomain) => {
  const consents = getLocalConsents()
  const consentKey = `${userAccount}-${appDomain}`
  delete consents[consentKey]
  localStorage.setItem("dim_consents", JSON.stringify(consents))
}

// Filter user data based on consent
export const filterDataByConsent = (userData, userAccount, appDomain, requestedPermissions = []) => {
  const consents = getLocalConsents()
  const consentKey = `${userAccount}-${appDomain}`
  const consent = consents[consentKey]

  if (!consent) {
    // No consent given, return minimal data
    return {
      account: userData.account, // Always required for authentication
      hasConsent: false,
    }
  }

  const allowedData = { account: userData.account }

  // Check each permission and include data accordingly
  consent.permissions.forEach((permission) => {
    const category = Object.values(DATA_CATEGORIES).find((cat) => cat.id === permission)
    if (category) {
      category.fields.forEach((field) => {
        if (userData[field] !== undefined) {
          allowedData[field] = userData[field]
        }
      })
    }
  })

  // Add metadata about consent
  allowedData.consentGiven = true
  allowedData.consentTimestamp = consent.timestamp
  allowedData.sharedCategories = consent.permissions

  return allowedData
}

// Generate selective disclosure proof
export const generateSelectiveDisclosureProof = async (userData, selectedFields, userAccount) => {
  const { signer } = await getProviderAndSigner()

  // Create a hash of the selected data
  const selectedData = {}
  selectedFields.forEach((field) => {
    if (userData[field] !== undefined) {
      selectedData[field] = userData[field]
    }
  })

  const dataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(selectedData)))
  const timestamp = Date.now()

  // Sign the proof
  const message = `DIM Selective Disclosure\nData Hash: ${dataHash}\nTimestamp: ${timestamp}\nAccount: ${userAccount}`
  const signature = await signer.signMessage(message)

  return {
    selectedData,
    dataHash,
    timestamp,
    signature,
    proof: {
      message,
      signature,
      signer: userAccount,
    },
  }
}

// Verify selective disclosure proof
export const verifySelectiveDisclosureProof = (proof, expectedAccount) => {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(proof.message, proof.signature)
    return recoveredAddress.toLowerCase() === expectedAccount.toLowerCase()
  } catch (error) {
    console.error("Error verifying selective disclosure proof:", error)
    return false
  }
}
