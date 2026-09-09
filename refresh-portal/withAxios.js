const axios = require("axios");
const cheerio = require("cheerio");

const URL = "http://quickwave.wifi/login";

async function run() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const link = $("a:contains('Click Here To Start Free Trial')").attr("href");

    if (link) {
      await axios.get(link);
      console.log("[+] Free trial clicked:", link);
    } else {
      console.log("[*] Already connected or link not found");
    }
  } catch (e) {
    console.error("[-] Failed:", e.message);
  }
}

run();