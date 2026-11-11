const fs = require("fs");
const path = require("path");

const viewsnap_data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "viewsnaps.json"), "utf-8"));
const base_site_input = fs.readFileSync(path.join(__dirname, "base.html"), "utf-8");

// comparator will make me really sad otherwise
const map_names = [ "00/01", "02/03", "04/05", "06/07", "08", "09", "10", "11/12", "13", "14", "15", "16", "17", "18", "19", "e00", "e01", "e02" ];

if (!fs.existsSync(path.join(__dirname, "dist"))) fs.mkdirSync(path.join(__dirname, "dist"));

fs.copyFileSync(path.join(__dirname, "index.html"), path.join(__dirname, "dist", "index.html"));
fs.copyFileSync(path.join(__dirname, "style.css"), path.join(__dirname, "dist", "style.css"));

for (const category_name of Object.keys(viewsnap_data)) {
    const category_data = viewsnap_data[category_name];
    let site_output = base_site_input.replace("{category}", category_name);
    let cat_output_html = "";
    
    for (const map_name of map_names) {

        const map_data = category_data[map_name];
        if (!map_data) continue;

        cat_output_html += "<hr>\n";
        cat_output_html += `<h2>${map_name}</h2>\n`;

        for (const route of map_data) {
            cat_output_html += `<h3 style="display: inline;" class="${route.difficulty}">${route.name}</h3>\n`;
            cat_output_html += `<h4>${route.description}</h4>\n`;

            for (const snap of route.snaps) {
                // is it getting nested in here? :sweat:
                cat_output_html += "<p>\n";
                cat_output_html += `<code data-necessary="${snap.necessary}">${snap.value}</code>\n`
                cat_output_html += `<span>— ${snap.description}</span>\n`
                cat_output_html += "</p>\n";
            }

            cat_output_html += "<br>\n";
        }

    }

    site_output = site_output.replace("<!-- TO BE REPLACED BY BUILD -->", cat_output_html);

    if (!fs.existsSync(path.join(__dirname, "dist", category_name))) fs.mkdirSync(path.join(__dirname, "dist", category_name));
    fs.writeFileSync(path.join(__dirname, "dist", category_name, "index.html"), site_output);
}

