const site = "https://dantri.com.vn/";

const puppeteer = require("puppeteer");
const download = require("image-downloader");
var fs = require("fs");

const folder = site.split("//")[1].split(".")[0];
const dir = `C:\\Users\\dungh\\Downloads\\${folder}\\`;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(site);

  const images = await page.evaluate(() => {
    let imgs = document.querySelectorAll("img");
    imgs = [...imgs];
    let images = imgs.map((img, index) => {
      let src = img.getAttribute("src");
      if (!src.includes("https")) src = "https:" + src;
      return src;
    });
    return images;
  });

  fs.mkdir(dir, async (err) => {
    if (err) console.log(err.message);
    try {
      await Promise.all(
        images.map((imgUrl) =>
          download.image({
            url: imgUrl,
            dest: dir,
          })
        )
      );
    } catch (err) {
      console.log(err.message);
    }
  });
  await browser.close();
  console.log("Done...");
})();
