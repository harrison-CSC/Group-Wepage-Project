import React, {useState} from "react";


const CreateRecipe = (props) =>{

    const [ingredientList, setIngredientList] = useState([{
        ingredientQuantity:'', ingredientMetric:'', ingredientName:''
    }]);

    const [recipeList, setRecipieList] = useState({
        name:'', summary:'', prep:'', cook:'', servings:'', yields:'', category:'', IngredientList:[], directions:'', URL:''
    });


    function isValidInput()
    {   
        if (isNaN(recipeList.prep) || isNaN(recipeList.cook))
            return false;

        for (let i = 0; i < ingredientList.length; i++)
        {
            if (isNaN(ingredientList[i].ingredientQuantity))
                return false;
        }

        return true;
    }

    const handleSubmit = (e) =>{
        e.preventDefault()

        if(!isValidInput())
        {
            alert("Error, there is text where there should be numbers");
            return;
        }

        setRecipieList({...recipeList, IngredientList:ingredientList});
        let tempRecipeList = recipeList;
        tempRecipeList.IngredientList = ingredientList;
        const json = JSON.stringify(tempRecipeList);
        console.log(json);
        fetch(`http://${process.env.REACT_APP_HOST}:3001/create`,
        {
                headers: {"Content-Type" : "application/json"},
                method: "post",
                body: json
        })
        .then(response => response.json())
        .then((data) => {
            if(data == null) {
                alert("Failed to create");
            }
            else {
                window.location.href = `http://${process.env.REACT_APP_HOST}:3000/recipe/` + data;
            }
        });
    }

   const handleChange = (event) =>{
        const { name , value} = event.target;
        setRecipieList({...recipeList, [name]:value})
    }

    const handleChangeIngredient = (event) =>{
        const {name, value} = event.target;

        const ingredientDataType = name.split('_')[0];
        const arrayIndex = name.split('_')[1];

        let tempIngredientList = [...ingredientList];
        tempIngredientList[arrayIndex][ingredientDataType] = value;

        setIngredientList(tempIngredientList);
    }

    const handleAdd = () =>{
        setIngredientList([...ingredientList,{ingredientQuantity:'', ingredientMetric:'', ingredientName:''}]);
    }

    const handleRemove = () =>{
        const ingredient = [...ingredientList];
        ingredient.splice(ingredient.length - 1, 1);
        setIngredientList(ingredient);
    }
    

    return(
        <div>
            <div id="create-outer-div">
                <h2 id="create-title">Add a Recipe</h2>
                <form onSubmit={handleSubmit}>
                    <div className="create-content">
                        <label></label>
                        <input type='text' className="create-input" placeholder="title" name='name' value={recipeList.name} onChange={handleChange}/>
                    </div>
                    <div className="create-content">
                        <label></label>
                        <input type='text' className="create-input" placeholder="summary" name='summary' value={recipeList.summary} onChange={handleChange}/>
                    </div>
                    <div className="create-content" id="ingredient-input">
                        {ingredientList.map((item, index) => 
                            <div>
                                <input type="text" className="smallIngr" name={"ingredientQuantity_" + index} placeholder="1" value={item.ingredientQuantity} onChange={handleChangeIngredient} />
                                <input type="text" className="smallIngr" name={"ingredientMetric_" + index} placeholder="cup" value={item.ingredientMetric} onChange={handleChangeIngredient} />
                                <input type="text" className="bigIngr" name={"ingredientName_" + index} placeholder="milk" value={item.ingredientName} onChange={handleChangeIngredient} />
                            </div>
                        )}
                        <input type="button" value="remove" onClick={handleRemove} />
                        <input type="button" value="add" onClick={handleAdd} />
                    </div>
                    <div className="create-content">
                        <label></label>
                        <textarea rows="5" cols="60" className="create-input-textarea" name="directions" placeholder="directions" value={recipeList.directions} onChange={handleChange}/>
                    </div>
                    <div className="create-attributes">
                        <label></label>
                        <input type='text' className="create-input" placeholder="prep time" name='prep' value={recipeList.prep} onChange={handleChange}/>
                    </div>
                    <div className="create-attributes">
                        <label></label>
                        <input type='text' className="create-input" placeholder="cook time" name='cook' value={recipeList.cook} onChange={handleChange}/>
                    </div>
                    <div className="create-attributes">
                        <label></label>
                        <input type='text' className="create-input" placeholder="recipe yields" name='yields' value={recipeList.yields} onChange={handleChange}/>
                    </div>
                    <div className="create-attributes">
                        <label></label>
                        <input type='text' className="create-input" placeholder="category" name='category' value={recipeList.category} onChange={handleChange}/>
                    </div>
                    <div className="create-attributes">
                        <label></label>
                        <input type='text' className="create-input" placeholder="URL of image" name='URL' value={recipeList.URL} onChange={handleChange}/>
                    </div>
                    <div className="prompt-buttons">
                        <button> add recipe</button>
                    </div>

                </form>
            </div>
        </div>
    )}
;

export default CreateRecipe