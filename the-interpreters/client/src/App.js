import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from "./pages/home";
import Create from "./pages/create";
import Recommended from "./pages/recommended";
import MealPlan from "./pages/mealplan";
import Profile from "./pages/profile";
import Search from "./pages/search";
import Navigation from './widgets/Navigation';
import Recipe from './pages/recipe';

function App() {
  return (
      <Router>
        <div className="App">
      <Navigation />
        <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/create' element={<Create/>} />
            <Route path='/recommended' element={<Recommended/>} />
            <Route path='/mealplan' element={<MealPlan/>} />
            <Route path='/mealplan/:recipeid' element={<MealPlan/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/search' element={<Search/>} />
            <Route path='/recipe/:recipeid' element={<Recipe/>} />
        </Routes>
        </div>
      </Router>
  );
}

export default App;
