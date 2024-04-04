namespace AuctionApp.Models;

public class Auction
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public double StartingPrice { get; set; }
    public double MinBiddingAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Bidding>? Biddings { get; set; }

}