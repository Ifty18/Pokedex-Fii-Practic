import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import TitleBar from "./TitleBar.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import RotateLoader from "react-spinners/RotateLoader";
import { motion } from 'framer-motion';


const Pokemon = function Pokemon( props ) {
  const param = useParams(); //param stores the id of the pokemon. We will use it to search for the respective pokemon in the JSON file

  //TODO 898
  // if ( param.pokemonId >= 900 ) {
  //   return (
  //     <div >
  //       <Link to="/" className="cardAnchorTag"> <h1 id="pokemon-does-not-exist-message">Pokemon does not exist. Go back to homepage</h1> </Link>
  //       <img id="snorlax" alt="snorlax error page" src="https://dazzling-panini-599909.netlify.app/static/media/snorlax_404.116af90a27db7b4bead3.png"></img>
  //     </div>
  //   );
  //  }

    const [pokemonEvolutions, setPokemonEvolutions] = useState(null);
    const [prevPokemon, setPrevPokemon] = useState(null);
    const [nextPokemon, setNextPokemon] = useState(null);
    const [secondPokemonData, setSecondPokemonData] = useState(null);
    const [pokemonDescription, setPokemonDescription] = useState(null);
    const [pokemonId, setPokemonId] = useState(null);
    const [pokemonName, setPokemonName] = useState(null);
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

      setLoading(true);
      const fetchData = async () => {
        const result = await axios("https://pokeapi.co/api/v2/pokemon/" + param.pokemonId);

        try {
          let pvPokemon = await axios("https://pokeapi.co/api/v2/pokemon/" + ( parseInt(param.pokemonId)-1 ));
          pvPokemon = "https://img.pokemondb.net/sprites/black-white/anim/normal/" + pvPokemon.data.name + ".gif";
          setPrevPokemon(pvPokemon);
        } catch {
          
        }
        
        try {
          let nextPokemon = await axios("https://pokeapi.co/api/v2/pokemon/" + ( parseInt(param.pokemonId)+1 ));
          nextPokemon = "https://img.pokemondb.net/sprites/black-white/anim/normal/" + nextPokemon.data.name + ".gif";
          setNextPokemon(nextPokemon);
        } catch {

        }

        setPokemonData(result.data);
        setPokemonName(result.data.name.charAt(0).toUpperCase() + result.data.name.slice(1));
        setPokemonId(BeautifyId(result.data.id));
        const descriptionUrl = result.data.species.url;
        const secondPokemonApi = await axios("" + descriptionUrl);
        const finalDescription = secondPokemonApi.data.flavor_text_entries[0].flavor_text.replace(/[^a-zA-Z.é' ]/g, " ") + " " + secondPokemonApi.data.flavor_text_entries[2].flavor_text.replace(/[^a-zA-Z.é' ]/g, " ") + " " + secondPokemonApi.data.flavor_text_entries[3].flavor_text.replace(/[^a-zA-Z.é' ]/g, " ");
        setPokemonDescription(finalDescription);
        setSecondPokemonData(secondPokemonApi.data);



        // console.log(result.data);
        // console.log(result.data.species.url);
        const chain = await axios(result.data.species.url);
        // console.log(chain.data.evolution_chain.url);
        const chain2 = await axios(chain.data.evolution_chain.url);
        // console.log(chain2);
        var evoChain = [];
        var evoData = chain2.data.chain;

        do {
          var evoDetails = evoData['evolution_details'][0];
          // console.log(evoData.species.url);
          const evolutionId = await axios(evoData.species.url);
          // console.log(evolutionId.data.id);
          const evolutionPokemon = await axios("https://pokeapi.co/api/v2/pokemon/" + evolutionId.data.id);
          // console.log(evolutionPokemon);
          
          evoChain.push({
            "species_name": evoData.species.name,
            "min_level": !evoDetails ? 1 : evoDetails.min_level,
            "trigger_name": !evoDetails ? null : evoDetails.trigger.name,
            "item": !evoDetails ? null : evoDetails.item,
            "id": BeautifyId(evolutionId.data.id),
            "cleanId": evolutionId.data.id,
            "picture": evolutionPokemon.data.sprites.other["official-artwork"].front_default
          });

          evoData = evoData['evolves_to'][0];
        } while (!!evoData && evoData.hasOwnProperty('evolves_to'));

        console.log(evoChain);
        setPokemonEvolutions(evoChain);

        setLoading(false);
      };

      fetchData();
    }, []);


  function BeautifyId (id){
    id = id.toString();
  if (id.length === 1){
    id = "#00" + id;
  } else if (id.length === 2){
    id = "#0" + id;
  } else if (id.length === 3){
    id = "#" + id;
  }
  return id;
  }

  function Attributes (){
    if( pokemonData.types.length === 1 ){ 
      return (
        <div className="attributes-to-the-right">
          <div className="relative-up">
            <h1 id="attributeBox" className={`pokemon-details-attributes top-left-card-numbers-font bolder ${pokemonData.types[0].type.name}2`}>{pokemonData.types[0].type.name}</h1>
          </div>
        </div>
      );
    } else {
      return (
        <div className="attributes-to-the-right">
          <div className="relative-up">
            <div className="inline-attributes">
              <h1 id="attributeBox" className={`pokemon-details-attributes top-left-card-numbers-font bolder ${pokemonData.types[0].type.name}2`}>{pokemonData.types[0].type.name}</h1>
              <h1 id="attributeBox" className={`pokemon-details-attributes top-left-card-numbers-font bolder ${pokemonData.types[1].type.name}2`}>{pokemonData.types[1].type.name}</h1>
            </div>
          </div>
        </div>
      );
    }
  }

  function DisplayPokemonEvolutions() {
    return(
      <div className="evolutions-wrapper">
        <div>
        {
          pokemonEvolutions.map( item => {
            return(
            <a href={"../pokemon/" + `${item.cleanId}`}>
              <div className="individual-evolution">
                <div>
                  <h3 className="evolutions-names regular-text-font-style bolder">
                    {item.species_name.charAt(0).toUpperCase() + item.species_name.slice(1)}
                  </h3>
                  <img src={item.picture} className="evolution-picture"></img>
                  <div className="transparent-box">
                    <h4 className="bottom-evolutions-card-numbers-font">{item.id}</h4>
                  </div>
                  
                </div>
              </div>
            </a>
            );
          })
        }
        </div>
      </div>
    )
  }

  return (
    <div id="App">
      { loading ? ( 
        <div className="rotateLoader">
          <RotateLoader color={"#FAB003"} size={32} margin={40} />
        </div> ) : (
        <div className="center-wrapper">
          <Link to="/" className="cardAnchorTag"><TitleBar /></Link>
          <div id="page-top-side">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} whileHover={{ scale:1.01 }} transition={{duration:0.3}} id="big-left-card" className={`${pokemonData.types[0].type.name}`}>
              <div id="details-card-header" className="inline-attributes">
                <div>
                  <h2 id="details-pokemon-name" className="left-top-card-pokemon-name"> {pokemonName} </h2>
                  <h4 id="details-pokemon-id" className="top-left-card-numbers-font">
                    {pokemonId}
                  </h4>
                </div>
              </div>
              <div>
                <img src={pokemonData.sprites.other["official-artwork"].front_default} id="pokemon-details-big-picture" alt="pokemon-big"></img>
              </div>
              <div id ="left-big-card-footer">
                <Attributes/>
              </div>
            </motion.div>
            <div id="right-top-side">
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} whileHover={{ scale:1.01 }} transition={{duration:0.3}} id="text-box" className={`${pokemonData.types[0].type.name}`}>
                <div className="text-box-wrapper">
                  <h2 className="box-title-font-style">
                    Description
                  </h2>
                  <p className="text-font regular-text-font-style">
                    {pokemonDescription}
                  </p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} whileHover={{ scale:1.02 }} transition={{duration:0.3}} id="stats-box" className={`${pokemonData.types[0].type.name}`}>
                <h2 id="stats-title" className="box-title-font-style">Stats</h2>
                <div className="stat-bar-wrapper">
                  <h4 className="stat-bar-title regular-text-font-style bolder">HP</h4>
                  <div className="stat-bar-line"><motion.div whileHover={{rotate: 12}} className="bar bar1" style={{ width : pokemonData.stats[0].base_stat}}></motion.div></div>
                  <h4 className="stat-bar-value regular-text-font-style bolder">{pokemonData.stats[0].base_stat}</h4>
                </div>
                <div className="stat-bar-wrapper">
                  <h4 className="stat-bar-title regular-text-font-style bolder">Attack</h4>
                  <div className="stat-bar-line"><motion.div whileHover={{rotate: 12}} className="bar bar2" style={{ width : pokemonData.stats[1].base_stat}}></motion.div></div>
                  <h4 className="stat-bar-value regular-text-font-style bolder">{pokemonData.stats[1].base_stat}</h4>
                </div>
                <div className="stat-bar-wrapper">
                  <h4 className="stat-bar-title regular-text-font-style bolder">Defense</h4>
                  <div className="stat-bar-line"><motion.div whileHover={{rotate: 12}} className="bar bar3" style={{ width : pokemonData.stats[2].base_stat }}></motion.div></div>
                  <h4 className="stat-bar-value regular-text-font-style bolder">{pokemonData.stats[2].base_stat}</h4>
                </div>
                <div className="stat-bar-wrapper">
                  <h4 className="stat-bar-title regular-text-font-style bolder">Special attack</h4>
                  <div className="stat-bar-line"><motion.div whileHover={{rotate: 12}} className="bar bar4" style={{ width : pokemonData.stats[3].base_stat}}></motion.div></div>
                  <h4 className="stat-bar-value regular-text-font-style bolder">{pokemonData.stats[3].base_stat}</h4>
                </div>
                <div className="stat-bar-wrapper">
                  <h4 className="stat-bar-title regular-text-font-style bolder">Special defense</h4>
                  <div className="stat-bar-line"><motion.div whileHover={{rotate: 12}} className="bar bar5" style={{ width : pokemonData.stats[4].base_stat}}></motion.div></div>
                  <h4 className="stat-bar-value regular-text-font-style bolder">{pokemonData.stats[4].base_stat}</h4>
                </div>
                <div className="stat-bar-wrapper">
                  <h4 className="stat-bar-title regular-text-font-style bolder">Speed</h4>
                  <div className="stat-bar-line"><motion.div whileHover={{rotate: 12}} className="bar bar6" style={{ width : pokemonData.stats[5].base_stat}}></motion.div></div>
                  <h4 className="stat-bar-value regular-text-font-style bolder">{pokemonData.stats[5].base_stat}</h4>
                </div>
              </motion.div>

            </div>
          </div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} whileHover={{ scale:1.01 }} transition={{duration:0.3}} id="page-down-side" className={`${pokemonData.types[0].type.name}`}>
            <div>
              <h2 id="bottom-card-title" className="box-title-font-style">Sprites</h2>
            </div>
            <div id="bottom-card-footer">
              <div>
                <h3 className="front-back-titles regular-text-font-style bolder">Front shiny</h3>
                <img src={"https://img.pokemondb.net/sprites/black-white/anim/shiny/" + pokemonData.name + ".gif"} className="front-back-image" alt="front shiny"></img>
              </div>
              <div>
                <h3 className="front-back-titles regular-text-font-style bolder">Back shiny</h3>
                <img src={"https://img.pokemondb.net/sprites/black-white/anim/back-shiny/" + pokemonData.name + ".gif"} className="front-back-image" alt="back shiny"></img>
              </div>
              <div>
                <h3 className="front-back-titles regular-text-font-style bolder">Front default</h3>
                <img src={"https://img.pokemondb.net/sprites/black-white/anim/normal/" + pokemonData.name + ".gif"} className="front-back-image" alt="front default"></img>
              </div>
              <div>
                <h3 className="front-back-titles regular-text-font-style bolder">Back default</h3>
                <img src={"https://img.pokemondb.net/sprites/black-white/anim/back-normal/" + pokemonData.name + ".gif"} className="front-back-image" alt="back default"></img>
              </div>
            </div>
          </motion.div>
          <div id="bottom-last-section-wrapper">
            <div id="bottom-last-section">
                <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                whileHover={{ x:-25 }}
                transition={{duration:0.4}}
                id="previous-pokemon" className={`${pokemonData.types[0].type.name}`}>
                  { prevPokemon ? (
                    <a href={"../pokemon/" + (parseInt(param.pokemonId)-1)} className="prev-next-anchor-tag">
                      <div className="anchor-tag-surface">
                        <h3 className="prev-title regular-text-font-style ultra-bold">
                        Previous
                        </h3>
                        <img src={`${prevPokemon}`} alt="previous pokemon" className="front-back-image prev-gif"></img>
                      </div>
                    </a>
                  ) : (<h4 className="no-prev-pokemon-found-error regular-text-font-style bolder">No previous pokemon</h4>)}  
                </motion.div>

              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} whileHover={{ scale:1.01 }} transition={{duration:0.3}} id="evolution-box" className={`${pokemonData.types[0].type.name}`}>
                <div>
                  <h2 id="evolutions-title" className="box-title-font-style">
                    Evolutions
                  </h2>
                  <DisplayPokemonEvolutions/>
                </div>
              </motion.div>

              <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              whileHover={{ x:+25 }}
              transition={{duration:0.4}}
              id="next-pokemon" className={`${pokemonData.types[0].type.name}`}>
                { nextPokemon ? (
                  <a href={"../pokemon/" + (parseInt(param.pokemonId)+1)} className="prev-next-anchor-tag">
                    <div className="anchor-tag-surface">
                      <h3 className="next-title regular-text-font-style ultra-bold">
                        Next
                      </h3>
                      <img src={`${nextPokemon}`} className="front-back-image next-gif"></img>
                    </div>
                  </a>
                ) : (<h4 className="no-next-pokemon-found-error regular-text-font-style bolder">No more pokemons</h4>)}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pokemon;
