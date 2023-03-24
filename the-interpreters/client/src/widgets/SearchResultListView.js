import React from "react";
import { useId, useEffect, useState, useRef } from "react";
import '../widgets/Widget.css';


/**
 * Return a list item containing the name of the recipe and a link to its recipe page.
 */
function RecipeNameListItem(props) {
    return (
        <div id="recc-container">
        <a href={`http://${process.env.REACT_APP_HOST}:3000/recipe/${props.id}`}><img id="recc-img-sizing"src={props.image}/></a>
        <div id="recc-title-spacing">
          <a id="recc-title" href={`http://${process.env.REACT_APP_HOST}:3000/recipe/${props.id}`}>{props.name}</a>
        </div>
        </div>
    );
}


/**
 * A simple view to display search results as an unordered list of names.
 */
const SearchResultListView = (props) => {

  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      var items = [];
      const jsondata = props.data;
      for (var i in jsondata) {
          items.push(<RecipeNameListItem id={i} name={jsondata[i].name} image={jsondata[i].image}/>);
      }
      setData(items);
  }, [props.data]);  // Will re-render when new data is given from the parent

    return (
    <>
        <h3>Search Results: </h3>
        <ul id="reccomended-wrap" style={{"display": "grid", "gridTemplateColumns": "auto auto auto", "padding": "20px"}} className="c">
            {data}
        </ul>
    </>
    )
}

export default SearchResultListView;
