interface Auction {
  id: number,
  name: string,
  startingPrice: number,
  minBiddingAmount: number,
}

export default function AuctionCard({ auction }: { auction: Auction }) {
    return (
        <div className="card  bg-gray-300 shadow-xl m-5">
            <figure><img src="/dw.jpg" alt="Shoes" /></figure>
            <div className="card-body">
                <h2 className="card-title text-blue-800">{auction.name} - [Auction ID: {auction.id}] </h2>
                <p className="text-blue-800">Starting Price: ${auction.startingPrice}</p>
                <p className="text-blue-800">Minimum Bid: ${auction.minBiddingAmount}</p>
                {/* <div className="card-actions justify-end">
                <button className="btn btn-primary">Place Your Bid Now</button>
                </div> */}
            </div>
            </div>
    )
}