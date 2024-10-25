'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';

interface AmountProps {
    type: string;
    sendCoin: string;
    receiveCoin: string;

    exchangeReceive: number;
    setExchangeReceive: React.Dispatch<React.SetStateAction<number>>;

    exchangeSent: number;
    setExchangeSent: React.Dispatch<React.SetStateAction<number>>;

    sendCoinId: string;
    receiveCoinId: string;

    sendNetwork: string;
    receiveNetwork: string;
}

const Amount: React.FC<AmountProps> = ({
    receiveCoin,
    type,
    sendCoin,
    exchangeReceive,
    exchangeSent,
    setExchangeReceive,
    setExchangeSent,
    receiveCoinId,
    receiveNetwork,
    sendCoinId,
    sendNetwork,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>('0');
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (type === "send" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [type]);

    useEffect(() => {
        setInputValue(type === "send" ? exchangeSent.toString() : exchangeReceive.toString());
    }, [type, exchangeSent, exchangeReceive]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        const parsedValue = parseFloat(value);

        // Validate input and avoid NaN
        if (!value || isNaN(parsedValue) || parsedValue < 0) {
            setInputValue("0");
            setExchangeSent(0);
            setExchangeReceive(0);
            return;
        }

        setInputValue(value);

        if (type === "send") {
            setExchangeSent(parsedValue);
        } else {
            setExchangeReceive(parsedValue);
        }

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            fetchRate(value);
        }, 500); 

        setDebounceTimeout(newTimeout);
    };

    const fetchRate = async (amount: string) => {
        setIsLoading(true);
        setIsError(false);

        const url = `https://sideshift.ai/api/v2/pair/${sendCoinId}-${sendNetwork}/${receiveCoinId}-${receiveNetwork}`;
        console.log(url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch rate data");
            }

            const data = await response.json();
            const rate = parseFloat(data.rate);

            if (!isNaN(rate) && rate > 0) {
                setExchangeReceive(rate * parseFloat(amount));
            } else {
                setExchangeReceive(0);
            }
        } catch (error) {
            console.error("Error fetching rate data:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-0 mt-1 rounded-md shadow-sm">
            <div className="dark:bg-new-black bg-card absolute top-1 bottom-2 left-1 max-w-[6rem] z-10 flex items-center">
                <button
                    aria-label="Select token Amount you send"
                    className="dark:border-r-darker-gray border-r-new-black dark:bg-new-black
                    dark:text-flashbang-white bg-card text-new-black mx-2 flex h-full
                    cursor-default flex-col items-start justify-center p-0 text-lg"
                    type="button"
                >
                    <div className="flex place-items-center">
                        <span className="w-auto pr-2 text-left text-lg font-bold">
                            {type === "receive" ? receiveCoin : sendCoin}
                        </span>
                    </div>
                </button>
            </div>

            <div className="dark:bg-new-black bg-card">
                <div className="relative">
                    <Input
                        id="depositAmount"
                        autoComplete="off"
                        className="border-new-black dark:border-flashbang-white bg-card dark:bg-new-black
                        dark:invalid:border-punk-red invalid:border-punk-red input-text block h-20 w-full
                        rounded-md border border-b-[6px] px-6 text-lg focus-visible:outline-none
                        sm:text-xl font-display pr-6 pl-28 text-right rounded-t-none"
                        spellCheck="false"
                        name="depositAmount"
                        placeholder="0"
                        type="number"
                        min="0"
                        aria-controls="input-spinner"
                        onChange={handleChange}
                        value={inputValue}
                        ref={inputRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default Amount;
