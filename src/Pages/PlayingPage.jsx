import React, { useState, useEffect } from 'react';
import Loading from "../Components/Loading.jsx"

//Cache Data Next
export default function PlayingPage({color, size}) {
  const [pokemons, setPokemons] = useState([]); // State to hold fetched pokemons
  const [loading, setLoading] = useState(true); // Loading state
  const [position, setPosition] = useState({x:0, y:0}); //position state

  const fetchPokemons = async () => {

    //Check local storage
    const cachedPokemons = localStorage.getItem(`pokemons-${color}`);
    const pokemonSet = [];

    if (cachedPokemons) {
      // If cached data exists, use it
      console.log('Using cached data');
      pokemonSet = JSON.parse(cachedPokemons);
    }else {
      console.log('Fetching Pokemon Data');
      const urlString = `https://pokeapi.co/api/v2/pokemon-color/${color}`;
      const response = await fetch(urlString);
      const data = await response.json();
      console.log(data)

      // Fetch details for each Pokémon Species (this contains URLs to pokemon species detail page)
      const pokemonSpeciesDetails = await Promise.all(
        data.pokemon_species.map(species => fetch(species.url).then(res => res.json()))
      );

      //Fetch details for each pokemon of each Species
      pokemonSet = await Promise.all(
          pokemonSpeciesDetails.map(species => fetch(`https://pokeapi.co/api/v2/pokemon/${species.varieties[0].pokemon.name}`).then(res => res.json()))
      );

      // Cache the fetched data in localStorage for future use
      localStorage.setItem(`pokemons-${color}`, JSON.stringify(pokemonSet));
    }
      
    // Pick 10 random pokemons of the chosen color
    const randomPokemons = [];
    while (randomPokemons.length < size && pokemonSet.length > 0) {
      const randomIndex = Math.floor(Math.random() * pokemonSet.length);
      const pokeInfo = pokemonSet.splice(randomIndex, 1)[0];
      randomPokemons.push({name: pokeInfo.name, id: pokeInfo.id, imgUrl:pokeInfo.sprites.front_default});
    }
    
    return randomPokemons
  };

  useEffect(() => {
    // Fetch pink Pokémon data from the Pokémon API
    fetchPokemons()
    .then(data => {
        // Set state with the selected 10 random pink Pokémon
        setPokemons(data);
        setLoading(false); // Update loading state
    })
    .catch(error => {
      console.log("Error fetching Pokemon:", error);
      setLoading(false);
    });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a new random position
      setPosition({
        x: Math.random() * 300 - 150, // Random X (-150 to 150)
        y: Math.random() * 300 - 150, // Random Y (-150 to 150)
      });
    }, 1000); // Move every second

    return () => clearInterval(interval); // Cleanup
  }, [])



  if (loading) {
    console.log("loading")
    return <Loading/>;
  }

  return (
    <div>
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>
            <h3>{pokemon.name}</h3>
            <motion.img
              src={imgUrl}
              alt="Pokemon"
              className="pokemon-sprite"
              animate={{ x: position.x, y: position.y }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{ position: "absolute", width: "80px" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

