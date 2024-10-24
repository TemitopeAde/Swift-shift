import React from "react";
import Query from "./Query";
import { Loader2 } from "lucide-react";

interface RateContainerProps {
  sendCoin: string;
  sendNetwork: string;
  receiveCoin: string;
  receiveNetwork: string;
  amount: number
}

const RateContainer = ({
  receiveCoin,
  receiveNetwork,
  sendCoin,
  sendNetwork,
  amount
}: RateContainerProps) => {

  const url = `https://sideshift.ai/api/v2/pair/${sendCoin}-${sendNetwork}/${receiveCoin}-${receiveNetwork}?amount=${amount}`

  const queryParams = ["coinrates"];
  const { isPending, isError, data, error } = Query({ url, queryParams });

    if (isPending) {
        return <Loader2 />
    }

    if (isError) {
        console.log(error);
        return <>
            <h3>Error loading rates</h3>
        </>
    }


  return (
    <div>
        <h3 className="font-bold text-color">{amount} {data.depositCoin} = {data.rate} {data.settleCoin}</h3>
    </div>
  )
};

export default RateContainer;
