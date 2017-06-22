export default (imageLoaded) => {
  const master = new Image();

  master.onload = () => {
    imageLoaded('masterImageLoaded');
  };
  master.src = '/public/hero.png';

  const monster = new Image();
  monster.onload = () => {
    imageLoaded('monsterImageLoaded');
  };
  monster.src = '/public/monster.png';

  const map = new Image();
  map.onload = () => {
    imageLoaded('mapImageLoaded');
  };
  map.src = '/public/map.png';
  return {
    master,
    map,
    monster
  };
}
