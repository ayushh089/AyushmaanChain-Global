export async function uploadDrugMetadataToIPFS(metadata, contract, account) {
    try {
      const fileName = `${metadata.manfCode}-metadata.json`;
      const file = new File([JSON.stringify(metadata)], fileName, {
        type: "application/json",
      });
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
  
      const response = await fetch(`${import.meta.env.VITE_BACKENDLINK}/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload JSON metadata to IPFS");
      }
  
      const data = await response.json();
      const ipfsHash = data.IpfsHash;
  
      if (!ipfsHash) {
        throw new Error("IPFS hash is missing in the response");
      }
  
      const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
  
  
      return ipfsUrl;
    } catch (err) {
      console.error("Error uploading drug metadata:", err);
      throw err;
    }
  }
  