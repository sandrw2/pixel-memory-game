import React, { useState, useEffect, useRef } from 'react';
import Loading from "../Components/Loading.jsx";
import {motion, AnimatePresence} from 'framer-motion';
import {Pokedex} from "pokeapi-js-wrapper";

//Cache Data Next
export default function PlayingPage({color, size, handleStateChange}) {
  const [pokemons, setPokemons] = useState([]); // State to holds pokemon info --> name, img, positions
  const [loading, setLoading] = useState(true); // Loading state
  const [clickedPokemons, setClickedPokemons] = useState([]);
  const hasFetched = useRef(false);
  const SPEED = 200;

  async function fetchPokemons(){
    console.log('Fetching Pokemon Data');
    const P = new Pokedex();
    const pokemonColorList = await P.getPokemonColorByName(color);
    console.log(pokemonColorList)

    // Fetch details for each Pokémon Species (this contains URLs to pokemon species detail page)
    const pokemonSpeciesDetails = await Promise.all(
      pokemonColorList.pokemon_species.map(species => P.resource(species.url))
    );

    //Fetch details for each pokemon of each Species
    const pokemonSet = await Promise.all(
      pokemonSpeciesDetails.map(species => P.getPokemonByName(species.varieties[0].pokemon.name))
    );
      
    // Pick 10 random pokemons of the chosen color
    const randomPokemons = [];
    while (randomPokemons.length < size && pokemonSet.length > 0) {
      const randomIndex = Math.floor(Math.random() * pokemonSet.length);
      const pokeInfo = pokemonSet.splice(randomIndex, 1)[0];
      randomPokemons.push({
          name: pokeInfo.name, 
          id: pokeInfo.id, 
          imgUrl:pokeInfo.sprites.front_default,
          position: getRandomPosition(),
          velocity: getRandomVelocity(),
          clicked: false
        } 
      );
    }
    
    return randomPokemons
  };

  function getRandomPosition(){
    return {
      x: Math.random() * (window.innerWidth - 100), 
      y: Math.random() * (window.innerHeight - 100)
    }
  }

  function getRandomVelocity(){
    return {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8

    };
  }

  

  //handle pokemon click -> 
  // 1) pokemon hasnt been chosen before -> add another one of it's sprite to the list
  // 2) pokemon has been chosen before -> queue game over 
  function pokemonClick(pokemon){
    if (pokemon.click != true){
      //Update Score
      //Add duplicate pokemon into seen array 
      //Update pokemon click to True
      const newPokemonSet = pokemons.map((pokemon)=>{
        if(pokemon.id == pokemon.id){
          return {...pokemon, clicked: true}
        }
      })
      setPokemons(newPokemonSet);

      const newClickedPokemons = [...clickedPokemons, {
        id: pokemon.id.toString()+"copy", 
        imgUrl: pokemon.imgUrl, 
        position: getRandomPosition(),
        velocity: getRandomVelocity()
      }]
      setClickedPokemons(newClickedPokemons);
        
      setClickedPokemons([...clickedPokemons, pokemon.id]);
    }else{
      //Return updates score!
      handleStateChange("gameOver");
    }
  } 

  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate fetch
    hasFetched.current = true;
    // Fetch pink Pokémon data from the Pokémon API
    fetchPokemons()
    .then(data => {
        // Set state with the selected 10 random pink Pokémon
        setPokemons(data)
        setLoading(false); // Update loading state
        console.log(data)
    })
    .catch(error => {
      console.log("Error fetching Pokemon:", error);
      setLoading(false);
    });
  }, []); // Empty dependency array ensures this runs only once when the component mounts


  useEffect(() => {
    const interval = setInterval(() => {
      setPokemons((prevPokemons) =>
      prevPokemons.map((pokemon) => {
        let newX = pokemon.position.x + pokemon.velocity.x;
        let newY = pokemon.position.y + pokemon.velocity.y;
        let newV = {x: pokemon.velocity.x, y:pokemon.velocity.y};
      

        if (newY < 0) {
          newV.y = newV.y * -1;
          newY = 0;
        } else if (newY > window.innerHeight - 100) {
          newV.y = newV.y * -1;
          newY = window.innerHeight - 100;
        }

        //Check if past boundaries 
        if (newX < 0) {
          newV.x = newV.x * -1;
          newX = 0; // Set position to boundary
        } else if (newX > window.innerWidth - 100) {
          newV.x = newV.x * -1;
          newX = window.innerWidth - 100;
        }


        return {
          ...pokemon, 
          position: {x: newX, y: newY},
          velocity: newV
        };
      })
    );
    }, 50); // Move every second
  
    return () => clearInterval(interval); // Cleanup
  }, []);



  if (loading) {
    console.log("loading")
    return <Loading/>;
  }

  return (
    <div>
      {pokemons.map((pokemon) =>{
        return(
          <motion.img
            key={pokemon.id}
            onClick={()=>pokemonClick(pokemon)}
            src={pokemon.imgUrl}
            alt="Pokemon"
            className="pokemon-sprite"
            initial={{ opacity: 0, x: pokemon.position.x, y: pokemon.position.y }}
            animate={{ opacity: 1, x: pokemon.position.x, y: pokemon.position.y }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0, ease: "linear"  }}
            style={{ position: "absolute", width: "80px" }}
          />
        );
      })}

      {clickedPokemons.map((pokemon) =>{
        return(
          <motion.img
            key={pokemon.id}
            onClick={()=>pokemonClick(pokemon)}
            src={pokemon.imgUrl}
            alt="Pokemon"
            className="pokemon-sprite"
            initial={{ opacity: 0, x: pokemon.position.x, y: pokemon.position.y }}
            animate={{ opacity: 1, x: pokemon.position.x, y: pokemon.position.y }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0, ease: "linear" }}
            style={{ position: "absolute", width: "80px" }}
          />
        )
      })}
      
    </div>
  );
}

