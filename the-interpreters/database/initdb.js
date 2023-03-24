/******************************************************************************
*   initdb.js
*   Description:
*       SQL queries to initialize the app database tables.
******************************************************************************/
const con = require("./dbconnection.js");


// Create account table
con.query("CREATE TABLE IF NOT EXISTS Account("
            + " Id INT NOT NULL AUTO_INCREMENT,"
            + " Username VARCHAR(255) NOT NULL,"    // Cannot have empty usernames
            + " Email VARCHAR(255),"
            + " Password VARCHAR(255),"
            + " AccessToken VARCHAR(255),"
            + " UNIQUE (Username),"                // Usernames must be unique
            + " PRIMARY KEY (Id));",
        (err, rows) => {
            if (err) throw err;
            console.log("Created Account table");
        }
);

// Create Ingredient table
con.query("CREATE TABLE IF NOT EXISTS Ingredient("
           + " Id INT NOT NULL AUTO_INCREMENT,"
           + " Name VARCHAR(255) NOT NULL,"
           + " PRIMARY KEY (Id));",
        (err, rows) => {
            if (err) throw err;
            console.log("Created Ingredient table");
        }
);

// Create Merchant table
con.query("CREATE TABLE IF NOT EXISTS Merchant("
            + " Id INT,"
            + " Name VARCHAR(255) NOT NULL,"
            + " PRIMARY KEY (Id));",
        (err, rows) => {
            if (err) throw err;
            console.log("Created Merchant table");
        }
);

// Create Recipe table
con.query("CREATE TABLE IF NOT EXISTS Recipe("
            + " Id INT NOT NULL AUTO_INCREMENT,"
            + " AccountId INT,"
            + " Name VARCHAR(255) NOT NULL,"
            + " Directions VARCHAR(2047)," 
            + " Summary VARCHAR(255)," 
            + " Prep VARCHAR(255)," 
            + " Cook VARCHAR(255)," 
            + " Servings INT," 
            + " Yield INT," 
            + " Category VARCHAR(255)," 
            + " ImageURL VARCHAR(255)," 
            + " FOREIGN KEY (AccountId) REFERENCES Account(Id),"
            + " PRIMARY KEY (Id),"
            + " UNIQUE (AccountId, Name));",
        (err, rows) => {
            if (err) throw err;
            console.log("Created Recipe table");
        }
);

// Create MealPlan table
con.query("CREATE TABLE IF NOT EXISTS MealPlan("
            + " AccountId INT NOT NULL,"
            + " RecipeId INT NOT NULL,"
            + " OnDate DATE,"
            + " MealNum INT," 
            + " FOREIGN KEY (AccountId) REFERENCES Account(Id),"
            + " FOREIGN KEY (RecipeId) REFERENCES Recipe(Id));",
        (err, rows) => {
            if (err) throw err;
            console.log("Created MealPlan table");
        }
);

// Create RecipeLabel table
con.query("CREATE TABLE IF NOT EXISTS RecipeLabel("
            + " RecipeId INT,"
            + " Label VARCHAR(255) NOT NULL,"
            + " FOREIGN KEY (RecipeId) REFERENCES Recipe(Id),"
            + " UNIQUE (RecipeId, Label));",  // Each label should not be applied more than once to the same recipe
        (err, rows) => {
            if (err) throw err;
            console.log("Created RecipeLabel table");
        }
);

// Create ShoppingList table
con.query("CREATE TABLE IF NOT EXISTS ShoppingList("
            + " AccountId INT,"
            + " IngredientId INT,"
            + " MerchantId INT,"
            + " Quantity FLOAT(4),"
            + " Units VARCHAR(255),"
            + " IsChecked BOOLEAN," 
            + " FOREIGN KEY (AccountId) REFERENCES Account(Id),"
            + " FOREIGN KEY (IngredientId) REFERENCES Ingredient(Id),"
            + " FOREIGN KEY (MerchantId) REFERENCES Merchant(Id));",
        (err, rows) => {
            if (err) throw err;
            console.log("Created ShoppingList table");
        }
);

// Create RecipeIngredient table
con.query("CREATE TABLE IF NOT EXISTS RecipeIngredient("
            + " RecipeId INT,"
            + " IngredientId INT,"
            + " Quantity FLOAT(4),"
            + " Units VARCHAR(255),"
            + " FOREIGN KEY (RecipeId) REFERENCES Recipe(Id),"
            + " FOREIGN KEY (IngredientId) REFERENCES Ingredient(Id),"
            + " UNIQUE(RecipeId, IngredientId));",
        (err, rows) => {
            if (err) throw err;
            console.log("Created RecipeIngredient table");
        }
);

// Create IngredientSubstitution table
con.query("CREATE TABLE IF NOT EXISTS IngredientSubstitution("
            + " IngredientId1 INT,"
            + " IngredientId2 INT,"
            + " FOREIGN KEY (IngredientId1) REFERENCES Ingredient(Id),"
            + " FOREIGN KEY (IngredientId2) REFERENCES Ingredient(Id),"
            + " UNIQUE (IngredientId1, IngredientId2));", // Each pair should only be inserted once
        (err, rows) => {
            if (err) throw err;
            console.log("Created IngredientSubstitution table");
        }
);


// Close connection to DB
con.end();

