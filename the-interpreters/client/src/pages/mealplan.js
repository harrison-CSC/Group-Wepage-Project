import { useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import CalendarState from "../widgets/CalendarState";
import SearchBar from "../widgets/SearchBar";
import SearchDropDownView from "../widgets/SearchDropDownView";

const MealPlan = () => {

    const [data, setData] = useState('');

    const params = useParams();
    const searchResultLimit = 6; // Max number of recipes that can be shown at a single time

    return(
        <div>
            <h1>Meal Plan</h1>
            <div className="center-wrap" id="align-items">
                <div id="meal-plan-search-bar"></div>
                <SearchBar setData={setData} recipeId={params.recipeid}/>
                <div id="meal-plan-search">
                    <SearchDropDownView data={data} displayItemLimit={searchResultLimit}/>
                </div>
            </div>
            <CalendarState recipeId={params.recipeid}/>
        </div>
    );
};

export default MealPlan;
