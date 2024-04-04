import { useState, useEffect } from 'react'
import useSignalR from "../useSignalR";

// import { toast } from "sonner"

// import { Toaster } from "@/component/ui/sonner"


export default function NewAuctionForm() {
    const { connection } = useSignalR("/r/auctionHub");
    useEffect(() => {
        if (!connection) {
        return
        }
        // listen for auctions from the server
        connection.on("ReceiveAuction", (auction) => {
        // from the server
        console.log("Auction from the server", auction)
        // toast("New Auction Item", {
        //     description: auction.name,
        //     action: {
        //     label: "Start you bid now!",
        //     onClick: () => console.log("Cool!"),
        //     },
        // })
        })

        return () => {
            connection.off("ReceiveAuction")
        }
    }, [connection])

    const [newAuctionName, setNewAuctionName] = useState('')
    const [newAuctionStartingPrice, setNewAuctionStartingPrice] = useState(0)
    const [newAuctionMinBiddingAmount, setNewAuctionMinBiddingAmount] = useState(0)
    

    const handleNewAuction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const result = await fetch('/api/auction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newAuctionName,
            startingPrice: newAuctionStartingPrice,
            minBiddingAmount: newAuctionMinBiddingAmount
        })
        })


        await result.json()
        return result

    }

    return (
        <div className="flex justify-center items-center h-auto bg-gray-100 m-5">
            <form onSubmit={handleNewAuction} className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
                <input type="text" id="name" name="name" placeholder='Item Name' value={newAuctionName} onChange={(e) => setNewAuctionName(e.target.value)}
                    className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div className="mb-4">
                <label htmlFor="startingPrice" className="block text-gray-700 font-bold mb-2">Starting Price:</label>
                <input type="number" id="startingPrice" name="startingPrice" value={newAuctionStartingPrice} onChange={(e) => setNewAuctionStartingPrice(Number(e.target.value))}
                    className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div className="mb-4">
                <label htmlFor="minBiddingAmount" className="block text-gray-700 font-bold mb-2">Min Bidding Increment:</label>
                <input type="number" id="minBiddingAmount" name="minBiddingAmount" value={newAuctionMinBiddingAmount} onChange={(e) => setNewAuctionMinBiddingAmount(Number(e.target.value))}
                    className="w-full border bg-gray-300 text-blue-800 border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div className="text-center">
                <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Add New Auction Item</button>
                </div>
                
                {/* <p>{connection ? "Connected" : "Not connected"}</p> */}
                

            </form>
            {/* <Toaster /> */}

            </div>

    ) 
}
