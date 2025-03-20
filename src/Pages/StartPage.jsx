import {useState} from 'react';
import '../Styles/Menu.css'
function StartPage({handleColorChange, handleStateChange}){

    const colors = [{name: "red" ,value: "#f94144"}, {name: "yellow" ,value: "#f9c74f"} , {name: "green" ,value: "#90be6d"}, {name: "blue" ,value: "#277da1"}, {name: "pink", value:"#ff8fa3"}];
    return(
        <div className = 'start-menu-container'>
                {colors.map((color) => (
                    <div 
                        key={color.value} 
                        style={{backgroundColor : color.value}}
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