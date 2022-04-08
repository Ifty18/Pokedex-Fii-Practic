const Card = function Card( pokemon ) { 
  //storing the name of the pokemon
  const name = pokemon.pokemon.name.charAt(0).toUpperCase() + pokemon.pokemon.name.slice(1);
  //we have to see if the card can be shown or not
  let display = "visible";

  //the pokemon id must look like this #023
  //since they have different lenghts, we must treat every scenario
  let id = pokemon.pokemon.id;
  let rawid = id;
  id = id.toString();
  if (id.length === 1){
    id = "#00" + id;
  } else if (id.length === 2){
    id = "#0" + id;
  } else if (id.length === 3){
    id = "#" + id;
  }

  //getting the picturefront_default;
  const image = pokemon.pokemon.sprites.other["official-artwork"].front_default;
  //building the Attributes component
  function Attributes (pokemon){
    //each pokemon has either one or two arguments
    let numberOfAttributes =  pokemon.pokemon.pokemon.types.length;
    if (numberOfAttributes === 1){
      let attribute1 = pokemon.pokemon.pokemon.types[0].type.name;
      return (
        <div className="cardAttributes">
          <h1 id="attributeBox" className={`card-pokemon-name-and-id-font ${attribute1}2`}>{attribute1}</h1>
        </div>
      );
    } else if (numberOfAttributes === 2) {
      let attribute1 = pokemon.pokemon.pokemon.types[0].type.name;
      let attribute2 = pokemon.pokemon.pokemon.types[1].type.name;
      return (
        <div>
          <h1 id="attributeBox" className={`card-pokemon-name-and-id-font ${attribute1}2`}>{attribute1}</h1>
          <h1 id="attributeBox" className={`card-pokemon-name-and-id-font ${attribute2}2`}>{attribute2}</h1>
        </div>
      );
    }
  }

  //the variable "color" will store the className of the card. This action is needed since each pokemon attribute has a specific color. Ex: grass-green, fire-orange, water-blue, etc.
  let color = pokemon.pokemon.types[0].type.name;
  
  return (
  <a href={"pokemon/" + rawid} className="cardAnchorTag">
    <div className={`card ${color} ${display}`} id="card1">
      <div className="cardHeader cardUpperText">
        <h2 className="card-pokemon-name-and-id-font">{name}</h2>
        <h2 className="card-pokemon-name-and-id-font">{id}</h2>
      </div>
      <div className="cardBody">
        <Attributes pokemon={pokemon}/>
        <img src={image} id="image" alt="pokemon"></img>
      </div>
    </div>
  </a>
  );
};

export default Card;
