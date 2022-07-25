import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { InteractionManager } from "three.interactive";
import { Color, TextureLoader } from 'three';
import * as anime from 'animejs/lib/anime.js';

const canv = document.getElementById("myCanvas");
const renderer = createRenderer();
const scene = createScene();
const camera = createCamera(3);
//camera.position.set(-99, 46, 102);
//camera.rotation.set(-.687, -.668, -.47);


const geometry = new THREE.SphereGeometry();
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } )
material.gradientMap = new THREE.TextureLoader().load('/fourTone.jpg');
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
sphere.position.set(-5,-5,0);
selectedObjects.push(sphere);

let selectedObjects = [];

let composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

let outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
composer.addPass( outlinePass );

composer.addPass(renderPass);
composer.addPass(outlinePass);
var params = {
    edgeStrength: 5,
    edgeGlow: 0,
    edgeThickness: 1.0,
    pulsePeriod: 0,
    usePatternTexture: false
};

let effectFXAA = new ShaderPass( FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
composer.addPass( effectFXAA );

outlinePass.edgeStrength = params.edgeStrength;
outlinePass.edgeGlow = params.edgeGlow;
outlinePass.visibleEdgeColor.set(0x000000);
outlinePass.hiddenEdgeColor.set(0x000000);
outlinePass.overlayMaterial.blending = THREE.CustomBlending;
outlinePass.selectedObjects = selectedObjects;

var mtlLoader = new MTLLoader();
var objLoader = new OBJLoader();
mtlLoader.load("./Lowpoly_City_Free_Pack.mtl", function(mats) {
    mats.preload();
    mats.materials["World ap"].polygonOffset = true;
    mats.materials["World ap"].polygonOffsetFactor = -.1;
    mats.materials.world
    objLoader.setMaterials(mats);
    objLoader.load("./Lowpoly_City_Free_Pack.obj", function(object){
      scene.add(object);
      object.scale.set(.05, .05, .05);
      selectedObjects.push(object);
    });
});
const ambLight = new THREE.AmbientLight(0xffffff, 1.25);
const light = createLight();

scene.add(ambLight);
scene.add(light);

const controls = new OrbitControls( camera, canv );
animate((time) => 
{;
  controls.update();
  composer.render();
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
