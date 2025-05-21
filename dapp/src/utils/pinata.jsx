const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1NDI3NThkNC0xNjllLTRlOTgtYmJkNy02NzFkMzgwMzhlZDgiLCJlbWFpbCI6ImtpbmdvZm5pa2V5MjAwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZmU2ZWJhZWQ1NGJiZTc3M2U4ODkiLCJzY29wZWRLZXlTZWNyZXQiOiI2MjNlYmViNDg0YzRlM2Y0MGZmNTMyYmMxMjMzMTQ0NjAxODMwZWZhNTlhZWViYTc0OGVkNTQ3NWRiOGRlYjNhIiwiZXhwIjoxNzc2Nzk1NTgyfQ.IrIws-fZTC"


export const uploadMetadataToPinata = async (metadata) =>  {
  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1NDI3NThkNC0xNjllLTRlOTgtYmJkNy02NzFkMzgwMzhlZDgiLCJlbWFpbCI6ImtpbmdvZm5pa2V5MjAwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTVhNTE2NWI2NDViYTM0NDMxMGQiLCJzY29wZWRLZXlTZWNyZXQiOiIzODkyNGIyNDk3NTEwODkzOTJjZmM5N2Q5NzM0NDBhNmEyMmExMjhkNzkxMDQ1OGUyZGZhZDZlYTI5NmM1MzY0IiwiZXhwIjoxNzc2Nzk3ODc3fQ.S9wZQtT0DO4cmc_TDYDNvT7t6K_4qfNNFcICgED1RJs",
      'pinata_api_key': '15a5165b645ba344310d',
       'pinata_secret_api_key': '38924b249751089392cfc97d973440a6a22a128d7910458e2dfad6ea296c5364'
    },
    body: JSON.stringify(metadata),
  })

  if (!response.ok) {
    throw new Error("Failed to upload metadata to IPFS")
  }

  const data = await response.json()
  return `ipfs://${data.IpfsHash}`
}


// Function to upload a file to IPFS via Pinata
export const uploadFileToPinata = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1NDI3NThkNC0xNjllLTRlOTgtYmJkNy02NzFkMzgwMzhlZDgiLCJlbWFpbCI6ImtpbmdvZm5pa2V5MjAwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTVhNTE2NWI2NDViYTM0NDMxMGQiLCJzY29wZWRLZXlTZWNyZXQiOiIzODkyNGIyNDk3NTEwODkzOTJjZmM5N2Q5NzM0NDBhNmEyMmExMjhkNzkxMDQ1OGUyZGZhZDZlYTI5NmM1MzY0IiwiZXhwIjoxNzc2Nzk3ODc3fQ.S9wZQtT0DO4cmc_TDYDNvT7t6K_4qfNNFcICgED1RJs",
      pinata_api_key: "15a5165b645ba344310d",
      pinata_secret_api_key: "38924b249751089392cfc97d973440a6a22a128d7910458e2dfad6ea296c5364",
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload file to IPFS")
  }

  const data = await response.json()
  return `ipfs://${data.IpfsHash}`
}