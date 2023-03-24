import React from "react";
import { useId, useEffect, useState, useRef } from "react";


/**
 * A search bar component that takes text input from the user
 * and queries the database to find results. The search results
 * are stored in the parent element via the props.setData function.
 *
 * @param props A set of key/value properties from the parent.
 */
const SearchBar = (props) => {

    const [error, setError] = useState(null);
    const [input, setInput] = useState('');

    const [mealPickerName, setMealPickerName] = useState('');

    useEffect(() => {

        if (props.recipeId)
        {
            console.log(props.recipeId);
            fetch(`http://${process.env.REACT_APP_HOST}:3001/recipe?recipeid=${props.recipeId}`,
            {
              method: 'GET',
              mode: 'cors',
              cache: 'no-cache',
              headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then((data) => {
                if(data == null)
                {
                    alert("Failed to get recipe name");
                }
                else
                {
                    setMealPickerName(data.name)    
                }
            });
        }        

        const fetchData = async (keywords) => {
            const response = await fetch(`http://${process.env.REACT_APP_HOST}:3001/search?keywords=${keywords}`,
                {
                  method: 'GET',
                  mode: 'cors',
                  cache: 'no-cache',
                  headers: { 'Content-Type': 'application/json' }
                }
            );
            const newData = await response.json();
            props.setData(newData);
        }
        // Only fetch results if there is text in the input
        if (input.length > 0) {
            fetchData(input)
        }
        else {
            props.setData([]);
        }
    }, [input]);  // This has a dependency on the input, and will re-render when input changes.

    if (props.recipeId)
    {
        return (
        <>
            <input type="text" className="create-input" id="search-text" placeholder="Search" value={mealPickerName} readOnly/>
        </>
        )
    }
    else
    {
        return (
        <>
            <input type="text" className="create-input" id="search-text" placeholder="Search" value={input} onChange={e => setInput(e.target.value)}/>
        </>
        )
    }
}

export default SearchBar;
