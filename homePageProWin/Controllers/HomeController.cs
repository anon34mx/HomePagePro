using homePageProWin.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Newtonsoft.Json;

using Microsoft.Data.Sqlite;
using System;
using System.IO;


namespace homePageProWin.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            ViewData["Message"] = "texto";
            ViewBag.engines = this.loadSearchEngines();
            ViewBag.shortcuts = this.loadShortcuts();
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public String loadSearchEngines()
        {
            using (StreamReader r = new StreamReader("wwwroot/config/searchEngines.json"))
            {
                Console.WriteLine("Read search engines list");
                string json = r.ReadToEnd();
                List<SearchEngine> enginesList = JsonConvert.DeserializeObject<List<SearchEngine>>(json);

                int tabIndex = 4;
                int engineCount = 1;
                String engines = "";
                foreach (var engine in enginesList)
                {
                    //Console.WriteLine(engine.name);
                    engines += "<li onclick=\"searchss('"+engine.uri+"', '"+engine.parameter+"')\" tabindex=\""+tabIndex+"\" id=\""+engine.name+"\" onkeypress=\"$(this).click()\" class=\"searchEngine txt-shadow\" enginecount=\""+ engineCount + "\">" +
                        "<span style=\"display: flex;\"><img src=\"" +engine.icon+ "\" class=\"noselect\">" +engine.name+ "</span></li>";
                    tabIndex++;
                    engineCount++;
                }

                return engines;
            }
        }

        public String loadShortcuts()
        {
            string databasePath = Path.Combine(Environment.CurrentDirectory, "DB/shortcuts.db");
            string connectionString = $"Data Source={databasePath}";

            using (var connection = new SqliteConnection(connectionString))
            {
                String shortcuts = "";
                connection.Open();
                Console.WriteLine("Database connection opened successfully.");

                String sql="SELECT * FROM shortcuts";
                using var command = new SqliteCommand(sql, connection);
                using var reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        var id = reader.GetInt64(0);
                        var name = reader.GetString(1);
                        var uri = reader.GetString(2);
                        var icon = reader.GetString(3);
                        var blank = reader.GetBoolean(4);

                        Console.WriteLine($"{id}\t{name}\t{uri}");
                        shortcuts += "<a id = \"" + id + "\" href = \"" + uri + "\" class=\"element prevent-select linkDraggable uri\" type=\"link\">"
                                + "<div class=\"icon\"><img class=\"\" src=\"" + icon + "\" on_error=\"this.src=null;this.src='./assets/styles/default/html.svg'\"></div>"
                        + "<label class=\"txt-white-shadow\">" + name + "</label></a>";
                    }
                }
                return shortcuts;
            }
            
        }

        //public String shortcutCast()
        //{

    }
}