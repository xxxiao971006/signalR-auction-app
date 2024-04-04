import { useEffect, useState } from "react"
import useSignalR from "./useSignalR";

import NewAuctionForm from "./component/new-auction-form"
import NewBiddingForm from "./component/new-bidding-form"
import AuctionCard from "./component/auction-card";
import BiddingTile from "./component/bidding-tile";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/component/ui/popover"
import { toast } from "sonner"
import { Toaster } from "@/component/ui/sonner"
import { Button } from "@/component/ui/button"
import { Input } from "@/component/ui/input"

interface Auction {
  id: number,
  name: string,
  startingPrice: number,
  minBiddingAmount: number,
}

interface Bidding {
  id: number,
  auctionId: number,
  biddingPrice: number,

}

export default function App() {
  const { connection } = useSignalR("/r/auctionHub");

  const [auctions, setAuctions] = useState<Auction[]>([])
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleBiddingSMS = async ( bidding: Bidding, phoneNumber: string ) => {
      console.log(phoneNumber)

      try {
      const result = await fetch('/api/SendSMS/SendText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          auctionId: bidding.auctionId,
          biddingPrice: bidding.biddingPrice
,        })
      })
      const subscription = await result.json()
      console.log(subscription)
      return subscription
    } catch (error) {
      console.error(error)
    }
  }

  // listen for auctions from the server
  useEffect(() => {
      if (!connection) {
      return
      }
      // listen for messages from the server
      connection.on("ReceiveAuction", (auction) => {
      // from the server
      if (auction) {
          console.log("Auction from the server", auction)
          setAuctions((auctions) => [...auctions, auction])
          toast("New Auction Item", {
          description: auction.name,
          action: {
          label: "Start you bid now!",
          onClick: () => console.log("Cool!"),
          },
      })
      }
      })

      return () => {
          connection.off("ReceiveAuction")
      }
  }, [connection])

  // listen for biddings from the server
  useEffect(() => {
      if (!connection) {
        return
      }
      // listen for messages from the server
      connection.on("ReceiveBidding", (bidding) => {
      // from the server
      console.log("Bidding from the server", bidding)
      toast("New Bidding Just Placed", {
          description: `$${bidding.biddingPrice}`,
          action: {
          label: "Now it's your turn!",
          onClick: () => console.log("Cool!"),
          },
      })
      console.log(phoneNumber)
      handleBiddingSMS(bidding, phoneNumber)
      })

      return () => {
          connection.off("ReceiveBidding")
      }
  }, [connection, phoneNumber])

  const fetchAuctions = async () => {
    const result = await fetch('/api/auction')
    const auctions = await result.json()
    setAuctions(auctions)
  }

  // fetch auctions and biddings on initial render
  useEffect(() => {
    fetchAuctions()
    // fetchBiddings()
  }, [])

  const handleSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const result = await fetch('/api/SendSMS/SendSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber
        })
      })
      const subscription = await result.json()
      console.log(subscription)
      // setPhoneNumber("")
      return subscription
    } catch (error) {
      console.error(error)
      // setPhoneNumber("")
    }
  }

  return (
    <div className="bg-gray-100">
      <h1 className='bg-blue-900 text-white p-4 text-4xl text-center'>
        <p>Doctor Who's Auction</p>
        <p>{connection ? "👽" : "👿"}</p>
      </h1>

      <div className="mb-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold my-4 text-center text-blue-900">Auctions</h2>
        <div className="mb-8 flex flex-col items-center justify-center ">
          <h3 className="text-xl font-bold my-4 text-gray-700">Bidding Rules</h3>
        <ul className="flex flex-col text-gray-500 ">
          <li>1. Make sure you bid on the item with a valid Auction ID.</li>
          <li>2. Your bidding price must be:</li>
          <li className="ml-4 font-bold">Higher than the starting price plus the minimum bidding increment.</li>
          <li className="ml-4 font-bold">Higher than the previous highest bidding price plus the minimum bidding increment.</li>
          </ul>
        </div>

        <p>Subscribe to the latest bidding status when you are offline</p> 
        <form onSubmit={handleSubscription}>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="phone" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <Button type="submit">Subscribe</Button>
          </div>
        </form>
        

        <div className="grid grid-cols-1 lg:grid-cols-3  items-baseline justify-center">
          {auctions.map(auction => (
            <div key={auction.id} className="flex flex-col items-center justify-center h-max">
              <AuctionCard auction={auction} />
              <BiddingTile auctionId={String(auction.id)} />
            </div>
          ))}
        </div>

      </div>

      <div className="flex items-baseline justify-center">
        <Popover>
          <PopoverTrigger className="m-5 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">New Auction Item</PopoverTrigger>
          <PopoverContent><NewAuctionForm /></PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="m-5 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Place Your Bidding</PopoverTrigger>
          <PopoverContent><NewBiddingForm /></PopoverContent>
        </Popover>

      </div>
      
      <Toaster />


    </div>
  )
}

