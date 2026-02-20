import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import useDrugNFT from "../../hooks/useDrugNFT";
import { FiTrash2, FiExternalLink, FiRefreshCw } from "react-icons/fi";

const DrugInventory = () => {
  const { contract, account } = useDrugNFT();
  const [tkID, settkID] = useState("");
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNFTs = async () => {
    if (!contract || !account) return;
    setRefreshing(true);
    
    try {
      const balance = await contract.balanceOf(account);
      const nftList = [];
      const transferEvents = await contract.queryFilter(
        contract.filters.Transfer(null, account)
      );

      for (const event of transferEvents) {
        try {
          const tokenId = event.args.tokenId.toString();
          const uri = await contract.tokenURI(tokenId);
          nftList.push({ tokenId, uri });
        } catch (error) {
          console.warn(`NFT ${event.args.tokenId} not found`, error);
        }
      }

      setNfts(nftList);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      alert("Failed to load prescriptions.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [contract, account]);

  const removeNFT = async () => {
    if (!contract || !account || !tkID) {
      alert("Please enter a valid Token ID");
      return;
    }
    
    setLoading(true);
    try {
      const tx = await contract.burn(tkID);
      await tx.wait();
      alert("Prescription deleted successfully!");
      fetchNFTs();
      settkID("");
    } catch (error) {
      console.error("Error deleting NFT:", error);
      alert("Failed to delete prescription. Please check the Token ID.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Prescriptions</h1>
            <p className="text-gray-600 mt-2">
              {nfts.length} prescription{nfts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={fetchNFTs}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-green-100 rounded-lg transition disabled:opacity-50"
          >
            <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Prescriptions Table */}
        {nfts.length > 0 ? (
          <div className="bg-green-100 rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prescription Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR Code
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-green-100 divide-y divide-gray-200">
                  {nfts.map((nft) => (
                    <tr key={nft.tokenId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 green-100space-nowrap text-sm font-medium text-gray-900">
                        #{nft.tokenId}
                      </td>
                      <td className="px-6 py-4 green-100space-nowrap text-sm text-gray-500">
                        <a
                          href={nft.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <FiExternalLink className="mr-2" />
                          View Details
                        </a>
                      </td>
                      <td className="px-6 py-4 green-100space-nowrap">
                        <div className="flex justify-center">
                          <QRCodeCanvas
                            value={nft.tokenId}
                            size={100}
                            bgColor="#ffffff"
                            fgColor="#1f2937"
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-green-100 rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">No prescriptions found in your inventory</p>
          </div>
        )}

        {/* Delete Prescription Section */}
        <div className="mt-8 bg-green-100 rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Prescription</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Token ID
              </label>
              <input
                id="tokenId"
                value={tkID}
                onChange={(e) => settkID(e.target.value)}
                type="text"
                placeholder="e.g. 12345"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={removeNFT}
                disabled={loading || !tkID}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-green-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Warning: This action cannot be undone. The prescription will be permanently deleted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrugInventory;