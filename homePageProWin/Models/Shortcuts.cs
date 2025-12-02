namespace homePageProWin.Models
{
    public class Shortcuts
    {
        public String id { get; set; }
        public String type { get; set; }
        public bool blank { get; set; }
        public String name { get; set; }
        public String uri { get; set; }
        public String icon { get; set; }

        public List<Shortcuts> content;
        //public Array content { get; set; }
    }
}
