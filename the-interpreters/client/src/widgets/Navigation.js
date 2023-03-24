import { Component } from 'react'
import './Widget.css';
import profile from './assets/profile.png'
import { Link } from 'react-router-dom';

class Navigation extends Component{


    render(){
       
        return (
            <div className='navigation'>
                <h2 id='nav-title'>
                    <Link to='/'>Mealsight</Link>
                </h2>
                <ul className='nav-list'>
                    <li className='nav-links'>
                        <Link to="recommended">
                            Recipes
                        </Link>
                    </li>
                    <li className='nav-links'>
                        <Link to="create">
                            Create
                        </Link>
                    </li > 
                    <li className='nav-links'>
                        <Link to="mealplan">
                            Meal Plan
                        </Link>
                    </li >
                    <li className='nav-links'>
                        <Link to="search">
                            Search
                        </Link>
                    </li>
                    <li className='nav-links'>
                        <Link to="profile">
                            <img className='nav-link-profile' src={profile}/>
                            {/* <i className='nav-link-profile' class="fa-solid fa-user"></i> */}
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Navigation;
