/******************************************************************************
*   readhelpers.js
*
*   Author: Zachary Colbert <zcolbert@sfsu.edu>
*           Harrison Rondeau
*
*   Description:
*       Helper functions to provide low-level read operastions from 
*       individual database tables. 
******************************************************************************/
const bcrypt = require('bcrypt');
const con = require("./dbconnection.js");


/**
 * Retrieve the ID associated with a username.
 *
 * @param username A string representing the username.
 * @return A Promise for the ID associated with the given username.
 */
async function _getAccountId(username) {

    var sql = "SELECT Id FROM Account WHERE Username=?;"

    return new Promise((resolve, reject) => {
        con.query(sql, [username], (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0].Id);
        });
    });
}

/**
 * Retrieve the ID associated with a recipe name.
 *
 * @param name A string representing the recipe's name.
 * @return A Promise for the ID associated with the given recipe.
 */
async function _getRecipeId(name) {

    var sql = "SELECT Id FROM Recipe WHERE Name=?;"

    return new Promise((resolve, reject) => {
        con.query(sql, [name], (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0].Id);
        });
    });
}

/**
 * Retrieve the ID associated with an ingredient.
 *
 * @param name A string representing the ingredient's name.
 * @return A Promise for the ID associated with the given ingredient.
 */
async function _getIngredientId(name) {

    var sql = "SELECT Id FROM Ingredient WHERE Name=?;"

    return new Promise((resolve, reject) => {
        con.query(sql, [name], (err, rows, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(rows[0].Id);
        });
    });
}

function _searchForAccountUname(username) {
    var sql = "SELECT * FROM Account WHERE Username = ?;"; 

    return new Promise(function (resolve, reject) {
        con.query(sql, [username], function (err, rows) 
        {
            if (err)
                reject(err);
            else
            {
                resolve(rows);
            }
        });
    })
}

function _searchForAccount(username, password) {
    var sql = "SELECT * FROM Account WHERE Username = ? AND Password = ?;"; 

    return new Promise(function (resolve, reject) {
        _searchForAccountUname(username)
            .then(
                function(value)
                {
                    if (value.length == 1)
                    {
                        let hash = value[0]["Password"];
                        bcrypt.compare(password, hash).then(function(result)
                        {
                            resolve(result);
                        });
                    }
                    else
                        resolve(false);
                },
                function(err)
                {
                    console.log(err);
                }
            );
    })
}

function _getHighestRecipeId() {
    const sql = "SELECT Id FROM Recipe ORDER BY Id DESC LIMIT 1;";

    return new Promise(function (resolve, reject) {
        con.query(sql, [], function (err, rows) 
        {
            if (err)
                reject(err);
            else
            {
                resolve(rows[0].Id);
            }
        });
    })
}

module.exports = { _getAccountId, _getRecipeId, _getHighestRecipeId, _getIngredientId, _searchForAccountUname, _searchForAccount };
