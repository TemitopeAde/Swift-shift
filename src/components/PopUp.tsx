'use client'

import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";


interface DataProps {
    id: string; 
    network: string;
    coin: string;
    name: string;
    iconUrl: string;
}

interface ItemsProps {
    value: string,
    title: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    data:  DataProps[] | undefined ,
    isError: boolean,
    isPending: boolean,
    type: string,
    error: unknown,
    sendImageUrl: string,
    receiveImageUrl: string,
    setSendImageUrl: React.Dispatch<React.SetStateAction<string>>;
    setReceiveImageUrl: React.Dispatch<React.SetStateAction<string>>;

    sendNetwork: string;
    setSendNetwork: React.Dispatch<React.SetStateAction<string>>;
    setReceiveNetwork: React.Dispatch<React.SetStateAction<string>>;
    receiveNetwork: string;

    sendCoinId: string
    receiveCoinId: string
    setSendCoinId: React.Dispatch<React.SetStateAction<string>>;
    setReceiveCoinId: React.Dispatch<React.SetStateAction<string>>;
}


const PopUp = ({
        data, 
        value, 
        setValue, 
        title, 
        isError, 
        isPending,
        type,
        error,
        sendImageUrl,
        receiveImageUrl,
        setSendImageUrl,
        setReceiveImageUrl,
        sendNetwork,
        setReceiveNetwork,
        receiveNetwork,
        setSendNetwork,
        receiveCoinId,
        sendCoinId,
        setReceiveCoinId,
        setSendCoinId
}: ItemsProps) => {
    const [open, setOpen] = useState(false);
    

    useEffect(() => {
        if (data) {
          const bitcoin = data.find((item) => item.name === "Bitcoin");
          const eth = data.find((item) => item.name === "Ethereum");
          
          if (bitcoin) {
            setReceiveImageUrl(bitcoin.iconUrl)
            setReceiveCoinId(bitcoin.coin)
          }

          if (eth) {
            setSendImageUrl(eth.iconUrl)
            setSendCoinId(eth.coin)
          }
        }
    }, [data, type, setValue, receiveImageUrl, sendImageUrl]);
    
    if (isPending) {
        return <Loader2 />;
    }

    if (isError) {
        console.log(error);
        return <div>Error loading data</div>;
    }

    if (data) {
        return (
            <>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger className="bg-gray-800">
                    <div className="flex justify-between gap-x-6 rounded-sm shadow-sm">
                        <Image
                            src={type === "Bitcoin" ? receiveImageUrl : sendImageUrl}
                            alt="icon"
                            height={100}
                            width={100}
                        />
            
                        <div className="flex flex-col gap-3">
                        <h3 className="text-left font-normal uppercase">{title}</h3>
                        <div className="flex flex-col gap-y-2">
                            <div className="flex items-center">
                            <h3 className="text-2xl lg:text-3xl font-bold text-justify">{value}</h3>
                        
                            </div>
            
                            <div className="flex">
                                <p className="sentence-case font-semibold text-justify text-sm">{type === "Bitcoin" ? receiveNetwork : sendNetwork} network</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Search crypto..." />
                        <CommandList>
                        <CommandEmpty>Not found.</CommandEmpty>
                        <CommandGroup>
                            {data?.map((item, id) => (
                            <CommandItem
                                key={id}
                                value={`${item.coin} ${item.network}`}
                                onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue); 
                                if (title === "YOU RECEIVE") { 
                                    setReceiveImageUrl(item.iconUrl);
                                    setReceiveNetwork(item.network);
                                    setReceiveCoinId(item.coin)
                                } else {
                                    setSendImageUrl(item.iconUrl);
                                    setSendNetwork(item.network);
                                    setSendCoinId(item.coin)
                                }
                                setOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-x-4">
                                <Image alt="" src={item.iconUrl} width={20} height={20} />
                                <div className="flex gap-y-1 flex-col">
                                    <h5>{item.name}</h5>
                                    <div className="flex gap-3">
                                    <h6>{item.coin}</h6>
                                    <h6>{item.network}</h6>
                                    </div>
                                </div>
                                </div>
                                <Check
                                className={cn("mr-2 h-4 w-4", value === item.name ? "opacity-100" : "opacity-0")}
                                />
                            </CommandItem>
                            ))}
                        </CommandGroup>
                        </CommandList>
                    </Command>
                    </PopoverContent>
                </Popover>
            </>
        )
    }

    
}

export default PopUp