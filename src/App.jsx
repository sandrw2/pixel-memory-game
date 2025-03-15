import Characters from './Components/Character.jsx';
import StartPage from './Pages/StartPage.jsx';
import PlayingPage from './Pages/PlayingPage.jsx';
import GameOver from './Components/GameOver.jsx';
import Pokeball from './Components/Pokeball.jsx';
import {useState, useEffect } from 'react';
import {motion, AnimatePresence} from 'framer-motion'

import './Styles/App.css'
function App(){
    const[gameState, setGameState] = useState("start");
    const [playableCharacters, setPlayableCharacters] = useState(Characters.red);
    const [color, setColor] = useState("white"); 
    const [sound, setSound] = useState(true);

    function handleColorChange(color){
        setColor(color);
        setPlayableCharacters(Characters["color"]);
    }

    
    return(
        <div className='background' style={{backgroundColor:color}}>
                <Pokeball handleStateChange = {setGameState} gameState = {gameState}/>
                {gameState === "menu" && <StartPage handleColorChange={setColor} handleStateChange ={setGameState} />}
                {gameState === "playing" && <PlayingPage />}
                {gameState === "gameOver" && <GameOver />}
                
        </div>
    );
}

export default App;