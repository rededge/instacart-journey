import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { InteractionManager } from "three.interactive";
import * as TWEEN from "@tweenjs/tween.js";


const canv = document.getElementById("myCanvas");

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera();

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);

const panPoints = [
  {
    obj: createCube({ color: 0xff00ce, x: -1, y: -1 }),
    objName: "pink",
    rotation: new THREE.Euler(0, .785, 0,),
    distanceFromObj: 5
  },
  {
    obj: createCube({ color: 0x9300fb, x: 1, y: -1 }),
    objName: "purple",
    rotation: new THREE.Euler(0, 0, .785,),
    distanceFromObj: 5
  },
  {
    obj: createCube({ color: 0x0065d9, x: 1, y: 1 }),
    objName: "blue",
    rotation: new THREE.Euler(.785, 0, 0,),
    distanceFromObj: 5
  },
  {
    obj: createCube({ color: 0x00d7d0, x: -1, y: 1 }),
    objName: "cyan",
    rotation: new THREE.Euler(0, 0, 0,),
    distanceFromObj: 5
  },
];
panPoints[0].obj.rotateY(.785);
panPoints[1].obj.rotateZ(.785);
panPoints[2].obj.rotateX(.785);

panPoints.forEach(function(item) 
{
  item.obj.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log(`${item.objName} cube was clicked`);
    const target = { xPos: camera.position.x, yPos: camera.position.y, zPos: camera.position.z, 
      xRot: camera.rotation.x, yRot: camera.rotation.y, zRot: camera.rotation.z };
    var itemPos = new THREE.Vector3(item.obj.position.x, item.obj.position.y, item.obj.position.z);
    const endPos = itemPos.add((new THREE.Vector3(0, 0, 1).applyEuler(item.rotation)).multiplyScalar(item.distanceFromObj));
    new TWEEN.Tween(target)
      .to({ xPos: endPos.x, yPos: endPos.y, zPos: endPos.z, xRot: item.rotation.x, yRot: item.rotation.y, zRot: item.rotation.z})
      .onUpdate(() => {
        camera.rotation.set(target.xRot, target.yRot, target.zRot);
        camera.position.set(target.xPos, target.yPos, target.zPos);
      }).start();
  });
  item.obj.addEventListener("mouseover", (event) => {
    item.obj.material.color.addScalar(.25);
  });
  item.obj.addEventListener("mouseout", (event) =>{
    item.obj.material.color.addScalar(-.25);
  });
  interactionManager.add(item.obj);
  scene.add(item.obj);
});
//const controls = new OrbitControls(camera, renderer.domElement);

const light = createLight();

scene.add(light);

animate((time) => {
  renderer.render(scene, camera);
  interactionManager.update();
  TWEEN.update(time);
});

function createRenderer() 
{
  const renderer = new THREE.WebGLRenderer({ canvas: canv, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x27a0e6);
  return scene;
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3;
  return camera;
}

function createCube({ color, x, y }) 
{
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, 0);

  return cube;
}

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
  const light = new THREE.PointLight(0xffffff, 1, 1000);
  light.position.set(0, 0, 10);
  return light;
}

  /*
  const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
  );
  var loader = new GLTFLoader();
  
  loader.load("./free_car_001.gltf", function (gltf) {
    gltf.scene.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    gltf.scene.addEventListener("mouseover", (event) => {
      let meshes = event.target.children;
      for (let i = 0; i < meshes.length; i++) {
        meshes[i].material.color.set(0XAAAAAA);
      }
    });
    gltf.scene.addEventListener("mouseout", (event) => {
      let meshes = event.target.children;
      for (let i = 0; i < meshes.length; i++) {
        meshes[i].material.color.set(0XFFFFFF);
      }
    });
    interactionManager.add(gltf.scene)
    scene.add(gltf.scene);
    gltf.scene.position.set(0,-2,-10)
  });
  scene.add(new THREE.GridHelper(200, 50));
  const controls = new OrbitControls(camera, renderer.domElement);
  var ambientLight = new THREE.AmbientLight(0xffffff, 7);
  scene.add(ambientLight); 
  */

