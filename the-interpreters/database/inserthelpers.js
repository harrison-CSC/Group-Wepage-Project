/******************************************************************************
*   inserthelpers.js
*
*   Author: Zachary Colbert <zcolbert@sfsu.edu>
*
*   Description:
*       Helper functions to provide low-level insertion into specific
*       database tables. These should be composed into more abstracted
*       functions dealing directly with fully-formed data entities
*       such as Recipe.
******************************************************************************/
const bcrypt = require('bcrypt');
const con = require("./dbconnection.js");


/**
 * Insert a record directly into the Account table.
 *
 * @param username A string containing the username
 * @param email A string containing the user's email address
 * @param password A string containing the user's hashed password
 * @param accessToken A string containing the user's authentication token
 */
function _insertAccount(username, email, password, accessToken) {
    var sql = "INSERT IGNORE INTO Account"
                + " (Username, Email, Password, AccessToken)"
                + " VALUES (?, ?, ?, ?);"; 

    return new Promise(function (resolve, reject) {
        bcrypt.hash(password, 8, function(err, hash)
        {
            con.query(sql,
                [username, email, hash, accessToken],
                (err, rows) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows);   
                }
            );
        });
    })
}

function _updateToken(username, accessToken) {
    var sql = "UPDATE Account"
                + " SET AccessToken = ?"
                + " WHERE Username = ?"; 

    con.query(sql, [accessToken, username]);
}

/**
 * Insert a record directly into the Ingredient table.
 *
 * @param name A string containing the name of the ingredient.
 */
function _insertIngredient(name) {
    var sql = "INSERT IGNORE INTO Ingredient (Name) VALUES (?);";

    con.query(sql, 
        [name],
        (err, rows) => {
            if (err) {
                throw err;
            }
        }
    );
}

/**
 * Insert a record directly into the Recipe table.
 *
 * @param accountId An integer relating to an existing record in the Account table.
 * @param name A string containing the name of the recipe.
 * @param directions A string containing the recipe's directions.
 */
function _insertRecipe(accountId, name, directions, imageURL) {
    var sql = "INSERT IGNORE INTO Recipe"
                + " (AccountId, Name, Directions, ImageURL)"
                + " VALUES (?, ?, ?, ?);";

    con.query(sql, 
        [accountId, name, directions, imageURL], 
        (err, rows, fields) => {
            if (err) { 
                throw err; 
            }
        }
    );
}

/**
 * Insert a record directly into the RecipeIngredient table.
 * Since RecipeIngredient is a many-to-many table, the recipeId and ingredientId
 * must refer to existing keys in their respective tables.
 *
 * @param recipeId An integer representing the foreign key of an existing Recipe table record. 
 * @param ingredientId An integer representing the foreign key of an existing Ingredient table record. 
 * @param quantity A float representing the quantity of this ingredient used for the given recipe.
 * @param Units A string representing the type of units, e.g. 'cups' or 'ml'
 */
function _insertRecipeIngredient(recipeId, ingredientId, quantity, units) {
    var sql = "INSERT IGNORE INTO RecipeIngredient"
                + " (RecipeId, IngredientId, Quantity, Units)"
                + " VALUES (?, ?, ?, ?);";

    if (!quantity) {
        quantity = null; 
    }
    con.query(sql, [recipeId, ingredientId, quantity, units], (err, rows) => {
        if (err) {
            console.log(`Failed to insert ${quantity} ($)`);
        }
    });
}


module.exports = { _insertAccount, _updateToken, _insertRecipe, _insertIngredient, _insertRecipeIngredient };
