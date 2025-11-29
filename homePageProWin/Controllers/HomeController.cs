using homePageProWin.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Newtonsoft.Json;

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
            using (StreamReader r = new StreamReader("wwwroot/config/shortcuts_test.json"))
            {
                Console.WriteLine("Read shortcuts list");
                string json = r.ReadToEnd();
                List<Shortcuts> shortcutsList = JsonConvert.DeserializeObject<List<Shortcuts>>(json);

                String shortcuts = "";
                foreach (var shortcut in shortcutsList)
                {
                    Console.WriteLine(shortcut.name);
                    shortcuts += "<a id = \""+ shortcut.name + "\" href = \""+ shortcut.uri + "\" class=\"element prevent-select linkDraggable uri\" type=\""+ shortcut.type + "\">"
                            +"<div class=\"icon\"><img class=\"\" src=\"" + shortcut.icon +"\" on_error=\"this.src=null;this.src='./assets/styles/default/html.svg'\"></div>"
                    +"<label class=\"txt-white-shadow\">" + shortcut.name +"</label></a>";
                }

                return shortcuts;
            }
        }

        //public String shortcutCast()
        //{

        //}
    }
}