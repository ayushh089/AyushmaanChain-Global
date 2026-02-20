import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import usePrescriptionNFT from "../../hooks/usePrescriptionNFT";
import useUserRegistry from "../../hooks/useUserRegistry";

const Prescription = () => {
  const { contract, account } = usePrescriptionNFT();
  const { contract: userContract } = useUserRegistry();
  const [tkID, settkID] = useState("");
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNFTs = async () => {
    if (!contract || !account) return;

    try {
      const balance = await contract.balanceOf(account);
      console.log("NFT Balance:", balance.toString());
      const nftList = [];
      const transferEvents = await contract.queryFilter(
        contract.filters.Transfer(null, account)
      );

      for (const event of transferEvents) {
        try {
          const tokenId = event.args.tokenId.toString();
          const uri = await contract.tokenURI(tokenId);
          const expireStatus = await contract.isExpired(tokenId);
          const isFulfilled = await contract.isFulfilled(tokenId);
          nftList.push({ tokenId, uri, expireStatus, isFulfilled });
        } catch (error) {
          console.warn(`NFT ${event.args.tokenId} not found`);
        }
      }

      setNfts(nftList);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      alert("Failed to load prescriptions.");
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [contract, account]);

  const removeNFT = async () => {
    if (!contract || !account) return;
    setLoading(true);
    try {
      const tx = await contract.burn(tkID);
      await tx.wait();
      alert("Prescription Deleted Successfully!");
      fetchNFTs();
    } catch (error) {
      console.error("Error deleting NFT:", error);
      alert("Failed to delete prescription.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Your Prescriptions</h1>

      {nfts.length > 0 ? (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3">Token ID</th>
                  <th className="border p-3">Prescription</th>
                  <th className="border p-3">QR Code</th>
                  <th className="border p-3">Expired</th>
                  <th className="border p-3">Fulfilled</th>
                </tr>
              </thead>
              <tbody>
                {nfts.map((nft) => (
                  <tr key={nft.tokenId} className="text-center">
                    <td className="border p-3 font-semibold">{nft.tokenId}</td>
                    <td className="border p-3">
                      <a
                        href={nft.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Prescription
                      </a>
                    </td>
                    <td className="border p-3 flex justify-center">
                      <QRCodeCanvas
                        value={nft.tokenId}
                        size={80}
                        className="mt-2"
                      />
                    </td>
                    <td className="border p-3 font-semibold">
                      {nft.expireStatus ? (
                        <span className="text-red-500">Yes</span>
                      ) : (
                        <span className="text-green-600">No</span>
                      )}
                    </td>
                    <td className="border p-3 font-semibold">
                      {nft.isFulfilled ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-gray-500">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No Prescriptions Found.</p>
      )}

      <div className="flex space-x-3">
        <input
          onChange={(e) => settkID(e.target.value)}
          type="text"
          placeholder="Enter Token ID"
          className="border p-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={removeNFT}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Delete Prescription
        </button>
      </div>
    </div>
  );
};

export default Prescription;
