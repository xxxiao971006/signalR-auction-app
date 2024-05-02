interface Auction {
  id: number,
  name: string,
  description: string,
  imageUrl: string,
  startingPrice: number,
  minBiddingAmount: number,
}

export default function AuctionCard({ auction }: { auction: Auction }) {
    return (
        <div className="card bg-gray-300 shadow-xl m-5 max-h-96">
            {/* <figure><img src="/dw.jpg" alt="Shoes" /></figure> */}
            <figure><img className="w-full" src={auction.imageUrl ? auction.imageUrl : "/dw.jpg"} alt={auction.name} /></figure>
            <div className="card-body">
                <h2 className="card-title text-blue-800">{auction.name} </h2>
                <h2 className="card-title text-blue-800">[Auction ID: {auction.id}] </h2>
                <p className="text-blue-800 text-pretty">Details: {auction.description}</p>
                <p className="text-blue-800">Starting Price: ${auction.startingPrice}</p>
                <p className="text-blue-800">Minimum Bid: ${auction.minBiddingAmount}</p>
                {/* <div className="card-actions justify-end">
                <button className="btn btn-primary">Place Your Bid Now</button>
                </div> */}
            </div>
            </div>
    )
}