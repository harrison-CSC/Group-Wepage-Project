import { Component } from 'react'
import './Widget.css';

class HomePrompt extends Component{


    render(){
       
        return (
            <div>
                <div id='prompt-text'>
                <h2>Your Virtual Recipe Book</h2>
                </div>

                <div>
                    <a href='mealplan' className='prompt-buttons'>
                        <button> Create a Meal Plan</button>
                    </a>
                    <a href='create' className='prompt-buttons'>
                        <button>Add a Recipie</button>
                    </a>
                </div>
            </div>
        )
    }
}

export default HomePrompt;
