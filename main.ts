import { load } from "cheerio";

const url = "https://thebierstein.com/draft-bottles/";

const response = await fetch(url);
const html = await response.text();
const $ = load(html);

const entries = $(".list-menu-item")
  .map((_, el) => {
    const [tapNumber, brewery] = $(el)
      .find(".list-menu-item__head span:nth-of-type(1)")
      .text()
      .split(".")
      .map((s) => s.trim());

    const name = $(el)
      .find(".list-menu-item__head span:nth-of-type(2)")
      .text()
      .trim();

    const location = $(el)
      .find(".list-menu-item__head span:nth-of-type(3)")
      .text()
      .trim();

    const [description, abvText] = $(el)
      .find(".list-menu-item__body")
      .text()
      .split("|")
      .map((s) => s.trim());

    const abv = parseFloat(abvText.replace(/[^0-9.]/g, ""));

    const prices = $(el)
      .find(".list-menu-item__table tbody tr")
      .map((_, row) => ({
        size: $(row).find("td").eq(0).text().trim(),
        price: $(row).find("td").eq(1).text().trim(),
      }))
      .get();

    const percentRemaining = parseFloat(
      $(el)
        .find(".list-menu-item__progress strong")
        .text()
        .replace(/[^0-9.]/g, "")
    );

    return {
      tapNumber,
      brewery,
      name,
      location,
      description,
      abv,
      prices,
      percentRemaining,
    };
  })
  .get();

console.log(JSON.stringify(entries, null, 2));
