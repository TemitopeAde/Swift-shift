'use client'

import { useRouter } from 'next/navigation'
import QRCode from "react-qr-code";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Repeat } from "lucide-react";
import { ClipboardList } from 'lucide-react';
import { Button } from "./ui/button";
import StepsBar from "./StepsBar";
import RateContainer from "./RateContainer";
import { ComboBox } from "./ComboBox";
import Amount from "./Amount";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface FormObject {
  coinSent: string;
  coinNetworkSent: string;
  coinReceived: string;
  coinNetworkReceived: string;
  amount: number;
}


interface ShiftData {
  averageShiftSeconds?: string;
  createdAt?: string;
  depositAddress?: string;
  depositAmount?: string;
  depositCoin?: string;
  depositMax?: string;
  depositMin?: string;
  depositNetwork?: string;
  expiresAt?: string;
  id?: string;
  quoteId?: string;
  rate?: string;
  refundAddress?: string;
  settleAddress?: string;
  settleAmount?: string;
  settleCoin?: string;
  settleNetwork?: string;
  status?: string;
  type?: string;
}

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
    const router = useRouter()
    const [sendCoin, setSendCoin] = useState("Ethereum");
    const [receiveCoin, setReceiveCoin] = useState("Bitcoin");
  
    const [receiveImageUrl, setReceiveImageUrl] = useState("https://sideshift.ai/coin-icons/btc.svg");
    const [sendImageUrl, setSendImageUrl] = useState("https://sideshift.ai/coin-icons/eth.svg");

    const [sendNetwork, setSendNetwork] = useState("Ethereum")
    const [receiveNetwork, setReceiveNetwork] = useState("Bitcoin")

    const [error, setError] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [memo] = useState("")
    const[isMemo] = useState(false)
    const [amount] = useState(1)
    const [exchangeReceive, setExchangeReceive] = useState<number>(0)
    const [exchangeSent, setExchangeSent] = useState<number>(0)
    const [refundWallet, setRefundWallet] = useState<string>("")

    const [sendCoinId, setSendCoinId] = useState("ETH");
    const [receiveCoinId, setReceiveCoinId] = useState("BTC");
    const [state, setState] = useState(3);
    const [amountSent, setAmountSent] = useState(1)
    const [errorRefund, setErrorRefund] = useState<string>("")

    const [active, setActive] = useState(true);
    const [rateData, setRateData] = useState<{
      depositCoin: string;
      rate: string;
      settleCoin: string;
      min: number;
      max: number;
    } | null>(null);
    const [shiftMessage, setShifMessage] = useState("")
    const [shiftData, setShiftData] = useState<ShiftData>({});
    const [loading, setLoading] = useState<boolean>(false);

    const [copySuccess, setCopySuccess] = useState(false);
    

    const toggleCoins = () => {
        setSendCoin(() => receiveCoin); 
        setReceiveCoin(() => sendCoin);
    
        setSendImageUrl(() => receiveImageUrl);
        setReceiveImageUrl(() =>sendImageUrl);
    };
    
    const handleShift = async () => { 
      const myHeaders = new Headers();
      myHeaders.append("x-sideshift-secret", "d4bff73542b9b1a5b5aee7687f219736"); 
      myHeaders.append("x-user-ip", "1.2.3.4");
      myHeaders.append("Content-Type", "application/json");
    
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      console.log(shiftData?.id, "id");
      
      const shiftId = shiftData?.id
      try {
        const data = await fetch(`https://sideshift.ai/api/v2/shifts/${shiftId}`, requestOptions);
        if (!data.ok) {
          console.error("Failed", data.statusText);
        }
        const response = await data.json()  
        console.log(response);

        if (response?.status === "settled") {
          setState(3)
        }
        
        return response;
      } catch (error) {
        console.error("Error during the fetch request:", error);
      }
    } 

    const handleShiftAgain = () => {
      setState(1)
      setShiftData({})
    }

    const handleHome = () => {
      router.push("/")
      setState(1)
    }

    setTimeout(() => {
      if (state ===2) {
        handleShift()
      }
    }, 5000);
    

    const handleSubmit = async () => {
        setLoading(true)
        const formObject = {
          coinReceived: receiveCoinId,
          coinSent: sendCoinId,
          coinNetworkReceived:receiveNetwork,
          coinNetworkSent:sendNetwork,
          wallet:walletAddress,
          memo: memo,
          amount: amountSent
        }

        if (!isValidWalletAddress(formObject.wallet)) {
            setError("Invalid wallet address. Please enter a valid address.");
            setLoading(false);
            return; 
        }

        try {
          await sendRequest(formObject);
          setLoading(false)
          setState(2)
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false)
        }
    }
    
    const sendRequest = async (formObject: FormObject) => { 
      const myHeaders = new Headers();
      myHeaders.append("x-sideshift-secret", "d4bff73542b9b1a5b5aee7687f219736"); 
      myHeaders.append("x-user-ip", "1.2.3.4");
      myHeaders.append("Content-Type", "application/json");
    
      const body = JSON.stringify({
        depositCoin: formObject.coinSent,  
        depositNetwork: formObject.coinNetworkSent,
        settleCoin: formObject.coinReceived,
        settleNetwork: formObject.coinNetworkReceived,
        depositAmount: formObject.amount,
        settleAmount: null,
        affiliateId: "VEIULQ9Ri",
      });      
    
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: body,
      };
    
      try {
        const data = await fetch("https://sideshift.ai/api/v2/quotes", requestOptions);
        if (!data.ok) {
          console.error("Failed to fetch exchange quote:", data.statusText);
        }

        const response = await data.json()  
        
        if (response.id) {
          await fixedShift(response.id)
        }
        return data;
      } catch (error) {
        console.error("Error during the fetch request:", error);
      }
    }   
    
    
    const fixedShift = async (quotesId: string) => { 
      const myHeaders = new Headers();
      myHeaders.append("x-sideshift-secret", "d4bff73542b9b1a5b5aee7687f219736"); 
      myHeaders.append("x-user-ip", "1.2.3.4");
      myHeaders.append("Content-Type", "application/json");
    
      const raw = JSON.stringify({
        "settleAddress": walletAddress,
        "affiliateId": "VEIULQ9Ri",
        "quoteId": quotesId,
        "refundAddress": refundWallet
      });    

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
    
      try {
        const response = await fetch("https://sideshift.ai/api/v2/shifts/fixed", requestOptions);
        if (!response.ok) {
          console.error("Failed to fetch exchange quote:", response.statusText);
        }

        const data = await response.json()  
        setShiftData({
          averageShiftSeconds: data.averageShiftSeconds,
          createdAt: data.createdAt,
          depositAddress: data.depositAddress,
          depositAmount: data.depositAmount,
          depositCoin: data.depositCoin,
          depositMax: data.depositMax,
          depositMin: data.depositMin,
          depositNetwork: data.depositNetwork,
          expiresAt: data.expiresAt,
          id: data.id,
          quoteId: data.quoteId,
          rate: data.rate,
          refundAddress: data.refundAddress,
          settleAddress: data.settleAddress,
          settleAmount: data.settleAmount,
          settleCoin: data.settleCoin,
          settleNetwork: data.settleNetwork,
          status: data.status,
          type: data.type
        });
        
        return data      
      } catch (error) {
        console.error("Error during the fetch request:", error);
      }
    }
  
    const handleWalletAddress = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const address = event.target.value;

        setWalletAddress(address)

        if (!isValidWalletAddress(address)) {
            setError("Invalid wallet address. Please enter a valid address.")
        } else {
            setError("")
        }
    }

    const handleRefundWallet = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const refund = event.target.value;
      setRefundWallet(refund)

      if (!isValidWalletAddress(refund)) {
        setErrorRefund("Invalid refund wallet address. Please enter a valid address.")
        } else {
          setError("")
        }
      }

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shiftData?.depositAddress || "");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };

    function maskAddress(address: string): string {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

    const formattedDate = new Intl.DateTimeFormat('en-GB', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
    }).format(shiftData?.createdAt ? new Date(shiftData.createdAt) : new Date());
    

    useEffect(() => {
      if (sendCoin === receiveCoin) {
        setActive(true)
        setShifMessage("Select another currency pair")
      }
    }, [sendCoinId, receiveCoinId, sendCoin, receiveCoin, amountSent])

    if (state===1) {
      return (
        <>
          <RateContainer
            sendCoin={sendCoinId}
            receiveCoin={receiveCoinId}
            sendNetwork={sendNetwork}
            receiveNetwork={receiveNetwork}
            amount={amount}

            rateData={rateData}
            setRateData={setRateData}
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
                  shiftMessage={shiftMessage}
                  setShiftMessage={setShifMessage}
                  setActive={setActive}
                  active={active}
                  rateData={rateData}
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

                  amountSent={amountSent}
                  setAmountSent={setAmountSent}
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

                  shiftMessage={shiftMessage}
                  setShiftMessage={setShifMessage}
                  setActive={setActive}
                  active={active}
  
                  rateData={rateData}
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

                  amountSent={amountSent}
                  setAmountSent={setAmountSent}
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

          <div className="mt-4 mb-4">
            <Label className="font-semibold text-xl mb-2" htmlFor="refund">
                Refund Address(optional)
                </Label>
            <Input 
                type="text"
                id="refund" 
                placeholder="Enter refund address" 
                value={refundWallet}
                onChange={handleRefundWallet}
            />
            {errorRefund && <p className="text-red-600 mt-2 mb-2">{errorRefund}</p>}
          </div>
  
          <div className="mt-6">
          <Button
        className="w-full bg-foreground h-12 font-bold text-xl flex justify-center items-center"
        onClick={handleSubmit}
        disabled={active || loading}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={24} /> 
        ) : (
          "Shift Now"
        )}
      </Button>
          </div>
        </>
      )
    }

    if (state===2) {
      return (
        <section className="bg-card rounded-sm shadow-md p-6">
          <div className="flex justify-center items-center">
            <div className="flex flex-col gap-10">
              <div>
                <h1 className="font-bold text-3xl uppercase">
                  waiting for you to send {sendCoin}
                  <span className="animate-dots"></span>
                </h1>
              </div>
              <div className="flex gap-x-12 flex-col md:flex-row gap-y-4">
                <div className="bg-white p-4 flex justify-center items-center rounded-lg shadow-lg max-h-max md:sticky md:top-10">
                  <QRCode value={shiftData?.depositAddress ? shiftData.depositAddress : "0x56f4A1D2EEfEB4709235E457f467A28C513fEC8b"} />
                </div>

                <div className="flex flex-col gap-y-8">
                  <div className="flex flex-col gap-y-3">
                    <div className="flex gap-x-2 items-center">
                      <h3 className="font-normal uppercase">Minimum:</h3>
                      <div className="flex gap-x-3">
                        <h3 className="font-bold">{shiftData?.depositMin}</h3>
                        <h3 className="font-bold">{shiftData?.depositCoin}</h3>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Maximum:</h3>
                      <h3 className="font-bold">{shiftData?.depositMax}</h3>
                      <h3 className="font-bold">{shiftData?.depositCoin}</h3>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-3">
                    <h3 className="font-normal uppercase">To the {shiftData?.depositCoin} address</h3>
                    <h3 className="font-bold">{maskAddress(shiftData?.depositAddress ?? "")}</h3>
                    <Button onClick={copyToClipboard} className="uppercase font-bold w-full">
                      {copySuccess ? "Address Copied!" : "Copy Address"}
                    </Button>
                  </div>

                  <div className="flex flex-col gap-y-3">
                    <div className="flex gap-x-2 items-center">
                      <h3 className="font-normal uppercase">Settle Amount:</h3>
                      <div className="flex gap-x-3">
                        <h3 className="font-bold">{shiftData?.settleAmount}</h3>
                        <h3 className="font-bold">{shiftData?.settleCoin}</h3>
                      </div>
                    </div>
                    <div className="flex gap-x-2 items-center">
                      <h3 className="font-normal uppercase">Rate:</h3>
                      <div className="flex gap-x-3">
                        <h3 className="font-bold">{shiftData?.rate}</h3>
                        
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Network fees:</h3>
                      <h3 className="font-bold">0.36494 {shiftData?.depositCoin}</h3>
                    </div>

                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Receiving address:</h3>
                      <h3 className="font-bold">{maskAddress(shiftData?.settleAddress ?? "")}</h3>
                    </div>

                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Deposit address:</h3>
                      <h3 className="font-bold">{maskAddress(shiftData?.depositAddress ?? "")}</h3>
                    </div>

                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Refund address:</h3>
                      <h3 className="font-bold">{maskAddress(shiftData?.refundAddress ?? "")}</h3>
                    </div>

                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Settle network:</h3>
                      <h3 className="font-bold sentence-case">{shiftData?.settleNetwork}</h3>
                    </div>

                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Deposit network:</h3>
                      <h3 className="font-bold sentence-case">{shiftData?.depositNetwork}</h3>
                    </div>

                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Type:</h3>
                      <h3 className="font-bold sentence-case">{shiftData?.type}</h3>
                    </div>
                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Status:</h3>
                      <h3 className="font-bold sentence-case">{shiftData?.status}</h3>
                      <span className="animate-dots"></span>
                    </div>
                    <div className="flex gap-x-2">
                      <h3 className="font-normal uppercase">Average shift time:</h3>
                      <h3 className="font-bold sentence-case">{shiftData?.averageShiftSeconds} seconds</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 mt-8 flex justify-between">
            <div className="mt-4 flex flex-col gap-2">
              <h2 >
                Order: #{shiftData.quoteId}
              </h2>
              <h2 >
                Created: @{formattedDate}
              </h2>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <h2 >
                Something wrong?
              </h2>
              <h2>
                <Link href="/contact-us">Contact support</Link>
                <span className="mx-1">or</span>
                <button className="ml-1" onClick={() => {
                  setShiftData({})
                  setState(1)
                }}>Cancel order</button>
              </h2>

            </div>
          </div>
        </section>
      )
    }

    if (state===3) {
      return (
        <section className="bg-card rounded-sm shadow-md p-6 flex flex-col gap-y-6">
          <div>
            <h1 className="font-bold text-2xl md:text-3xl">Transaction successful !!!</h1>
          </div>

          <div className="flex gap-x-4">
            <Button onClick={handleShiftAgain} className="bg-primary text-muted font-bold">Shift again</Button>
            <Button onClick={handleHome} className="bg-primary text-muted font-bold">Home</Button>
          </div>
        </section>
      )
    }

    
}

export default Exchange