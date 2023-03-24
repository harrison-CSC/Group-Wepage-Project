import React from "react";
import HomePrompt from "../widgets/HomePrompts";
import RecipeSlider from "../widgets/RecipeSlider"
const home = () =>{
    const slides = [
        { url: "https://i.ibb.co/MZGYpHd/image1.jpg", title: "image1" },
        { url: "https://i.ibb.co/kyZgHfD/image3.webp", title: "image2" },
        { url: "https://i.ibb.co/L1XMYB3/image2.webp", title: "image3" },
    ]
    return(
        <div>
            <div id="upper-dashboard">
                <div className="dash-child" id="prompt">
                    <HomePrompt/>
                </div>
                <div className="dash-child" id="slider">
                    <RecipeSlider slides={slides}/>
                </div>
            </div>
        </div>

    );
};

export default home;