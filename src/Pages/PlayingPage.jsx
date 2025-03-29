import React, { useState, useEffect, useRef } from 'react';
import Loading from "../Components/Loading.jsx";
import {motion, AnimatePresence} from 'framer-motion';
import {Pokedex} from "pokeapi-js-wrapper";

//Cache Data Next
export default function PlayingPage({color, size}) {
  const [pokemons, setPokemons] = useState([]); // State to holds pokemon info --> name, img, positions
  const [loading, setLoading] = useState(true); // Loading state
  const hasFetched = useRef(false);
  

  const fetchPokemons = async () => {
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
          position: {x: Math.random() * 80 + "vw", y: Math.random() * 80 + "vh"}
        } 
      );
    }
    
    return randomPokemons
  };

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
      prevPokemons.map((pokemon) => ({
        ...pokemon,
        position: {x: Math.random() * 80 + 'vw', y: Math.random() * 80 + 'vh'}
      }))
    );
    }, 2000); // Move every second
    
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
            src={pokemon.imgUrl}
            alt="Pokemon"
            className="pokemon-sprite"
            animate={{ x: pokemon.position.x, y: pokemon.position.y }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ position: "absolute", width: "80px" }}
          />
        );
      })}
      
    </div>
  );
}

