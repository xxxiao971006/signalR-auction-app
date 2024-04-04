using Microsoft.AspNetCore.Mvc;
using AuctionApp.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using AuctionApp.Hubs;

namespace AuctionApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IHubContext<AuctionHub> _hub;

        public AuctionController(DatabaseContext context, IHubContext<AuctionHub> hub)
        {
            _context = context;
            _hub = hub;

        }

        // public AuctionController(DatabaseContext context)
        // {
        //     _context = context;
           
        // }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Auction>>> GetAuctions()
        {
            return await _context.Auctions.ToListAsync();
        }

        // GET: api/Auction
        [HttpGet("{id}")]
        public async Task<ActionResult<Auction>> GetAuctionItem(int id)
        {
            var AuctionItem = await _context.Auctions.FindAsync(id);

            if (AuctionItem == null)
            {
                return NotFound();
            }

            return AuctionItem;
        }

        // POST: api/Auction
        [HttpPost]
        public async Task<ActionResult<Auction>> CreateAuctionItem(Auction auction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // check if the new auction is already existed
            var existingAuction = await _context.Auctions
                .Where(a => a.Name == auction.Name)
                .FirstOrDefaultAsync();
            
            if (existingAuction != null)
            {
                return BadRequest("Auction with the same name already exists");
            }
            

             _context.Auctions.Add(auction);
            await _context.SaveChangesAsync();

            await _hub.Clients.All.SendAsync("ReceiveAuction", auction);


            return CreatedAtAction(nameof(GetAuctionItem), new { id = auction.Id }, auction);
        }
    }
}
