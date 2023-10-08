import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from './src/img/Atmosferas/stars.jpg';
import sunTexture from './src/img/2k_sun.jpg';
import mercuryTexture from './src/img/2k_mercury.jpg';
import venusTexture from './src/img/2k_venus_surface.jpg';
import earthTexture from './src/img/2k_earth_daymap.jpg';
import marsTexture from './src/img/2k_mars.jpg';
import jupiterTexture from './src/img/2k_jupiter.jpg';
import saturnTexture from './src/img/2k_saturn.jpg';
import uranusTexture from './src/img/2k_uranus.jpg';
import neptuneTexture from './src/img/2k_neptune.jpg';

import saturnRingTexture from './src/img/Atmosferas/saturn ring.png';

//Renderizador 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Criando a instância da câmera

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
);

// Colocando o Background do Sistema Solar

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture
]);

//Colocando o Controle da orbita

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90,140,140);
orbit.update();

//Inializando a luz no sistema
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

//inicializando os planetas
const textureLoad = new THREE.TextureLoader();

//Adicionando o Sol
const sunGeo = new THREE.SphereGeometry(40,20);
const sunMat = new THREE.MeshBasicMaterial({
  map:textureLoad.load(sunTexture)
});
const sun  = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun);

//adicionando uma luz direcional
const light = new THREE.PointLight( 0xff0000, 1, 1000 );
light.position.set( 0, 0, 0 );
scene.add( light );

//Função para inicializar outros planetas 
function createPlanet(size,texture,position,ring){
  const geometry = new THREE.SphereGeometry(size,25,20);
  const material = new THREE.MeshStandardMaterial({
    map:textureLoad.load(texture)
  });
  const planet = new THREE.Mesh(geometry,material);
  const planetObj = new THREE.Object3D;
  planetObj.add(planet);
  scene.add(planetObj);
  planet.position.x = position

  if(ring){
    const RingGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius, 30
    );
    const RingMat = new THREE.MeshStandardMaterial({
      map:textureLoad.load(ring.texture),
      side : THREE.DoubleSide
    });
    const Ring = new THREE.Mesh(RingGeo,RingMat);
    planetObj.add(Ring);

    Ring.position.x = position;
    Ring.rotation.x = -0.5 * Math.PI;
  }
  return {planet,planetObj};
}

//Tamanho dos plaentas em escala com a terra

//Mercurio
const mercury = new createPlanet(3,mercuryTexture,70);

//Vênus
const venus = new createPlanet(4.6, venusTexture,120)

//Terra
const earth = new createPlanet(6, earthTexture, 220)

//Mars
const mars = new createPlanet(7.8, marsTexture, 300)

//Jupiter
const jupiter = new createPlanet(20,jupiterTexture,410)

//Saturno (contém anéis)
const saturn = new createPlanet(15,saturnTexture,500,{
  innerRadius:10,
  outerRadius:20,
  texture: saturnRingTexture
})

//Urano 
const uranus = new createPlanet(12,uranusTexture,700)

//netuno
const neptune = new createPlanet(10,neptuneTexture,800)

function animate(){
  sun.rotateY(0.002);

  mercury.planet.rotateY(0.174616); // Rotação dos planetas em torno de seu eixo (rotação diária)
  mercury.planetObj.rotateY(0.0203); // Órbita dos planetas ao redor do Sol (tempo para uma órbita completa)


  venus.planet.rotateY(0.048611);
  venus.planetObj.rotateY(0.008);
  
  earth.planet.rotateY(0.007272);
  earth.planetObj.rotateY(0.0049);
  
  mars.planet.rotateY(0.004107);
  mars.planetObj.rotateY(0.0026);

  jupiter.planet.rotateY(0.000434);
  jupiter.planetObj.rotateY(0.0004);
  
  saturn.planet.rotateY(0.000465);
  saturn.planetObj.rotateY(0.0002);
  
  uranus.planet.rotateY(0.000648);
  uranus.planetObj.rotateY(0.0001);
  
  neptune.planet.rotateY(0.000538);
  neptune.planetObj.rotateY(0.0001);

  renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
})