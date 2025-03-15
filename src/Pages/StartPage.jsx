import {useState} from 'react';
import '../Styles/Menu.css'
function StartPage({handleColorChange, handleStateChange}){

    const colors = ["#f94144", "#f8961e", "#f9c74f", "#90be6d", "#277da1", "#ff8fa3"];
    return(
        <div className = 'start-menu-container'>
                {colors.map((color) => (
                    <div 
                        key={color} 
                        style={{backgroundColor : color}}
                        className='colors'
                        onMouseEnter={()=>handleColorChange(color)}
                        onMouseLeave={()=>handleColorChange("white")}
                        onClick={()=>handleStateChange("playing")}>
                    </div>
                ))}

        </ div>
        
    );
}

export default StartPage;