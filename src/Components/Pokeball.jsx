import './../Styles/Pokeball.css'
import {motion, AnimatePresence} from 'framer-motion'

function Pokeball({ handleStateChange, gameState }) {
    return (
        <AnimatePresence>
            {gameState === "start" && (
                <div key="pokeball" className='pokeball-container'>
                        <motion.div 
                            className='pokeball-bg' 
                            exit={{ opacity: 0 }}  
                            transition={{ duration: 0.5 }}>
                                <motion.div 
                                    className="pokeball-top"
                                    exit={{ y: -50 }}  // Moves the top up
                                    transition={{ duration: 0.5 }}>
                                </motion.div>
                                <motion.div 
                                    className="pokeball-mid-bg" 
                                    exit={{ opacity:0 }}  
                                    transition={{ duration: 0.5 }}>
                                    <div className="pokeball-mid" 
                                        onClick={() => { handleStateChange("menu") }}></div>
                                </motion.div>
                            <motion.div 
                                className="pokeball-bottom"
                                exit = {{y:50}}
                                transition = {{duration:0.5}}>
                            </motion.div>
                        </motion.div>
                </div>
            )}
        </AnimatePresence>
        
    );
}

export default Pokeball;