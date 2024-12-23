import { load } from "cheerio";

const url = "https://thebierstein.com/draft-bottles/";

const response = await fetch(url);
const html = await response.text();
const $ = load(html);

console.log($("title").text());
