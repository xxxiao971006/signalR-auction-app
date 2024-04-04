using Microsoft.AspNetCore.Mvc;
using AuctionApp.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using AuctionApp.Hubs;


namespace BiddingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BiddingController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IHubContext<AuctionHub> _hub;

        public BiddingController(DatabaseContext context, IHubContext<AuctionHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        [HttpGet] // GET: api/Bidding
        public async Task<ActionResult<IEnumerable<Bidding>>> GetBiddings()
        {
            return await _context.Biddings.ToListAsync();
        }

        [HttpGet("highestbidding/{auctionId}")]
        public async Task<ActionResult<Bidding>> GetHighestBidding(int auctionId)
        {
            // Filter biddings by auction ID and find the highest bidding
            var highestBidding = await _context.Biddings
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.BiddingPrice)
                .FirstOrDefaultAsync();

            if (highestBidding == null)
            {
                return NotFound(); // Return 404 Not Found if no biddings are found
            }

            return highestBidding;
        }

        // GET: api/Bidding/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Bidding>> GetBiddingItem(int id)
        {
            var BiddingItem = await _context.Biddings.FindAsync(id);

            if (BiddingItem == null)
            {
                return NotFound();
            }

            return BiddingItem;
        }

        // POST: api/Bidding
        [HttpPost]
        public async Task<ActionResult<Bidding>> CreateBiddingItem(Bidding bidding)
        {
            // Retrieve the corresponding auction from the database based on the auctionId
            var auction = await _context.Auctions.FindAsync(bidding.AuctionId);
            if (auction == null)
            {
                return NotFound($"Auction with ID {bidding.AuctionId} not found");
            }

            // Check if the bidding price is greater than the current highest bidding and it is greater than the starting price
            var highestBidding = await _context.Biddings
                .Where(b => b.AuctionId == bidding.AuctionId)
                .OrderByDescending(b => b.BiddingPrice)
                .FirstOrDefaultAsync();
            
            if (highestBidding != null && bidding.BiddingPrice < highestBidding.BiddingPrice + auction.MinBiddingAmount)
            {
                return BadRequest("Bidding price must be greater than or equal to the current highest bidding plus the minimum bidding amount");
               
            }

            if (bidding.BiddingPrice < auction.StartingPrice + auction.MinBiddingAmount)
            {
              
                return BadRequest("Bidding price must be greater than or equal to the current highest bidding plus the minimum bidding amount");
                
            }

            // Add the bidding to the context
            _context.Biddings.Add(bidding);

            // Save changes to the database
            await _context.SaveChangesAsync();

            await _hub.Clients.All.SendAsync("ReceiveBidding", bidding);

            // Return the created bidding
            return CreatedAtAction(nameof(GetBiddingItem), new { id = bidding.Id }, bidding);
        }

    }
}
