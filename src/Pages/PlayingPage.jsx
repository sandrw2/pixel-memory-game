import React, { useState, useEffect } from 'react';
import Loading from "../Components/Loading.jsx"

//Cache Data Next
export default function PlayingPage({color, size}) {
  const [pokemons, setPokemons] = useState([]); // State to hold fetched pokemons
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch pink Pokémon data from the Pokémon API
    const fetchPokemons = async () => {
      try {
        console.log('Color:', color);
        const urlString = `https://pokeapi.co/api/v2/pokemon-color/${color}`;
        const response = await fetch(urlString);
        const data = await response.json();
        console.log(data)

        // Fetch details for each Pokémon Species (this contains URLs to pokemon species detail page)
        const pokemonSpeciesDetails = await Promise.all(
          data.pokemon_species.map(species => fetch(species.url).then(res => res.json()))
        );

        //Fetch details for each pokemon of each Species
        const pokemonDetails = await Promise.all(
            pokemonSpeciesDetails.map( species => fetch(`https://pokeapi.co/api/v2/pokemon/${species.varieties[0].pokemon.name}`).then(res => res.json()))
        );

        // Pick 10 random pink Pokémon
        const randomPokemons = [];
        while (randomPokemons.length < size && pokemonDetails.length > 0) {
          const randomIndex = Math.floor(Math.random() * pokemonDetails.length);
          const pokeInfo = pokemonDetails.splice(randomIndex, 1)[0];
          console.log(pokeInfo)
          randomPokemons.push({name: pokeInfo.name, id: pokeInfo.id, imgUrl:pokeInfo.sprites.front_default});
          console.log("Pokemeon added")
        }

        // Set state with the selected 10 random pink Pokémon
        setPokemons(randomPokemons);
        setLoading(false); // Update loading state
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) {
    console.log("loading")
    return <Loading/>;
  }

  return (
    <div>
      <h1>10 Random Pokémon</h1>
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>
            <h3>{pokemon.name}</h3>
            <img 
              src={pokemon.imgUrl} 
              alt={pokemon.name} 
              width={100} 
              height={100} 
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

