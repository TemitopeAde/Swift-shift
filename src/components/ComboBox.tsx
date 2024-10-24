import Query from "./Query";
import PopUp from "./PopUp";

interface ButtonsProps {
  sendNetwork: string;
  setSendNetwork: React.Dispatch<React.SetStateAction<string>>;
  setReceiveNetwork: React.Dispatch<React.SetStateAction<string>>;
  receiveNetwork: string;

  type: string;
  title: string;
  value: string;
  sendImageUrl: string;
  receiveImageUrl: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setSendImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setReceiveImageUrl: React.Dispatch<React.SetStateAction<string>>;

  sendCoinId: string
  receiveCoinId: string
  setSendCoinId: React.Dispatch<React.SetStateAction<string>>;
  setReceiveCoinId: React.Dispatch<React.SetStateAction<string>>;
}

interface fetchProps {
  url: string
}

export function ComboBox({
  sendNetwork,
  setReceiveNetwork,
  receiveNetwork,
  setSendNetwork,
  type,
  title,
  value,
  setValue,
  sendImageUrl,
  receiveImageUrl,
  setSendImageUrl,
  setReceiveImageUrl,
  receiveCoinId,
  sendCoinId,
  setReceiveCoinId, 
  setSendCoinId
}: ButtonsProps) {

  const url = "/all-cryptos"
  const queryParams = ["all-cryptos"]
  const { isPending, isError, data, error } = Query({url, queryParams});


  return (
    <PopUp
      data={data}
      setValue={setValue}
      value={value}
      title={title}
      isError={isError}
      isPending={isPending}
      error={error}
      type={type}
      sendImageUrl={sendImageUrl}
      receiveImageUrl={receiveImageUrl}
      setSendImageUrl={setSendImageUrl}
      setReceiveImageUrl={setReceiveImageUrl}
      
      sendNetwork={sendNetwork}
      setReceiveNetwork={setReceiveNetwork}
      receiveNetwork={receiveNetwork}
      setSendNetwork={setSendNetwork}

      receiveCoinId={receiveCoinId}
      sendCoinId={sendCoinId}
      setReceiveCoinId={setReceiveCoinId}
      setSendCoinId={setSendCoinId}
    />
  );
}
