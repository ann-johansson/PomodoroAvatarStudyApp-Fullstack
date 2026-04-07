using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PomodoroWebAPI.Models
{
    public class RewardPurchase
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public AppUser User { get; set; }
        public string ItemName { get; set; }
        public string ItemCategory { get; set; }
        public int PricePaid { get; set; }

        public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
    }
}
