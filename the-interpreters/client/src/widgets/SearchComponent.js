import React from "react";
import { useId, useEffect, useState, useRef } from "react";

function Food(props) {

    return (
        <li>
            <a href={`http://${process.env.REACT_APP_HOST}:3000/recipe/${props.id}`}>{props.name}</a>
        </li>
    );
}


const SearchComponent = (props) => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState('');

 const id = useId();
    
  useEffect(() => {
      const handleInput = () => {
          console.log();
      }
      var foods = [];
        const fetchData = async (keywords) => {
            console.log("Refreshing  " + input);
            //const response = await fetch(`http://35.163.251.74:3001/search?keywords=${keywords}`,
            const response = await fetch(`http://${process.env.REACT_APP_HOST}:3001/search?keywords=${keywords}`,
                {
                  method: 'GET',
                  mode: 'cors',
                  cache: 'no-cache',
                  headers: { 'Content-Type': 'application/json' }
                }
            );
            const newData = await response.json();
            for (var i in newData) {
                foods.push(<Food key={i} name={newData[i]["name"]} id={i}/>);
            }
            setLoading(false);
            setData(foods);
      }
      if (input.length > 0) {
        fetchData(input)
     }
  }, [input]);

}

export default SearchComponent;