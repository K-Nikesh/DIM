import { ethers } from "ethers"

// Contract ABI - this would typically be generated from your contract
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			}
		],
		"name": "approveIssuer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "credentialHash",
				"type": "string"
			}
		],
		"name": "CredentialIssued",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "CredentialRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "metadata",
				"type": "string"
			}
		],
		"name": "IdentityRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "credentialHash",
				"type": "string"
			}
		],
		"name": "issueCredential",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			}
		],
		"name": "IssuerApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			}
		],
		"name": "IssuerRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "metadata",
				"type": "string"
			}
		],
		"name": "registerIdentity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "revokeCredential",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			}
		],
		"name": "revokeIssuer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "approvedIssuers",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "credentials",
		"outputs": [
			{
				"internalType": "string",
				"name": "credentialHash",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "issuedAt",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isRevoked",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getCredentials",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "credentialHash",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "issuer",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "issuedAt",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isRevoked",
						"type": "bool"
					}
				],
				"internalType": "struct DecentralizedIM.Credential[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "identities",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "metadata",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "isCredentialValid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Contract address - replace with your deployed contract address
const CONTRACT_ADDRESS = "0xdB25F7ba7A3F9a67F6D003c6E895e1642f1fb0E7" 

// Create a contract instance
export const getContract = (signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
}

// Get provider and signer
export const getProviderAndSigner = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed")
  }

  await window.ethereum.request({ method: "eth_requestAccounts" })
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  return { provider, signer }
}

// Identity Management Functions
export const registerIdentity = async (metadata) => {
  try {
    const { signer } = await getProviderAndSigner()
    const contract = getContract(signer)
    const tx = await contract.registerIdentity(metadata)
    return await tx.wait()
  } catch (error) {
    console.error("Error registering identity:", error)
    throw error
  }
}

export const checkIdentityStatus = async (address) => {
  try {
    const { provider } = await getProviderAndSigner()
    const contract = getContract(provider)
    const identity = await contract.identities(address)
    return {
      isRegistered: identity.isRegistered,
      metadata: identity.metadata,
      owner: identity.owner,
    }
  } catch (error) {
    console.error("Error checking identity status:", error)
    throw error
  }
}

// Issuer Management Functions
export const approveIssuer = async (issuerAddress) => {
  try {
    const { signer } = await getProviderAndSigner()
    const contract = getContract(signer)
    const tx = await contract.approveIssuer(issuerAddress)
    return await tx.wait()
  } catch (error) {
    console.error("Error approving issuer:", error)
    throw error
  }
}

export const revokeIssuer = async (issuerAddress) => {
  try {
    const { signer } = await getProviderAndSigner()
    const contract = getContract(signer)
    const tx = await contract.revokeIssuer(issuerAddress)
    return await tx.wait()
  } catch (error) {
    console.error("Error revoking issuer:", error)
    throw error
  }
}

export const checkIssuerStatus = async (address) => {
  try {
    const { provider } = await getProviderAndSigner()
    const contract = getContract(provider)
    return await contract.approvedIssuers(address)
  } catch (error) {
    console.error("Error checking issuer status:", error)
    throw error
  }
}

// Credential Management Functions
export const issueCredential = async (userAddress, credentialHash) => {
  try {
    const { signer } = await getProviderAndSigner()
    const contract = getContract(signer)
    const tx = await contract.issueCredential(userAddress, credentialHash)
    return await tx.wait()
  } catch (error) {
    console.error("Error issuing credential:", error)
    throw error
  }
}

export const revokeCredential = async (userAddress, index) => {
  try {
    const { signer } = await getProviderAndSigner()
    const contract = getContract(signer)
    const tx = await contract.revokeCredential(userAddress, index)
    return await tx.wait()
  } catch (error) {
    console.error("Error revoking credential:", error)
    throw error
  }
}

export const getCredentials = async (address) => {
  try {
    const { provider } = await getProviderAndSigner()
    const contract = getContract(provider)
    const credentials = await contract.getCredentials(address)

    // Format the credentials for easier use in the UI
    return credentials.map((cred, index) => ({
      id: index,
      credentialHash: cred.credentialHash,
      issuer: cred.issuer,
      issuedAt: new Date(cred.issuedAt.toNumber() * 1000).toISOString().split("T")[0],
      isRevoked: cred.isRevoked,
    }))
  } catch (error) {
    console.error("Error getting credentials:", error)
    throw error
  }
}

export const isCredentialValid = async (userAddress, index) => {
  try {
    const { provider } = await getProviderAndSigner()
    const contract = getContract(provider)
    return await contract.isCredentialValid(userAddress, index)
  } catch (error) {
    console.error("Error checking credential validity:", error)
    throw error
  }
}

// Helper function to store credential data in IPFS
export const storeCredentialData = async (data) => {
  // This is a mock function - in a real app, you would use a service like Pinata, Infura, or Web3.Storage
  // to store the data on IPFS and return the hash
  console.log("Storing credential data:", data)

  // Mock IPFS hash generation
  const mockHash = "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  return mockHash
}

// Listen for contract events
export const listenForEvents = (contract, callback) => {
  contract.on("IdentityRegistered", (user, metadata) => {
    callback({
      type: "IdentityRegistered",
      user,
      metadata,
    })
  })

  contract.on("CredentialIssued", (user, issuer, credentialHash) => {
    callback({
      type: "CredentialIssued",
      user,
      issuer,
      credentialHash,
    })
  })

  contract.on("CredentialRevoked", (user, index) => {
    callback({
      type: "CredentialRevoked",
      user,
      index,
    })
  })

  contract.on("IssuerApproved", (issuer) => {
    callback({
      type: "IssuerApproved",
      issuer,
    })
  })

  contract.on("IssuerRevoked", (issuer) => {
    callback({
      type: "IssuerRevoked",
      issuer,
    })
  })

  // Return a function to remove the listeners
  return () => {
    contract.removeAllListeners()
  }
}
