import QRCode from "qrcode";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { encryptPayload } from "./encryption"; // 🔐

const BATCH_SIZE = 1000; 

export const generateQRCodesAndDownload = async (tokenId, stripIDs) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Drug QR Data");

  sheet.columns = [
    { header: "Token ID", key: "tokenId", width: 30 },
    { header: "Strip ID", key: "stripId", width: 30 },
    { header: "QR Filename", key: "qrFile", width: 40 },
  ];

  const zip = new JSZip();
  const qrFolder = zip.folder("qr_codes");

  let batchStart = 0;
  let batchEnd = BATCH_SIZE;
  const totalStrips = stripIDs.length;

  while (batchStart < totalStrips) {
    const currentBatch = stripIDs.slice(batchStart, batchEnd);

    for (let stripId of currentBatch) {
      const encryptedPayload = encryptPayload({
        tokenId,
        stripId,
        timestamp: Date.now(),
      });

      const dataUrl = await QRCode.toDataURL(encryptedPayload);
      const base64 = dataUrl.split(",")[1];

      qrFolder.file(`${stripId}.png`, base64, { base64: true });

      sheet.addRow({
        tokenId,
        stripId,
        qrFile: `qr_codes/${stripId}.png`,
      });
    }

    batchStart = batchEnd;
    batchEnd = Math.min(batchEnd + BATCH_SIZE, totalStrips);  

    console.log(`Processed ${batchStart} to ${batchEnd} QR codes...`);
  }

  const excelBuffer = await workbook.xlsx.writeBuffer();
  zip.file("drug_qr_codes.xlsx", excelBuffer);

  const finalZip = await zip.generateAsync({ type: "blob" });
  saveAs(finalZip, `DrugBatch_${tokenId}_QR.zip`);
  console.log("Secure QR Zip created!");
};
