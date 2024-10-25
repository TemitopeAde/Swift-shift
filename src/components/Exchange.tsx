import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Ghost, Repeat } from "lucide-react";
import { ClipboardList } from 'lucide-react';
import { Button } from "./ui/button";
import StepsBar from "./StepsBar";
import RateContainer from "./RateContainer";
import { ComboBox } from "./ComboBox";
import Amount from "./Amount";


const isValidWalletAddress = (address: string) => {
  return /^[a-zA-Z0-9]{26,42}$/.test(address);
};


const RepeatIcon = ({ toggleCoins }: { toggleCoins: () => void }) => {
    return (
      <div className="flex justify-center items-center">
        <Repeat onClick={toggleCoins} className="cursor-pointer hover:rotate-180" size={35} />
      </div>
    );
};

const Exchange = () => {
    const [sendCoin, setSendCoin] = useState("Ethereum");
    const [receiveCoin, setReceiveCoin] = useState("Bitcoin");
  
    const [receiveImageUrl, setReceiveImageUrl] = useState("https://sideshift.ai/coin-icons/btc.svg");
    const [sendImageUrl, setSendImageUrl] = useState("https://sideshift.ai/coin-icons/eth.svg");

    const [sendNetwork, setSendNetwork] = useState("Ethereum")
    const [receiveNetwork, setReceiveNetwork] = useState("Bitcoin")

    const [error, setError] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [memo, setMemo] = useState("")
    const[isMemo, setIsMemo] = useState(false)
    const [amount, setAmount] = useState(1)
    const [exchangeReceive, setExchangeReceive] = useState<number>(0)
    const [exchangeSent, setExchangeSent] = useState<number>(0)

    const [sendCoinId, setSendCoinId] = useState("ETH");
    const [receiveCoinId, setReceiveCoinId] = useState("BTC");
    

    const toggleCoins = () => {
        setSendCoin((prevSendCoin) => receiveCoin); 
        setReceiveCoin((prevReceiveCoin) => sendCoin);
    
        setSendImageUrl((prev) => receiveImageUrl);
        setReceiveImageUrl((prev) =>sendImageUrl);
    };

    const handleSubmit = async () => {

        const formObject = {
            coinReceived: receiveCoin,
            coinSent: sendCoin,
            coinNetworkReceived:receiveNetwork,
            coinNetworkSent:sendNetwork,
            wallet:walletAddress,
            memo: memo
        }

        if (!isValidWalletAddress(formObject.wallet)) {
            setError("Invalid wallet address. Please enter a valid address.");
            return; 
        }

        console.log(formObject);
        
    }

    const handleWalletAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        const address = event.target.value;

        setWalletAddress(address)

        if (!isValidWalletAddress(address)) {
            setError("Invalid wallet address. Please enter a valid address.")
        } else {
            setError("")
        }
    }
    
    const currentStep = 0;
    const steps = [
        { label: "Choose Coin Pair" },
        {
          label: `Send ${sendCoin}`,
          icon: sendImageUrl,
        },
        {
          label: `Receive ${receiveCoin}`,
          icon: receiveImageUrl, 
        }
    ];

  return (
    <>
      <RateContainer
        sendCoin={sendCoinId}
        receiveCoin={receiveCoinId}
        sendNetwork={sendNetwork}
        receiveNetwork={receiveNetwork}
        amount={amount}
      />
      <StepsBar 
        steps={steps} 
        currentStep={currentStep} 
        receiveImageUrl={receiveImageUrl}
        sendImageUrl={sendImageUrl}
      />
      <div className="mb-4 mx-auto flex flex-col md:justify-between gap-6 lg:flex-row md:mx-auto">
          <div className="w-full">
            <div className="coin-buttons w-full bg-secondary p-8 rounded-md">
              <ComboBox 
                type="Ethereum" 
                title="YOU SEND" 
                value={sendCoin} 
                setValue={setSendCoin} 
                
                sendImageUrl={sendImageUrl} 
                receiveImageUrl={receiveImageUrl} 
                setSendImageUrl={setSendImageUrl}
                setReceiveImageUrl={setReceiveImageUrl}
                
                sendNetwork={sendNetwork} 
                setSendNetwork={setSendNetwork}
                receiveNetwork={receiveNetwork}
                setReceiveNetwork={setReceiveNetwork}

                sendCoinId={sendCoinId}
                receiveCoinId={receiveCoinId}
                setSendCoinId={setSendCoinId}
                setReceiveCoinId={setReceiveCoinId}
              />
            </div>
            <Amount 
              type="send" 
              sendCoin={sendCoin} 
              receiveCoin={receiveCoin} 
              exchangeReceive={exchangeReceive} 
              exchangeSent={exchangeSent} 
              setExchangeReceive={setExchangeReceive}
              setExchangeSent={setExchangeSent}

              sendCoinId={sendCoinId}
              receiveCoinId={receiveCoinId}
              sendNetwork={sendNetwork}
              receiveNetwork={receiveNetwork}
            />
          </div>

          <RepeatIcon toggleCoins={toggleCoins} />
          <div className="w-full">
            <div className="coin-buttons w-full bg-secondary p-8 rounded-md">
              <ComboBox 
                type="Bitcoin" 
                title="YOU RECEIVE" 
                value={receiveCoin} 
                setValue={setReceiveCoin} 

                sendImageUrl={sendImageUrl} 
                receiveImageUrl={receiveImageUrl} 
                setSendImageUrl={setSendImageUrl}
                setReceiveImageUrl={setReceiveImageUrl}

                sendNetwork={sendNetwork} 
                setSendNetwork={setSendNetwork}
                receiveNetwork={receiveNetwork}
                setReceiveNetwork={setReceiveNetwork}

                sendCoinId={sendCoinId}
                receiveCoinId={receiveCoinId}
                setSendCoinId={setSendCoinId}
                setReceiveCoinId={setReceiveCoinId}
              />
            </div>
            <Amount 
              type="receive" 
              sendCoin={sendCoin} 
              receiveCoin={receiveCoin} 
              exchangeReceive={exchangeReceive} 
              exchangeSent={exchangeSent} 
              setExchangeReceive={setExchangeReceive}
              setExchangeSent={setExchangeSent} 

              sendCoinId={sendCoinId}
              receiveCoinId={receiveCoinId}
              sendNetwork={sendNetwork}
              receiveNetwork={receiveNetwork}
            />

          </div>
      </div>

      <div className="mx-auto relative">
        <Label className="font-semibold text-xl mb-2" htmlFor="wallet-address">
          Receiver wallet address
        </Label>
        <Input 
          type="email"
          id="wallet-address" 
          placeholder="Enter wallet address" 
          value={walletAddress}
          onChange={handleWalletAddress}
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <Button className="absolute top-7 right-0" variant="ghost">
            <ClipboardList className="text-gray-700 hover:text-gray-900 transition duration-200" />
        </Button>
      </div>

      {isMemo && <div>
        <Label className="font-semibold text-xl mb-2" htmlFor="wallet-address">
            Memo
            </Label>
        <Input 
            type="text"
            id="memo" 
            placeholder="Enter memo" 
            value={walletAddress}
            onChange={handleWalletAddress}
        />
      </div>}

      <div className="mt-6">
        <Button className="w-full bg-foreground" onClick={handleSubmit}>Shift Now</Button>
      </div>
    </>
  )
}

export default Exchange