import { useState, useContext, useEffect, useCallback } from 'react';
// import pokemons from '../data/data.json';
import TitleBar from "./TitleBar.jsx";
import Card from "../js/Card.jsx";
import PokemonStore from '../store/pokemonsStore';
import axios from "axios";
import RotateLoader from "react-spinners/RotateLoader";
import { motion } from 'framer-motion';

const pokemonsOnPage = 15;

const StartPage = function StartPage( pokemon ) { 

  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState(pokemons);
  const {count, increment} = useContext(PokemonStore);
  const [loading, setLoading] = useState(true);
  let firstIteration = true;
  const fetchPokemonData = useCallback(async () => {
    let numberOfPokemonsToCallFromApi = 15;
    if( firstIteration === true ) {
      numberOfPokemonsToCallFromApi = pokemons.length + pokemonsOnPage + count; 
      firstIteration = false;
    }

    if ( numberOfPokemonsToCallFromApi >= 60 ){
      let auxVariable = (numberOfPokemonsToCallFromApi - 30);
      auxVariable = auxVariable / 2;
      numberOfPokemonsToCallFromApi = numberOfPokemonsToCallFromApi - auxVariable;
    }

    const promiseArr = [];
    
    for (
      let i = pokemons.length + 1;
      i <= numberOfPokemonsToCallFromApi;
      i++
    ) {
      promiseArr.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
    }

    const resolvedData = await Promise.all(promiseArr);
    return resolvedData.map((data) => data.data);
  });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const resp = await fetchPokemonData();
      setPokemons(resp);
      setFilteredPokemon(resp);
      setLoading(false);
    };
    fetchData();

    return () => {
      setPokemons([]);
      setFilteredPokemon([]);
    };
  }, []);

  const filteredSearch = (searchTerm) =>{
    const filteredPokemon = pokemons.filter((pokemon) => {
      for (const type of pokemon.types) {
        if (
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pokemon.id.toString().includes(searchTerm) ||
          type.type.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
    setFilteredPokemon(filteredPokemon);
  }
  
  // console.log(filteredPokemon);
  return (
    <div id="App">
      { loading ? (
        <div className="rotateLoader">
          <RotateLoader color={"#FAB003"} size={32} margin={40} />
        </div>
      ) : (
        <div>
          <TitleBar/>
          <div>
            <input id = "searchBar" placeholder = "search pokemon name, number or type.." onChange={(event) => filteredSearch(event.target.value)}></input>
          </div>
          <div id="cardsContainer">
            {filteredPokemon.map(pokemon => (
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              whileHover={{ y:-20 }}
              transition={{duration:0.4}}
            >
              <Card pokemon={pokemon}/>
            </motion.div>
            ))}
          </div>
          <motion.div whileHover={{ scale: 1.05, originX: 0, originY: 0}}>
            <button id="load-more-pokemons" onClick={() => {
              increment(); 
              fetchPokemonData().then((newPokemons) => {
                setPokemons((prevPokemons) => [...prevPokemons, ...newPokemons]);
                setFilteredPokemon((prevPokemons) => [...prevPokemons, ...newPokemons]);});
            }}>Load 15 more pokemons</button>
          </motion.div>
        </div>
      )
    }  
  </div>
  );
};

export default StartPage;
