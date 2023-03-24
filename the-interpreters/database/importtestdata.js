/******************************************************************************
*   importestdata.js
*
*   Author: Zachary Colbert <zcolbert@sfsu.edu>
*
*   Description:
*       Imports some test data into the database
******************************************************************************/

const con = require("./dbconnection.js");
const datafile = require("./recipes_partial.json");
const dbio = require("./dbio.js");
const dbins = require("./inserthelpers.js");
const dbread = require("./readhelpers.js");


async function importTestData() {

    await dbins._insertAccount("testacct", "test@test.com", "@!235a346A#$@%@", "12345");
    var accountId = await dbread._getAccountId("testacct");

    for (var tmp_id in datafile) {
        var recipe = datafile[tmp_id];
        console.log(`Working on '${recipe.name}'`);
        await dbio.createRecipe(accountId, recipe);
    }
    console.log("DONE");
    return;
}

importTestData();

