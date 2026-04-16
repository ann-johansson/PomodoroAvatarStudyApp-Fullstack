namespace PomodoroWebAPI.Models
{
    // Enum to represent the different categories of rewards available in the system
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
        public Category Category { get; set; } // using the Category enum to specify the category of the reward
        public string ImageUrl { get; set; }
        public bool IsActive { get; set; } = false;
    }
}
