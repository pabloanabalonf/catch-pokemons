import pokemonsNames from '../pokemons';

const pokemonsImagesLodaded = [];

export default (imageLoaded) => {
  const master = new Image();
  master.onload = () => {
    imageLoaded('masterImageLoaded');
  };
  master.src = '/public/master.png';

  const map = new Image();
  map.onload = () => {
    imageLoaded('mapImageLoaded');
  };
  map.src = '/public/map.png';

  const pokemons = {};
  pokemonsNames.forEach((name) => {
    const pokemon = new Image();
    pokemon.onload = () => {
      pokemonsImagesLodaded.push(name);
      if (pokemonsImagesLodaded.length === pokemonsNames.length) {
        imageLoaded('pokemonsImagesLoaded');
      }
    };
    pokemon.src = `/public/${name}.png`;
    pokemons[name] = pokemon;
  });
  return {
    master,
    map,
    pokemons
  };
}
