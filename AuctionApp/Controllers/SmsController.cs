using Microsoft.AspNetCore.Mvc;
using Twilio;
using Twilio.Rest.Api.V2010.Account;


namespace TwilioApp.Controllers
{
    public class SubscriptionData
    {
        public string PhoneNumber { get; set; }
        public int AuctionId { get; set; }
        public decimal BiddingPrice { get; set; }
    }

    public class SubscriptionNumber
    {
        public string PhoneNumber { get; set; }
    }
    

    [ApiController]
    [Route("api/[controller]")]
    public class SendSMSController : ControllerBase
    {        
        string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

        [HttpPost("SendSubscription")]
        public IActionResult SendSubscription([FromBody] SubscriptionNumber data)
        {
            TwilioClient.Init(accountSid, authToken);

            var message = MessageResource.Create(
                body: "You are subscribed to the Doctor Who's auction.",
                from: new Twilio.Types.PhoneNumber(Environment.GetEnvironmentVariable("TWILIO_PHONE_NUMBER")),
                to: new Twilio.Types.PhoneNumber(data.PhoneNumber)
            );
            return StatusCode(200, new { message.Sid });
        }

        [HttpPost("SendText")]
        public IActionResult SendText([FromBody] SubscriptionData data)
        {
            
            TwilioClient.Init(accountSid, authToken);

            var message = MessageResource.Create(
                body: $"The auction item #{data.AuctionId} now has bidding price ${data.BiddingPrice}.",
                from: new Twilio.Types.PhoneNumber(Environment.GetEnvironmentVariable("TWILIO_PHONE_NUMBER")),
                to: new Twilio.Types.PhoneNumber(data.PhoneNumber)
            );
            return StatusCode(200, new { message.Sid });
        }
    }
}