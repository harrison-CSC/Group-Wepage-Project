import React from "react";
import { useEffect, useState } from "react";
import './Widget.css';


/**
 * Return a list item containing the name of the recipe and a link to its recipe page.
 */
function RecipeNameListItem(props) {
    return (
        <li>
            <a href={`http://${process.env.REACT_APP_HOST}:3000/mealplan/${props.id}`}>{props.name}</a>
        </li>
    );
}


/**
 * A simple view to display search results as an unordered list of names.
 */
const SearchView = (props) => {

    const [data, setData] = useState('');
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const jsondata = props.data;

        var items = [];
        for (var i in jsondata) {
            items.push(<RecipeNameListItem id={i} name={jsondata[i].name}/>);
            if (items.length > props.displayItemLimit) { break; }
        }
        setData(items);
        setVisible(items.length > 0); // only display if there are results

    }, [props.data]);  // Will re-render when new data is given from the parent

    return (
    <>
        {isVisible && <div id="search-drop-down"><ul>{data}</ul></div>}
    </>
    )
}

export default SearchView;
