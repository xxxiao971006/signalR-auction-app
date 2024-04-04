namespace AuctionApp.Models
{
    public class Bidding
    {
        public int Id { get; set; }
        public int AuctionId { get; set; }

        // Define the navigation property to represent the association with the Auction entity 
        // public Auction Auction { get; set; }
        public double BiddingPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
