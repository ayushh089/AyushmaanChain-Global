import { useState, useEffect } from "react";
import useUserRegistry from "./useUserRegistry";

const useFetchHospitals = () => {

  const { contract,account } = useUserRegistry();

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHospitals = async () => {

    try {

      if (!contract) return;

      // get hospital wallet addresses from blockchain
      const hospitalAddresses = await contract.getHospitals();
      console.log("Hospital Addresses: ", hospitalAddresses.length);

      // convert addresses to UI objects
      const formattedHospitals = hospitalAddresses.map((address, index) => {

        return {

          id: address,

          name: `Hospital ${index + 1}`,

          walletAddress: address,

          location: "India",

          rating: "4.7",

          reviews: "120",

          accreditation: "Blockchain Verified",

          distance: "Available globally",

          specialties: [
            "Cardiology",
            "Neurology",
            "Orthopedics"
          ],


        };

      });

      setHospitals(formattedHospitals);

    } catch (error) {

      console.error("Fetch hospitals error:", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchHospitals();

  },[contract,account]);

  return { hospitals, loading };

};

export default useFetchHospitals;