/******************************************************************************
*   dbio.js
*
*   Author: Zachary Colbert <zcolbert@sfsu.edu>
*
*   Description:
*       Database I/O - Exposes the client-facing database queries.
******************************************************************************/
const con = require("./dbconnection.js");
const dbins = require("./inserthelpers.js");
const dbread = require("./readhelpers.js");


/**
 * Consolidate a set of rows together based on the Recipe ID.
 *
 * Joined queries return a set of rows which may contain
 * information about a single recipe, spanning across several
 * individual rows. This function combines the relevant rows 
 * for each recipe and returns a list of complete recipe records.
 *
 * @param rows A list of rows returned from a database query.
 * @return A set of complete Recipe records in JSON format.
 */
function consolidateRecipeRows(rows) {

    var consolidated = {};
    // Each row returned represents single ingredient for a given recipe. 
    // The recipe's actual ingredient list may span several rows, 
    // so these records must be consolidated such that there is only 
    // one record for each Recipe ID which contains all related ingredients.
    for (var rowid in rows) {

        var row = rows[rowid];
        // If there is no key for this recipe's ID, add it to the dict
        if (!(consolidated[row.RecipeId])) {
            // Create a new entry with this recipe's data
            // If the value of a field is NULL, insert an empty string instead.
            consolidated[row.RecipeId] = { 
                "name":         row.RecipeName ? row.RecipeName : '',
                "summary":      row.Summary ? row.Summary : '',
                "prep":         row.Prep ? row.Prep : '',
                "cook":         row.Cook ? row.Cook : '',
                "servings":     row.Servings ? row.Servings : '',
                "yield":        row.Yield ? row.Yield : '',
                "category":     row.Category ? row.Category : '',
                "directions":   row.Directions ? row.Directions : '',
                "image":        row.ImageURL ? row.ImageURL : ''
            };
            consolidated[row.RecipeId].ingredients = [];
        }
        // Add this ingredient to the recipe associated
        // with the current row's recipe ID
        consolidated[row.RecipeId].ingredients.push(
            { 
                "name": row.IngredientName,
                "quantity": row.Quantity,
                "units": row.Units
            }
        );
    }
    return consolidated;
}


/**
 * Convert a recipe from the requested format into a valid JSON object
 * that will be accepted by createRecipe()
 * 
 * NOTE: This funtion is a temporary fix until we can make the 
 * create recipe form send the proper format with the post request.
 */
function recipeToJSON(recipe) {

    var obj = {}

    obj['name'] = recipe['name'];
    obj['summary'] = recipe['summary'];
    obj['prep'] = recipe['prep'];
    obj['cook'] = recipe['cook'];
    obj['servings'] = recipe['servings'];
    obj['directions'] = recipe['directions'];
    obj['yields'] = recipe['yields'];
    obj['category'] = recipe['category'];
    obj['image'] = recipe['image'];

    obj['ingredients'] = [];

    var ingredients = recipe['ingredients'].trim(';').split(';');

    for (var i in ingredients) {
        var parts = ingredients[i].trim().split("  ");
        if (parts.length >= 3) {
            obj['ingredients'].push({
                'quantity': parts[0].trim(),
                'units': parts[1].trim(),
                'name': parts[2].trim()
            });
        }
    }

    return obj;
}


/**
 * Get all recipes in the database.
 *
 * @return A promise for a list of Recipes in JSON format.
 */
async function getAllRecipes() {

    const sql = "SELECT Recipe.Id AS RecipeId,"
              + " Recipe.Name AS RecipeName,"
              + "   Recipe.Summary,"
              + "   Recipe.Prep,"
              + "   Recipe.Cook,"
              + "   Recipe.Servings,"
              + "   Recipe.Yield,"
              + "   Recipe.Category,"
              + "   Recipe.Directions,"
              + "   Recipe.ImageURL,"
              + "   Ingredient.Name AS IngredientName,"
              + "   RecipeIngredient.Quantity,"
              + "   RecipeIngredient.Units"
              + " FROM Recipe"
              + " INNER JOIN RecipeIngredient"
              + "   ON RecipeIngredient.RecipeId=Recipe.Id"
              + " INNER JOIN Ingredient"
              + "   ON RecipeIngredient.IngredientId=Ingredient.Id;"

    return new Promise((resolve, reject) => {
        con.query(sql, [], (err, rows, fields) => {
            if (err) {
                return reject(err);
            }

            var all = consolidateRecipeRows(rows);
            resolve(all);
        });
    });
}


/**
 * Get all recipes that match the given keywords.
 *
 * The keywords will be matched against: <br>
 * - The recipe's name <br>
 * - Each of recipe's ingredient names <br>
 * - Each label associated with the recipe <br>
 *
 * @param keywords A list of string keywords used as search terms.
 * @return A promise for a list of matching Recipes in JSON format.
 */
function getRecipesBySearchTerms(keywords) {

    var keyword_wildcards = [];
    for (var k in keywords) {
        keyword_wildcards.push(`'%${keywords[k]}%'`);
    }

    var recipe_condition = "(Recipe.Name LIKE ";
    recipe_condition += keyword_wildcards.join(` AND Recipe.Name LIKE `);
    recipe_condition += ")";

    var sql = "SELECT"
                + " Recipe.Id AS RecipeId,"
                + " Recipe.Name AS RecipeName,"
                + " Recipe.*,"
                + " Ingredient.Name AS IngredientName,"
                + " RecipeIngredient.Quantity,"
                + " RecipeIngredient.Units"
                + " FROM Recipe" 
                + "   INNER JOIN RecipeIngredient"
                + "     ON Recipe.Id = RecipeIngredient.RecipeId"
                + "   INNER JOIN Ingredient"
                + "     ON Ingredient.Id = RecipeIngredient.IngredientId"
                + ` WHERE ${recipe_condition};`;

    return new Promise((resolve, reject) => {

        con.query(sql, [], (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            var all = consolidateRecipeRows(rows);
            resolve(all);
        });
    });
}


/**
 * Get all recipes that match the given keywords but do
 * not match the given list of IDs.
 *
 * The keywords will be matched against: <br>
 * - The recipe's name <br>
 * - Each of recipe's ingredient names <br>
 * - Each label associated with the recipe <br>
 *
 * @param keywords A list of string keywords used as search terms.
 * @param excludeIds A list of recipe ids used to filter the search.
 * @return A promise for a list of matching Recipes in JSON format.
 */
function getRecipesBySearchTermsExcludeIds(keywords, excludeIds) {

    var keyword_wildcards = [];
    for (var k in keywords) {
        keyword_wildcards.push(`'%${keywords[k]}%'`);
    }

    var recipe_condition = "(Recipe.Name LIKE ";
    recipe_condition += keyword_wildcards.join(` AND Recipe.Name LIKE `);
    recipe_condition += ")";

    var sql = "SELECT"
                + " Recipe.Id AS RecipeId,"
                + " Recipe.Name AS RecipeName,"
                + " Recipe.*,"
                + " Ingredient.Name AS IngredientName,"
                + " RecipeIngredient.Quantity,"
                + " RecipeIngredient.Units"
                + " FROM Recipe" 
                + "   INNER JOIN RecipeIngredient"
                + "     ON Recipe.Id = RecipeIngredient.RecipeId"
                + "   INNER JOIN Ingredient"
                + "     ON Ingredient.Id = RecipeIngredient.IngredientId"
                + ` WHERE ${recipe_condition}`
                + " AND Recipe.Id NOT IN (?);";

    return new Promise((resolve, reject) => {

        con.query(sql, [excludeIds], (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            var all = consolidateRecipeRows(rows);
            resolve(all);
        });
    });
}


/**
 * Retrieve a recipe by searching for a given ID number.
 *
 * @recipeid An integer representing the recipe's ID number.
 * @return A JSON object containing the recipe's data.
 */
function getRecipeById(recipeid) {

    const sql = "SELECT"
                + " Recipe.Id AS RecipeId,"
                + " Recipe.Name AS RecipeName,"
                + " Recipe.*,"
                + " Ingredient.Name AS IngredientName,"
                + " RecipeIngredient.Quantity,"
                + " RecipeIngredient.Units"
                + " FROM Recipe" 
                + "   INNER JOIN RecipeIngredient"
                + "     ON Recipe.Id = RecipeIngredient.RecipeId"
                + "   INNER JOIN Ingredient"
                + "     ON Ingredient.Id = RecipeIngredient.IngredientId"
                + ` WHERE Recipe.Id=?;`;

    return new Promise((resolve, reject) => {

        con.query(sql, [recipeid], (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            var all = consolidateRecipeRows(rows);
            resolve(all[recipeid]);
        });
    });
}


/**
 * Add a recipe to the meal plan
 *
 * @param accountId The account ID for the user that owns this meal plan.
 * @param recipeId The ID of the recipe to be added.
 * @param onDate A date string in the format "YYYY-MM-DD"
 */
function addRecipeToMealPlan(accountId, recipeId, onDate) {

    const sql = "INSERT INTO MealPlan (AccountId, RecipeId, OnDate, MealNum)"
              + " VALUES (?, ?, ?, ?);";

    return new Promise((resolve, reject) => {

        con.query(sql, 
            [accountId, recipeId, onDate, 1],  // Note: Just using meal #1 for now
            (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });

}


/**
 * Delete a recipe to the meal plan
 *
 * @param accountId The account ID for the user that owns this meal plan.
 * @param recipeId The ID of the recipe to be removed.
 * @param onDate A date string in the format "YYYY-MM-DD"
 */
function deleteRecipeFromMealPlan(accountId, recipeId, onDate) {

    const sql = "DELETE FROM MealPlan WHERE AccountId=? AND RecipeId=? AND OnDate=?";

    return new Promise((resolve, reject) => {

        con.query(sql, 
            [accountId, recipeId, onDate, 1],  // Note: Just using meal #1 for now
            (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}


/**
 * Move an existing meal plan recipe to a new date.
 *
 * @param accountId The account ID for the user that owns this meal plan.
 * @param recipeId The ID of the recipe to be moved.
 * @param onDate A date string in the format "YYYY-MM-DD"
 */
function moveRecipeToNewDate(accountId, recipeId, oldDate, newDate) {

    const sql = "UPDATE MealPlan SET OnDate=? WHERE AccountId=? AND RecipeId=? AND OnDate=?";

    return new Promise((resolve, reject) => {

        con.query(sql, 
            [newDate, accountId, recipeId, oldDate],
            (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve("move success");
        });
    });
}


/*
 * Get all recipes from the meal plan.
 *
 * @return A list of recipe ids with their respective dates and names.
 */
function getAllMealPlanRecipes(accountId) {

    const sql = "SELECT RecipeId, OnDate AS Date, Recipe.Name"
                + " FROM MealPlan"
                + " INNER JOIN Recipe ON Recipe.Id=RecipeId"
                + " WHERE MealPlan.AccountId=?;"

    return new Promise((resolve, reject) => {

        con.query(sql, [accountId], 
            (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}


/**
 * Create a recipe from a JSON object.
 *
 * @param accountId The existing account ID to associate with this recipe.
 * @param recipe A JSON structure containing the recipe's data.
 */
async function createRecipe(accountId, recipe) {
    // Insert the recipe into the recipe table
    dbins._insertRecipe(accountId, recipe.name, recipe.directions, recipe.URL);
    
    // Retrieve the ID of the recipe
    var recipeId = await dbread._getRecipeId(recipe.name);

    // Create associations for all of this recipe's ingredients
    for (var i in recipe.ingredients) {
        // Create entry in Ingredient table
        var ingredient = recipe.ingredients[i];
        dbins._insertIngredient(ingredient.name);
        // Create association for this recipe and ingredient
        var ingredientId = await dbread._getIngredientId(ingredient.name);
        dbins._insertRecipeIngredient(recipeId, ingredientId, ingredient.quantity, ingredient.units);
    }

    return recipeId;
}


/**
 * Get up to the N most frequently occuring recipe ids from the meal plan.
 *
 * @param accountId The account ID of the owner of the meal plan to be searched.
 * @param numRequested The number of recipe IDs to retrieve.
 * @return A list of recipe IDs and their associated frequency, 
 *         in descending order of frequency.<br>
 *         If fewer than N entries exist in the meal table, the length of the return
 *         value will be the total number of unique recipe ids in the meal plan.
 */
function getNMostFrequentRecipeIds(accountId, numRequested) {

    const sql = "SELECT RecipeId, COUNT(RecipeId) AS MealFreq"
                + " FROM MealPlan WHERE AccountId=?"
                + " GROUP BY RecipeId"
                + " ORDER BY MealFreq DESC"
                + " LIMIT ?;";

    return new Promise((resolve, reject) => {

        con.query(sql, 
            [accountId, numRequested],  
            (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}


/**
 * Get a list of N random recipe ids. 
 *
 * @param numRequested The number of recipes to retrieve.
 * @return A list of `numRequested` quantity recipes. If
 *         fewer recipes than `numRequested`exist, then 
 *         the entire set is returned.
 */
function getNRandomRecipeIds(numRequested) {

    const sql = "SELECT Id FROM Recipe ORDER BY RAND() LIMIT ?;";

    return new Promise((resolve, reject) => {

        con.query(sql, 
            [numRequested],  
            (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}


/**
 * Get a list of recipe names associated with the given list of IDs.
 *
 * @param idList The list of IDs to search.
 * @return The list of names matching the given IDs, if they exist.
 */
function getRecipeNamesByIdList(idList) {

    const sql = "SELECT Name FROM Recipe WHERE Id IN (?);";

    return new Promise((resolve, reject) => {

        con.query(sql, 
            [idList],  
            (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}


/**
 * Get a list of recipe suggestions based on the user's meal plan history.
 *   
 * This function uses the following algorithm to generate suggestions:<br>
 *   1. Get a list of the user's most frequent meals from the meal plan <br>
 *   2. If there are fewer than numRequested unique recipes in the meal plan,
 *      retrieve random recipe IDs to fill the delta.<br>
 *   3. Retrieve the names of each of the above recipes and use the names
 *      to generate a unique list of keywords.<br>
 *   4. Search the database for recipes matching these keywords, that do not
 *      include the ID numbers of the recipes that were used to generate 
 *      the word list in the first place.<br>
 *   5. Return the list of resulting recipes, truncated to `numRequested`.<br>
 *
 * @param accountId The account id of the user who owns the meal plan.
 * @param numRequested The desired number of suggestions. If this value
 *        is larger than the total number of recipes, the entire recipe
 *        list will be returned instead.
 * @return A list of recipes in JSON format.
 */
async function getRecipeSuggestions(accountId, numRequested) {

    var uniqueIds = new Set();
    // Find the user's favorite meals and collect their IDs
    var favorites = await getNMostFrequentRecipeIds(accountId, numRequested);
    for (var i in favorites) {
        uniqueIds.add(favorites[i].RecipeId);
    }
    // If there are too few favorites, supplement with some random recipe IDs
    if (favorites.length < numRequested) {
        var delta = numRequested - favorites.length;
        var randomIds = await getNRandomRecipeIds(delta);
        for (var i in randomIds) {
            uniqueIds.add(randomIds[i].Id);
        }
    }
    // Get the list of names associated with each of the unique recipe IDs
    var names = await getRecipeNamesByIdList(Array.from(uniqueIds));

    // Generate a word list from the recipe names
    var words = [];
    var parentheses_regex = /\(|\)/g;
    for (var i in names) {
        words = words.concat(
            names[i].Name
                .toLowerCase()
                .replace(/'/g, "''") // Escape single quotes to avoid SQL error
                .replace(parentheses_regex, '') // remove parentheses
                .split(' ')                     // split into words
        );
    }
    // Remove duplicates and useless filler words from the set
    var uniqueWords = new Set(words);
    var useless = ['a', 'food', 'my', 'favorite', 'the', 'and', 'for', 'good', 'best', 'ever'];
    for (var i in useless) {
        uniqueWords.delete(useless[i]);
    }
    // Search for recipes that contain any of the relevant keywords in their name
    var uniqueRecipes = {};
    for (var w of uniqueWords.values()) {
        var recipes = await getRecipesBySearchTermsExcludeIds([w], Array.from(uniqueIds));
        for (var i in recipes) {
            uniqueRecipes[i] = recipes[i];
        }
    }

    // Return a list of recipes, truncated to a maximum length of `numRequested`
    var truncated = {};
    var count = 0;
    for (var i in uniqueRecipes) {
        truncated[i] = uniqueRecipes[i];
        if (count++ > numRequested) { break; }
    }
    return truncated;
}


module.exports = 
{
    getRecipeById, 
    getAllRecipes, 
    getRecipesBySearchTerms, 
    createRecipe, 
    addRecipeToMealPlan,
    deleteRecipeFromMealPlan,
    moveRecipeToNewDate,
    getNMostFrequentRecipeIds,
    getRecipeSuggestions,
    getAllMealPlanRecipes,
    recipeToJSON 
};

