import React from "react";
import '../widgets/recipe.css'
import {useParams} from 'react-router-dom'
import { useEffect, useState} from "react"
// import recipeJSON from "../recipes_partial.json"


function Ingredient(props) {
    return <li>{props.qty} {props.units} {props.name}</li>;
}


const testJSON = {
    "name": "Test Recipe",
    "directions": "asd asdf asdf",
    "ingredients": [
        {"name": "carrot", "quantity": "3", "units": "cups"},
        {"name": "celery", "quantity": "2", "units": "cups"},
        {"name": "potato", "quantity": "1", "units": "cups"}
    ],
    "imageURL": "https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookies-recipe-1.jpg",
}

const Recipe = (props) =>{

    const [dataI, setIngredients] = useState(null);
    const [dataD, setDirections] = useState("");
    const [dataN, setName] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = useParams();

    useEffect(() => {
        console.log("Effect triggered")
        var ingredients = [];
        var directions = "";
        var name = "";
          const fetchData = async () => {
              try {
                  const response = await fetch(`http://${process.env.REACT_APP_HOST}:3001/recipe?recipeid=${params.recipeid}`,
                      {
                        method: 'GET',
                        mode: 'cors',
                        cache: 'no-cache',
                        headers: { 'Content-Type': 'application/json' }
                      }
                  );
                  const newData = await response.json();
                  console.log(newData);
                  
                  for (var i in newData.ingredients) {
                      var ingredient = newData.ingredients[i];
                      ingredients.push(<Ingredient key={i} name={ingredient.name} qty={ingredient.quantity} units={ingredient.units} />);
                  }

                  setLoading(false);
                  setIngredients(ingredients);
                  setDirections(newData.directions);
                  setName(newData.name);
              }
              catch (err) {
                  console.log(err);
              }
        }
        fetchData();
    }, [params.recipeid]);

    let databaseDirections = dataD;
    var splitDirections = databaseDirections.split(". ");
    var directions = splitDirections.map(item => <li>{item}</li>);

    return(
        <div>
            <div id="recipe-dashboard">
                <div className='title-container'>
                    <h2>{dataN}</h2>
                </div>
                <div className="ingredient-container">
                    <h2>Ingredients</h2>
                    <ul className="ingredient-list">
                        {dataI}
                    </ul>
                </div>
                <div className="direction-container">
                    <h2>Directions</h2>
                    <ol className="directions-list">
                        {directions}
                    </ol>
                </div>
                <div className="button-container">
                    <a href={`http://${process.env.REACT_APP_HOST}:3000/mealplan/${params.recipeid}`} className='prompt-buttons'>
                        <button> Add to Meal Plan</button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Recipe;
