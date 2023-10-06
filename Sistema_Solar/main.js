import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import starsTexture from './src/img/2k_stars_milky_way.jpg';
import sunTexture from './src/img/2k_sun.jpg';
import mercuryTexture from './src/img/2k_mercury.jpg';
import saturnTexture from './src/img/2k_saturn.jpg';

import saturnRingTexture from './src/img/Atmosferas/2k_saturn_ring_alpha.png';

//Renderizador 
const renderer = new THREE.WebGL1Renderer();
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

//colocando a luz
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//inicializando os planetas
const textureLoad = new THREE.TextureLoader();

//Adicionando o Sol
const sunGeo = new THREE.SphereGeometry(15,25,20);
const sunMat = new THREE.MeshBasicMaterial({
  map:textureLoad.load(sunTexture)
});
const sun  = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun);

//Adicionando um Ponto de luz
const pointLight = new THREE.PointLight(0xffffff, 3, 300);
scene.add(pointLight);

//Inicalizando os outros planetas utilizando uma função
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

//Mercurio
const mercury = new createPlanet(5,mercuryTexture, 30);

//Saturno (contém anéis)
const saturn = new createPlanet(5,saturnTexture,150,{
  innerRadius:10,
  outerRadius:20,
  texture: saturnRingTexture
})


function animate(){
  sun.rotateY(0.002);

  mercury.planet.rotateY(0.01);
  mercury.planetObj.rotateY(0.01);
  
  saturn.planet.rotateY(0.01);
  saturn.planetObj.rotateY(0.01);

  renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate)