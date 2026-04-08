namespace PomodoroWebAPI.Models
{
    public enum Category
    {
        Hat,
        Background,
        Pet,
        Sound
    }
    public class RewardItem
    {
        public int Id { get; set; }
        public string RewardName { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public Category Category { get; set; }
        public string ImageUrl { get; set; }
        public bool IsActive { get; set; } = false;
    }
}
