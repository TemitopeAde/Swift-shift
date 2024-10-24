import { NextResponse } from "next/server"


export async function GET(request: Request) {
    const urls = new URL(request.url);
    const coinFrom = urls.searchParams.get("coinFrom")
    const coinTo = urls.searchParams.get("coinTo")
    const amount = urls.searchParams.get("amount")

    try {
        const url = `https://sideshift.ai/api/v2/pair/${coinFrom}/${coinTo}?amount=${amount}`
        
        const response = await fetch(url);
        const data = await response.json()

        if (!response.ok) {
            return NextResponse.error()
        }

        return NextResponse.json(data)
    } catch (error) {
        throw new Error("Something went wrong")
    }
}