import { useState, useEffect } from 'react'
import useSignalR from "../useSignalR";
import { Alert, AlertDescription, AlertTitle } from "@/component/ui/alert"


export default function NewBiddingForm() {
    const { connection } = useSignalR("/r/auctionHub");
    const [errorExists, setErrorExists] = useState(false)

   
    useEffect(() => {
        if (!connection) {
        return
        }
        // listen for biddings from the server
        connection.on("ReceiveBidding", (bidding) => {
        // from the server
        console.log("Bidding from the server", bidding)
        })

        return () => {
            connection.off("ReceiveBidding")
        }
    }, [connection])

    const [auctionId, setAuctionId] = useState(0)
    const [biddingPrice, setBiddingPrice] = useState(0)

    const handleNewBidding = async (e: React.FormEvent<HTMLFormElement>) => {
        try {

            e.preventDefault()
    
            const result = await fetch('/api/bidding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                auctionId: auctionId,
                biddingPrice: biddingPrice
            })
            })
    
            const newBidding = await result.json()
            setErrorExists(false)
            setAuctionId(0)
            setBiddingPrice(0)
            return newBidding
        } catch (error) {
            console.error(error)
            setErrorExists(true)
            setAuctionId(0)
            setBiddingPrice(0)
        } 
    
  }

    return (
        <div className="flex flex-col justify-center items-center h-auto  m-5">
            <form onSubmit={handleNewBidding} className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="auctionId" className="block text-gray-700 font-bold mb-2">Auction ID:</label>
                    <input type="number" id="auctionId" name="auctionId" value={auctionId} onChange={(e) => setAuctionId(Number(e.target.value))}
                        className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div className="mb-4">
                <label htmlFor="biddingPrice" className="block text-gray-700 font-bold mb-2">Bidding Price:</label>
                    <input type="number" id="biddingPrice" name="biddingPrice" value={biddingPrice} onChange={(e) => setBiddingPrice(Number(e.target.value))}
                        className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div className="text-center">
                <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Place Your Bidding</button>
                </div>
                {/* <p>{connection ? "Connected" : "Not connected"}</p> */}

            </form>
            {/* <Toaster /> */}


        {
            errorExists && (
                <Alert className='m-5 shadow-lg'>
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription className='text-red-500'>
                        Bidding failed. Double check your input and try again.
                    </AlertDescription>
                </Alert>
            )
        }
        

        </div>
    )
}