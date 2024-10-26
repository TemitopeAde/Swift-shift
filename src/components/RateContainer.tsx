import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";


interface RateData {
  depositCoin: string;
  rate: string;
  settleCoin: string;
  min: number;
  max: number;
}


interface RateContainerProps {
  sendCoin: string;
  sendNetwork: string;
  receiveCoin: string;
  receiveNetwork: string;
  amount: number;
  rateData: RateData | null,
  setRateData: React.Dispatch<React.SetStateAction<RateData | null>>;
}

const RateContainer = ({
  receiveCoin,
  receiveNetwork,
  sendCoin,
  sendNetwork,
  amount,
  rateData,
  setRateData,
}: RateContainerProps) => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // const [max, setMax] = useState(0);

  useEffect(
    () => {
      const fetchRate = async () => {
        setIsLoading(true);
        setIsError(false);

        const url = `https://sideshift.ai/api/v2/pair/${sendCoin}-${sendNetwork}/${receiveCoin}-${receiveNetwork}`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch rate data");
          }

          const data = await response.json();
          setRateData({
            depositCoin: data.depositCoin,
            rate: data.rate,
            settleCoin: data.settleCoin,
            min: data.min,
            max: data.max,
          });
        } catch (error) {
          console.error("Error fetching rate data:", error);
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRate();
    },
    [sendCoin, sendNetwork, receiveCoin, receiveNetwork, amount]
  ); 

  if (isLoading) {
    return <Loader2 />;
  }

  if (isError || !rateData) {
    return (
      <div>
        <h3>Error loading rates</h3>
      </div>
    );
  }
  return (
    <div>
      <h3 className="font-bold text-color">
        {amount} {rateData.depositCoin} = {rateData.rate} {rateData.settleCoin}
      </h3>
    </div>
  );
};

export default RateContainer;
