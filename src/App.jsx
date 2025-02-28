import { createContext, useState, useContext, useEffect } from 'react';
import './App.css'

const apiUrl = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";

const PokeStateContext = createContext(null);

function App() {
  const [isSubmit,setIsSubmit] = useState(false);
  const [pokeData, setPokeData] = useState({});

  return (
    <div className='container'>
      <label className='label'>Search for Pokémon Name or ID:</label>
      <PokeStateContext.Provider value={{ isSubmit, setIsSubmit , pokeData, setPokeData}}>
        <SearchPokemonForm />
        <>
          <PokemonDisplay />
          <PokemonStats pokeStats={pokeData.stats}/>
        </>
      </PokeStateContext.Provider>
    </div>
  );
}


function SearchPokemonForm() {

  const { setIsSubmit, setPokeData } = useContext(PokeStateContext);

  async function handleSubmit (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const pokeNameOrId = formData.get('pokemonInput');

    try{
      setIsSubmit((prev) => false);
      const response = await fetch(`${apiUrl}/${pokeNameOrId}`)
      if (!response.ok){
        alert('Pokemon not found!');
        return;
      }
      const data = await response.json();
      setPokeData(data);
      setIsSubmit((prev) => !prev); 
    }catch(err){
      console.log(err);
      setPokeData({});
    }
  }

  return (
    <form method='get' onSubmit={handleSubmit}>
      <input
        name='pokemonInput'
        type='text'
        className='search-input'
        required
      >
      </input>
      <button
        type='submit'
        className='search-button'
      >Search</button>
    </form>
  )
}

function PokemonDisplay() {
  const { isSubmit, pokeData } = useContext(PokeStateContext);

  return(
    <div className="portrait">
      {isSubmit && (
        <PokemonNameAndId 
          pokeName={pokeData.name?.toUpperCase()}
          pokeId={pokeData.id}
        />
      )}
      {isSubmit && (
        <PokemonWeightHeight 
          pokeWeight={pokeData.weight}
          pokeHeight={pokeData.height}
        />
      )}
      {isSubmit && (
        <PokemonSprite spriteUrl={pokeData.sprites?.front_default}/>
      )}
      {isSubmit && (
        <PokemonType pokeTypes={pokeData.types.map(t => t.type.name)}/>
      )}
    </div>
  );
}

function PokemonNameAndId({ pokeName, pokeId }) {
  return(
    <div className="poke-info">
      <span id="pokemon-name">{pokeName}</span><span id="pokemon-id">#{pokeId}</span>
    </div>
  );
}

function PokemonWeightHeight({ pokeWeight, pokeHeight}) {
  return (
    <div className='poke-info'>
      <span id="weight">Weight: {pokeWeight}</span><span id="height">Height: {pokeHeight}</span>
    </div>
  )
}

function PokemonSprite({spriteUrl}) {

  return (
    <>
      <img src={spriteUrl} alt="pokemon-sprite" id="sprite"></img>
    </>
  );
}

function PokemonType({pokeTypes}) {
  return (
    <div id='types'>
      {
        pokeTypes.map((type, index) => (
          <span key={index} className={type}>
            {type.toUpperCase()}
          </span>
        ))
      } 
    </div>
  )
}

function PokemonStats({pokeStats = []}) {
  const {isSubmit} = useContext(PokeStateContext);

  return (
    <table className="stats">
      <thead>
        <tr>
            <th className="base">Base</th>
            <th className="stat">Stats</th>
        </tr>
      </thead>
      <tbody>
        {[
          {name: "hp", base_stat: "HP"},
          {name: "attack", base_stat: "Attack"},
          {name: "defense", base_stat: "Defense"},
          {name: "special-attack", base_stat: "Sp. Attack"},
          {name: "special-defense", base_stat: "Sp. Defense"},
          {name: "speed", base_stat: "Speed"},
        ].map((stat,index) => (
          <tr key={index}>
            <td className="base">{stat.base_stat}:</td>
            <td className="stat">
              {isSubmit && pokeStats
                ? pokeStats.find((s) => s.stat.name === stat.name)?.base_stat
                : "" }
            </td>
          </tr>
        ))}
      </tbody>
  </table>
  )
}

export default App
