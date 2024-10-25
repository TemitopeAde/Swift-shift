import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface RateContainerProps {
  sendCoin: string;
  sendNetwork: string;
  receiveCoin: string;
  receiveNetwork: string;
  amount: number;
}

const RateContainer = ({
  receiveCoin,
  receiveNetwork,
  sendCoin,
  sendNetwork,
  amount
}: RateContainerProps) => {
  const [rateData, setRateData] = useState<{
    depositCoin: string;
    rate: string;
    settleCoin: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState()

  useEffect(
    () => {
      const fetchRate = async () => {
        setIsLoading(true);
        setIsError(false);

        const url = `https://sideshift.ai/api/v2/pair/${sendCoin}-${sendNetwork}/${receiveCoin}-${receiveNetwork}?amount=${amount}`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch rate data");
          }

          const data = await response.json();
          setRateData(data);
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
