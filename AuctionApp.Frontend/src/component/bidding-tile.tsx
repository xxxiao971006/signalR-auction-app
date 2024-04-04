import { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

interface Bidding {
  id: number,
  auctionId: number,
  biddingPrice: number
}

export default function BiddingTile({ auctionId }: { auctionId: string }) {
  const [highestBidding, setHighestBidding] = useState<Bidding>({ id: 0, auctionId: 0, biddingPrice: 0 })
  const [currentPrice, setCurrentPrice] = useState(0)
  
  const fetchHighestBidding = async (auctionId: string) => {
    try {
      const result = await fetch(`/api/bidding/highestbidding/${auctionId}`);
    if (result.ok) {
      const highestBidding = await result.json();
      setHighestBidding(highestBidding);
      setCurrentPrice(highestBidding.biddingPrice);
    } else {
      console.error(`Failed to fetch highest bidding: ${result.status} - ${result.statusText}`);
    }
    } catch (error) {
      console.error('Error fetching highest bidding:', error);
    }
  }

  // update the highest bidding when the highestBidding changes
  useEffect(() => {
    fetchHighestBidding(auctionId);
  }, [auctionId]);

  // update the highest bidding when a new bidding is placed
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/r/auctionHub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      connection.on("ReceiveBidding", (bidding: Bidding) => {
        if (bidding.auctionId === parseInt(auctionId)) {
          setHighestBidding(bidding);
          setCurrentPrice(bidding.biddingPrice);
        }
      });
    });

    return () => {
      connection.stop();
    };
  }, [auctionId]);


  return (
    highestBidding.id !== 0 ? 
      (
        <div className="flex justify-center items-center h-auto bg-gray-100 m-5">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-4 text-blue-800">
              Current Bidding Price: <p className='font-bold'>${currentPrice}</p>
            </div>
          </div>
        </div>
      ) 
      : 
      (
        <div className="flex justify-center items-center h-auto bg-gray-100 m-5">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-4 text-blue-800">
              No Bidding Yet
            </div>
          </div>
        </div>
      )
  );
}
