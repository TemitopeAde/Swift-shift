// import { getAllCrytos } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";

interface Cryptocurrency {
  id: string;
  network: string;
  coin: string;
  name: string;
  iconUrl: string;

  depositCoin: string;
  settleCoin: string
}

interface fetchProps {
  url: string,
  queryParams: string[]
}

export const Query = ({url, queryParams}: fetchProps) => {
  
  const { isPending, isError, data, error } = useQuery<Cryptocurrency[]>({
    queryKey: queryParams || [],
    queryFn: async () => {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Error fetching data")
      }

      return response.json()
    }
  });

  if (data) {
    console.log(data);
  }
  
  
  return {
    isPending,
    isError,
    data,
    error
  }
};

export default Query;