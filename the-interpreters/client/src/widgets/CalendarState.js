import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState,useRef,useEffect,useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop  from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Widget.css";
import {useParams} from 'react-router-dom'
import "./SearchDropDownView"
import lastDayOfQuarter from "date-fns/esm/lastDayOfQuarter/index";

function refresh() {    
    setTimeout(function () {
        window.location.reload()
    }, 100);
}
const buttonStyle = {
    float: "right",
    backgroundColor:"#3174ad",
    border: "none",
    fontSize: "20px",
    color: "white"
};

const mealLink = {
    textDecoration: "none",
    color: "white"
};
const DragAndDropCalendar = withDragAndDrop(Calendar);

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const CalendarState = (props) => {
    const params = useParams();
    const [newMeal, setNewMeal] = useState({
        id: 0,
        title: "",
        start: "",
        label: "",
    });

    const fetchAllData = async () => {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_HOST}:3001/mealplan`,{
                mode: "cors",
                cache: "no-cache",    
                headers: { "Content-Type": "application/json" },
            });
            const newData = await response.json();
            console.log("\nFetching Meal");
            let tempMeals = [];
            for(var i = 0; i < newData.length; i++) {
                const fetchedMeal = {};
                fetchedMeal.id = newData[i].RecipeId
                fetchedMeal.label = newData[i].Name
                fetchedMeal.start = new Date(newData[i].Date)

                //recalibrating date since date obj pushes it 1 day behind
                let fetchedYear = fetchedMeal.start.getFullYear();
                let fetchedDay = fetchedMeal.start.getDate()+1;
                let fetchedMonth = fetchedMeal.start.getMonth();
                fetchedMeal.start = new Date(fetchedYear,fetchedMonth,fetchedDay);
                //console.log(fetchedYear+"-"+fetchedDay+"-"+fetchedMonth+"-"+fetchedMeal.id);
                
                fetchedMeal.title = <div><a href = {`http://${process.env.REACT_APP_HOST}:3000/recipe/${fetchedMeal.id}`} style={mealLink}>{fetchedMeal.label}</a> <button id = {fetchedYear+"-"+fetchedDay+"-"+fetchedMonth+"_"+fetchedMeal.id} onClick={onSelectMealDelete} style={buttonStyle} >X</button></div>;
                tempMeals.push(fetchedMeal);
            }
            setAllMeals(tempMeals);

        } 
        catch (err) {
            console.log(err);
        }
    };

    const [allMeals, setAllMeals] = useState([]);
    
    //fetch all meals
    useEffect(()=> {
       fetchAllData();
    },[])
    
    //search for event
    //adding a event with id
    //Send a post req, to add a recipe id to a certain date
    function handleAddMeal() {
        let year = newMeal.start.getFullYear();
        let month = newMeal.start.getMonth()+1;
        let day = newMeal.start.getDate();
        console.log("Date: "+ year+ "-" + month + "-" +day);
        //console.log(props.recipeId);
        console.log(props);
        newMeal.id = props.recipeId;
        //button id = date+id using dummy id rn
        newMeal.title = <div><a href = {`http://${process.env.REACT_APP_HOST}:3000/recipe/${newMeal.id}`} style={mealLink}>{newMeal.label}</a> <button className= "meal-delete-button" id = {year+ "-" + month + "-" +day+"_"+newMeal.id} onClick={onSelectMealDelete} >X</button></div>;
        setAllMeals([...allMeals, newMeal]);
    
        const fetchData = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_HOST}:3001/mpadd`,
                    {
                    method: "post",
                    mode: "cors",
                    cache: "no-cache",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        recipeId: props.recipeId,
                        date: `${year}-${month}-${day}`,
                    })
                });
            const newData = await response.json();
            console.log(newData);
            } 
            catch (err) {
                console.log(err);
            }
        };
        fetchData();
        fetchAllData();
        // refresh();
    }

    function gotoMealPlanFirstPage()
    {
        window.location.href = `http://${process.env.REACT_APP_HOST}:3000/mealplan/`;
    }

  //Post
    const moveMeal = useCallback(({ event, start }) =>{
        let id = event.id;
        let newYear = start.getFullYear();
        let newMonth = start.getMonth()+1;
        let newDay = start.getDate();
        let oldYear, oldMonth, oldDay;

        oldDay = event.start.getDate();
        oldMonth = event.start.getMonth() + 1; // has to be +1 because javascript
        oldYear = event.start.getFullYear();

        setAllMeals((prev) => {
            const existing = prev.find((ev) => ev.id === event.id)
            const filtered = prev.filter((ev) => ev.id !== event.id)
            return [...filtered, {...existing, start}]
        });
        console.log(oldYear + " " + oldMonth + " " + oldDay);
        console.log(newYear + " " + newMonth + " " + newDay);
        const fetchData = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_HOST}:3001/mpmove`,
                    {
                        method: "post",
                        mode: "cors",
                        cache: "no-cache",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            recipeId: id,
                            oldDate: `${oldYear}-${oldMonth}-${oldDay}`,
                            newDate: `${newYear}-${newMonth}-${newDay}`,
                        })
                    }
                );
            } 
            catch (err) {
                console.log(err);
            }
        };
        fetchData();
    },[setAllMeals])

    function SQL_ifyDate(input)
    {
        let removeFinalPart = input.split('_')[0];
        let parts = removeFinalPart.split("-");
        return parts[0] + "-" + String(Number(parts[2]) + 1)  + "-" + String(Number(parts[1]));
    }

    //Post
    const onSelectMealDelete = useCallback((event) => {
        console.log("Called Delete");
        //refactoring the dates for MYSQL
        let date = SQL_ifyDate(event.currentTarget.id)
        console.log(date);
        let id = event.currentTarget.id.split('_')[1];
        
        console.log(allMeals);
        //setAllMeals(allMeals.filter((item) => item.id != id && item.));
        const filtered  = allMeals.filter(obj => {
            
            let id = event.currentTarget.id.split('_')[1];
            
            let filteredDay = obj.start.getDate();
            let filteredMonth =obj.start.getMonth()+1;
            let filteredYear =obj.start.getFullYear();
            if(obj.id == id) {
                console.log(obj);
            }
            let filteredDate = `${filteredYear}-${filteredMonth}-${filteredDay}`
            return obj.id != id && filteredDate != date;
          });
        console.log(filtered);
        fetchAllData();
        refresh();
    
        const fetchData = async () => {
            try {
                const response = await fetch(`http://${process.env.REACT_APP_HOST}:3001/mpdelete`,
                    {
                        method: "post",
                        mode: "cors",
                        cache: "no-cache",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            recipeId: id,
                            date: date,
                        })
                    }
                );
            } 
            catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [allMeals])
    
    if (props.recipeId) {
        return (
            <div>
                <button id="mealplanButton" onClick={gotoMealPlanFirstPage}>
                    Clear Recipe
                </button>
                <div>
                    <DatePicker
                        placeholderText="Meal Day"
                        style={{ marginRight: "10px" }}
                        className="create-input"
                        selected={newMeal.start}
                        onChange={(start) => setNewMeal({ ...newMeal, start })}
                    />
                    <button id="mealplanButton" onClick={handleAddMeal}>
                        Add
                    </button>
                </div>
                <DragAndDropCalendar
                    localizer={localizer}
                    events={allMeals}
                    onEventDrop={moveMeal}
                    startAccessor="start"
                    endAccessor="start"
                    style={{ height: 500, margin: "50px" }}
                />
            </div>
        );
    }
    else {
        return (
            <div>
                <DragAndDropCalendar
                    localizer={localizer}
                    events={allMeals}
                    onEventDrop={moveMeal}
                    startAccessor="start"
                    endAccessor="start"
                    style={{ height: 500, margin: "50px" }}
                />
            </div>
        );
    }
};

export default CalendarState;

