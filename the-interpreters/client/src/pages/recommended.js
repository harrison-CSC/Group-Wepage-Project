import React from "react";
import { useId, useEffect, useState, useRef } from "react";
import '../widgets/Widget.css';


function Food(props) {

    return (
        <div id="recc-container">
        <a href={`http://${process.env.REACT_APP_HOST}:3000/recipe/${props.id}`}><img id="recc-img-sizing"src={props.image}/></a>
        <div id="recc-title-spacing">
          <a id="recc-title" href={`http://${process.env.REACT_APP_HOST}:3000/recipe/${props.id}`}>{props.name}</a>
        </div>
        </div>
    );
}


const Recommended = (props) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [input, setInput] = useState('');

    const id = useId();
    useEffect(() => {
    
        var foods = [];
        const fetchData = async (keywords) => {
            const response = await fetch(`http://${process.env.REACT_APP_HOST}:3001/recommended`,
                {
                  method: 'GET',
                  mode: 'cors',
                  cache: 'no-cache',
                  headers: { 'Content-Type': 'application/json' }
                }
            );
            const newData = await response.json();
            for (var i in newData) {
                foods.push(<Food key={i} name={newData[i]["name"]} image={newData[i]["image"]} id={i}/>);
            }
            setLoading(false);
            setData(foods);
        }
        fetchData(input);
    }, []);

    return (
    <>
        <div id="discover-wrap">
            <h3>Try These Recipes</h3>
            <br></br>
            <div  id="reccomended-wrap" style={{"display": "grid", "gridTemplateColumns": "auto auto auto", "padding": "20px"}}>
                {data}
            </div>
        </div>
    </>
    )
}

export default Recommended;
