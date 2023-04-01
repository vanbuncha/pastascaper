import cheerio from "cheerio";
import axios from "axios";
import fs from "fs";
import { promisify } from "util";

interface Recipe {
  title: string;
  link?: string;
}

interface RecipeWithIngredients extends Recipe {
  ingredients?: string[];
  image?: string;
}

const sleep = promisify(setTimeout);
// For not so robotic delay
function getRandomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function scrapeRecipes() {
  const url = "https://www.jamieoliver.com/recipes/pasta-recipes/";
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const recipes: Recipe[] = [];

  $(".recipe-block").each((index, element) => {
    const recipeTitle = $(element).find(".recipe-title").text();
    const fullLink: string =
      "https://www.jamieoliver.com" + $(element).find("a").attr("href")!;
    const imageLink: string = $(element).find("img").attr("src")!;

    //  Add recipes to the array so I can loop through them
    recipes.push({
      title: recipeTitle,
      link: fullLink,
    });
  });

  const recipesWithIngredients: RecipeWithIngredients[] = [];

  for (let recipe of recipes) {
    const recipeWithIngredients: RecipeWithIngredients = {
      title: recipe.title,
      link: recipe.link,
      ingredients: [],
      image: "",
    };

    const fullLink: string = recipe.link!;

    const recipeResponse = await axios.get(fullLink);
    const $ = cheerio.load(recipeResponse.data);

    $(".ingred-list li").each((index, element) => {
      const ingredient = $(element).text().trim().replace(/\s+/g, " ");
      if (recipeWithIngredients.ingredients) {
        recipeWithIngredients.ingredients.push(ingredient);
      }
    });

    const imageLink: string = $(".hero-wrapper img").attr("src")!;
    recipeWithIngredients.image = imageLink;

    recipesWithIngredients.push(recipeWithIngredients);

    // Wait for random amout of time
    await sleep(getRandomDelay(600, 100));
  }

  const output = JSON.stringify(recipesWithIngredients, null, 2);
  fs.writeFileSync("recipes.json", output);
}

scrapeRecipes();
