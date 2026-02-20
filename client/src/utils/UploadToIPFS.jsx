import { pdf } from "@react-pdf/renderer";
import { zeroPadBytes } from "ethers";
import PrescriptionPDF from "../Components/PrescriptionPDF";


export async function uploadToIPFS(details, contract, address, fileName = "prescription.pdf") {
  try {

    const pdfBlob = await pdf(<PrescriptionPDF details={details} />).toBlob();
    const file = new File([pdfBlob], fileName, {
      type: "application/pdf",
    });

    const hash = await computeSHA256(file);
    const shaHashBytes32 = zeroPadBytes(`0x${hash}`, 32);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    const response = await fetch(
      `${import.meta.env.VITE_BACKENDLINK}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    const ipfsHash = data.IpfsHash;

    if (!ipfsHash || !shaHashBytes32) {
      throw new Error("Missing IPFS hash or SHA256 hash.");
    }

   
    if (contract) {
      const fileType = "Prescription";
      const tx = await contract.uploadPrescription(
        fileName,
        fileType,
        ipfsHash,
        shaHashBytes32,
        details.patientId
      );

      await tx.wait();
      console.log("Medical record uploaded successfully");
    }

    return `https://ipfs.io/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    throw error;
  }
}

async function computeSHA256(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hashBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
