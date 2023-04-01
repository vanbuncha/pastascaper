# Recipe Scraper
This is a web scraper that scrapes recipe data from a website and saves it to a JSON file. The scraper is built using TypeScript and Cheerio.

# Usage
Install dependencies using npm install
Run the scraper using npm start
The scraped data will be saved to recipes.json in the root directory
# Configuration
You can configure the scraper by changing the url variable in the scrapeRecipes function. This variable should contain the URL of the website you want to scrape.

You can also adjust the delay between each request by changing the getRandomDelay function in the code.

# Dependencies
- axios
- cheerio
- fs
- util