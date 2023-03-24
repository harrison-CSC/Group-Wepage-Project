import React from "react";
import CreateRecipie from "../widgets/CreateRecipe";
import SideImage from "../widgets/assets/images/create.jpeg"

const Create = () =>{

    return(
        <div id="create-wrap">
        <div id="create-side1">
        </div>
        <div id="create-side2">
            <CreateRecipie/>
        </div>
        </div>
    );
};

export default Create;