import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { InteractionManager } from "three.interactive";
import * as TWEEN from "@tweenjs/tween.js";
import { Color } from 'three';
import * as anime from 'animejs/lib/anime.js';

const canv = document.getElementById("myCanvas");
const renderer = createRenderer();
const scene = createScene();
const camera = createCamera(3);
camera.position.set(-99, 46, 102);
camera.rotation.set(-.687, -.668, -.47);

var mtlLoader = new MTLLoader();
var objLoader = new OBJLoader();

mtlLoader.load("./Lowpoly_City_Free_Pack.mtl", function(mats){
    mats.preload();
    objLoader.setMaterials(mats);
    objLoader.load("./Lowpoly_City_Free_Pack.obj", function(object){
      scene.add(object);
      object.scale.set(.05, .05, .05);
    });
});

const ambLight = new THREE.AmbientLight(0xffffff, 1.5);
const light = createLight();

scene.add(ambLight);
scene.add(light);

const controls = new OrbitControls( camera, canv );
animate((time) => 
{;
  controls.update();
  renderer.render(scene, camera);
});

function animate(callback) 
{
  function loop(time) 
  {
    callback(time);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function createLight() 
{
  const light = new THREE.PointLight(0xffffff, 2, 10000);
  light.position.set(0, 100, 100);
  return light;
}

function createCamera(zPos) 
{
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    50000
  );
  camera.position.z = zPos;
  return camera;
}

function createRenderer() 
{
  const renderer = new THREE.WebGLRenderer({ canvas: canv, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

function createScene() 
{
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x27a0e6);
  return scene;
}
