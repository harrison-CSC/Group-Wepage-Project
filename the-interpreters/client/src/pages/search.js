import React from "react";
import { useState } from "react";
import SearchBar from "../widgets/SearchBar";
import SearchResultListView from "../widgets/SearchResultListView";
// testing import SearchDropDownView from "../widgets/SearchDropDownView";


/**
 * A search page consisting of a search bar and 
 * a set of search result elements.
 */
const Search = (props) => {

    const [data, setData] = useState('');

    // The setter is passed to the search bar component,
    // and the resulting data is passed into the view.
    return (
    <>
        <div id="search-wrap">
            <SearchBar setData={setData}/>
            <SearchResultListView data={data}/>
        </div>
    </>
    )
}

export default Search;
