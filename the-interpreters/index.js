const express = require('express')
const app = express()
const cors = require('cors');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const port = 3001

const dbtest = require("./database/dbio.js");
const addData = require("./database/inserthelpers.js");
const readData = require("./database/readhelpers.js");


// Allow cross origin requests for all routes.
// This is necessary to allow the React server to request data from the express server.
// Since they run on different ports, they are considered separate origins and cannot 
// share data by default.
app.use(cors());  

app.get('/', (req, res) => {
  res.send('This is the backend server')
});

// This page shows all of the recipes in JSON format
// Used for debugging. We can delete later (Zac)
app.get('/dbtest', (req, res) => {
    console.log("Getting data dump");
    dbtest.getAllRecipes()
        .then((value) => {
            res.json(value);
        }
    ).catch((err) => {
        console.log(err);
    });
})

// Return a list of JSON recipes that match the given keywords
app.get('/search?:keywords', (req, res) => {
    const keywords = req.query.keywords.split(' ');
    dbtest.getRecipesBySearchTerms(keywords)
        .then((value) => {
            res.json(value);
        }
    ).catch((err) => {
        console.log(err);
    });
})

// Return a list of JSON recipes that are suggested from the user's meal plan history
app.get('/recommended', (req, res) => {
    const numberOfSuggestions = 30;
    dbtest.getRecipeSuggestions(1, numberOfSuggestions)
        .then((value) => {
            res.json(value);
        }
    ).catch((err) => {
        console.log(err);
    });
})

// Return a single JSON recipe corresponding to the given id
app.get('/recipe?:recipeid', (req, res) => {
    const recipeid = req.query.recipeid;
    dbtest.getRecipeById(recipeid)
        .then((value) => {
            res.json(value);
        }
    ).catch((err) => {
        console.log(err);
    });
})

function replaceButActuallyWorks(originalString, changeFrom, changeTo)
{
    let toReturn = "";

    for (let i = 0; i < originalString.length; i++)
    {
        if (originalString[i] == changeFrom)
            toReturn += changeTo;
        else
            toReturn += originalString[i];
    }

    return toReturn;
}

// Create a new recipe
app.post('/create', jsonParser, (req, res) => {

    let tempReq = req.body;
    tempIngr = [];
    
    for (let i = 0; i < req.body.IngredientList.length; i++)
    {
        let ingreParts = req.body.IngredientList[i];

        let tempDic = {
            "name": ingreParts.ingredientName,
            "quantity": Number(ingreParts.ingredientQuantity),
            "units": ingreParts.ingredientMetric 
        }
        tempIngr.push(tempDic);
    }

    if(req.body.IngredientList.length == 0)
    {
        console.log("ERROR: the ingredient list recieved by the backend is empty.");
        res.json(null);
    }

    tempReq.ingredients = tempIngr;

    // fix directions formatting
    tempReq.directions = replaceButActuallyWorks(req.body.directions, '\n', '. ');
    
    dbtest.createRecipe(1, tempReq)
        .then((value) => {
            res.json(value);
        });
})

// Add a recipe to the meal plan
app.post('/mpadd', jsonParser, (req, res) => {
    dbtest.addRecipeToMealPlan(1, req.body.recipeId, req.body.date)
        .then((value) => {
            console.log("mpadd:" + value);
        });
})

// Delete a recipe from the meal plan
app.post('/mpdelete', jsonParser, (req, res) => {
    dbtest.deleteRecipeFromMealPlan(1, req.body.recipeId, req.body.date)
        .then((value) => {
            console.log("mpdelete:" + value);
        });
})

// Move a recipe to a new date on the meal plan
app.post('/mpmove', jsonParser, (req, res) => {
    console.log(req.body.newDate);
    dbtest.moveRecipeToNewDate(1, req.body.recipeId, req.body.oldDate, req.body.newDate)
        .then((value) => {
            console.log("mpmove from " + req.body.oldDate + " to " + req.body.newDate);
        });
})

// Return a list of JSON recipes that are currently in the user's meal plan
app.get('/mealplan', (req, res) => {
    dbtest.getAllMealPlanRecipes(1) // just using account #1 for now
        .then((value) => {
            res.json(value);
        }
    ).catch((err) => {
        console.log(err);
    });
})

app.listen(port, () => {
})

app.post('/registerAccount', jsonParser, function(req, res)
{
    readData._searchForAccountUname(req.body.UserName)
        .then(
            function(value)
            {
                if (value.length == 0)
                {
                    let newToken = generateToken();
                    addData._insertAccount(req.body.UserName, req.body.Email, req.body.Password, newToken);
                    res.json(newToken);
                }
                else
                    res.json(null);
            },
            function(error)
            {
                console.log(error);
                res.json(null);
            }
        );
});

app.post('/tryLogin', jsonParser, function(req, res)
{
    readData._searchForAccount(req.body.UserName, req.body.Password)
        .then(
            function(value)
            {
                if (value)
                {
                    let newToken = generateToken();
                    addData._updateToken(req.body.UserName, newToken);
                    res.json(newToken);
                }
                else
                    res.json(null);
            },
            function(error)
            {
                console.log(error);
                res.json(null);
            }
        );
});


// This function is used to generate the random access token
function generateToken()
{
    let toReturn = "";
    let allChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i <= 16; i++)
        toReturn += allChars.charAt(Math.random() * 62);
    
    return toReturn
}
