import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { InteractionManager } from "three.interactive";
import Stats from 'three/examples/jsm/libs/stats.module'
import anime from 'animejs/lib/anime.es.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import starUrl from './star.png';
import carUrl from './Instacart_Project_car.gltf';
import hilightBuildings from './Instacart_Project_residential.gltf';
import city from './Instacart_Project_Background.gltf';
import { RGBA_ASTC_5x4_Format } from 'three';



const stats = Stats()
document.body.appendChild(stats.dom);
const canv = document.getElementById("myCanvas");
var fps = document.getElementById("fps");
var mainPoint1 = document.getElementById("main-point1");
var mainPoint2 = document.getElementById("main-point2");
var mainPoint3 = document.getElementById("main-point3");
var learnMore = document.getElementById("learn-more");
var rotFactor = 1;


var point1Ps = mainPoint1.querySelectorAll("p");
let p1Idx =  0;

mainPoint1.querySelector(".next-btn").onclick = function()
{
  if (p1Idx < point1Ps.length - 1)
    p1Idx++;
  mainPoint1.querySelector(".prev-btn").style.display = "block";
  if (p1Idx == point1Ps.length - 1)
  {

    mainPoint1.querySelector(".next-btn").style.display = "none";
    flashCityAnim.play();
    cityGroup.addEventListener("mouseover", highlight);
    cityGroup.addEventListener("mouseout", unhighlight);
    cityGroup.addEventListener("click", cityClickHandler);
  }
  for (let i = 0; i < point1Ps.length; i++)
  {
    if (i == p1Idx)
    point1Ps[i].style.display = "block";
    else
      point1Ps[i].style.display = "none";
  }
}

mainPoint1.querySelector(".prev-btn").onclick = function()
{
  if (p1Idx > 0)
    p1Idx--;
  mainPoint1.querySelector(".next-btn").style.display = "block";
  if (p1Idx == 0)
    mainPoint1.querySelector(".prev-btn").style.display = "none";
  for (let i = 0; i < point1Ps.length; i++)
  {
    if (i == p1Idx)
    point1Ps[i].style.display = "block";
    else
      point1Ps[i].style.display = "none";
  }
}


const renderer = createRenderer();
const scene = createScene();
const camera = createCamera(3);


camera.position.set(48, 45.5, 46);
camera.rotation.set(-.85, .60, .57);
var initialCameraZ = 26;

const light = createLight();
light.castShadow = true;
light.position.set(20,20,20);
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default
const ambLight = new THREE.AmbientLight(0xffffff, .7);
scene.add(light);
scene.add(ambLight);
window.onresize = resize;
resize();

var _event = 
{
  y: 0,
  deltaY: 0
};

var percentage = 0;
// this is the container where we will attach the scroll event. For this example we will set its height to 1200vh.
var divContainer = document.querySelector('.container')
// container height - window height to limit the scroll at the top of the screen when we are at the bottom of the container
var maxHeight = ((divContainer.clientHeight || divContainer.offsetHeight) - window.innerHeight);
divContainer.addEventListener('wheel', onWheel, { passive: false });
divContainer.addEventListener('touchmove', onTouchMove, { passive: false });
divContainer.addEventListener('touchstart', onTouchStart, { passive: false });

var touchStartY = 0;

function onTouchStart (e) {
  var t = (e.targetTouches) ? e.targetTouches[0] : e;
  touchStartY = t.pageY;
}

function onTouchMove (e) {
  var evt = _event;
  var t = (e.targetTouches) ? e.targetTouches[0] : e;
  // the multiply factor on mobile must be about 10x the factor applied on the wheel
  evt.deltaY = (t.pageY - touchStartY) * 5;
  touchStartY = t.pageY;
  scroll(e)
}

function onWheel (e)
{
  var evt = _event;
  evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
  // reduce by half the delta amount otherwise it scroll too fast (in a other way we could increase the height of the container too)
  evt.deltaY *= 0.5;
  scroll(e);
};

function scroll (e) 
{
  var evt = _event;
  if ((evt.y + evt.deltaY) > 0 ) {
    evt.y = 0;
  } 
  else if ((-(evt.y + evt.deltaY)) >= maxHeight) {
    evt.y = -maxHeight;
  } 
  else {
      evt.y += evt.deltaY;
  }
}

// linear interpolation function
function lerp(a, b, t) 
{
  return ((1 - t) * a + t * b);
}

let composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );


const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);
var cityGroup = new THREE.Group();
scene.add(cityGroup);
var loader = new GLTFLoader();

var cityMats = [];
var cityColors = [];
var residentialMats = [];
var residentialColors = [];
var houseMats = [];
var houseColors = [];
var saturationFactor = 0;
var lightFactor = .8;

const fourTone = new THREE.TextureLoader().load('fourTone.jpg');
const threeTone = new THREE.TextureLoader().load('threeTone.jpg');
fourTone.minFilter = THREE.NearestFilter;
fourTone.magFilter = THREE.NearestFilter;
threeTone.minFilter = THREE.NearestFilter;
threeTone.magFilter = THREE.NearestFilter;
const materialParams = {
  gradientMap: threeTone,
};

/*
const sphereGeometry = new THREE.SphereGeometry( 5, 32, 16 );
const sphereMaterial = new THREE.MeshToonMaterial( materialParams );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add( sphere );
sphere.position.set(0,20,0);
*/

loader.load("/Instacart_Project_Background.gltf", function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(0,0,0);
  gltf.scene.scale.set(.03,.03,.03);
  gltf.scene.rotation.set(0, -Math.PI/2, 0);
  gltf.scene.traverse((o) => {
    if (o.isMesh && !cityMats.includes(o.material)) {
      cityMats.push(o.material);
      cityColors.push(new THREE.Color(o.material.color.getHex()));
    }
  });
  cityGroup.add(gltf.scene);
});

loader.load("/Instacart_Project_residential_v2.gltf", function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(0,0,0);
  gltf.scene.scale.set(.03,.03,.03);
  gltf.scene.rotation.set(0, -Math.PI/2, 0);
  gltf.scene.traverse((o) => {
    if (o.isMesh && !residentialMats.includes(o.material)) {
      let hsl = {};
      o.material.color.getHSL(hsl);
      o.material.color.setHSL(hsl.h, hsl.s * saturationFactor, hsl.l * lightFactor);
      residentialMats.push(o.material);
      residentialColors.push(hsl);
    }
  });
  console.log(residentialMats.length);
  console.log(residentialColors.length);
  cityGroup.add(gltf.scene);
});

var deliveryHouse = new THREE.Scene();
loader.load("/Instacart_Project_house.gltf", function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(0,0,0);
  gltf.scene.scale.set(.03,.03,.03);
  gltf.scene.rotation.set(0, -Math.PI/2, 0);
  gltf.scene.traverse((o) => {
    if (o.isMesh && !houseMats.includes(o.material)) {
      let hsl = {};
      o.material.color.getHSL(hsl);
      o.material.color.setHSL(hsl.h, hsl.s * saturationFactor, hsl.l * lightFactor);
      houseMats.push(o.material);
      houseColors.push(hsl);
    }
  });
  cityGroup.add(gltf.scene);
  deliveryHouse = gltf.scene;
});


var car = new THREE.Scene();

loader.load(carUrl, function (gltf) {
  scene.add(gltf.scene);
  car = gltf.scene;
  car.traverse((o) => {
    if (o.isMesh && !cityMats.includes(o.material)) {
      cityMats.push(o.material);
      cityColors.push(new THREE.Color(o.material.color.getHex()));
    }
  });
  car.scale.set(.03,.03,.03);
  car.position.set(0, 0, initialCarZ);
  gltf.scene.rotation.set(0, -Math.PI/2, 0);
  cityGroup.add(car);
});


var phoneSceneGroup = new THREE.Group();
phoneSceneGroup.position.set(-20000, 20000, 20000);
scene.add(phoneSceneGroup);
var phoneCase = createCube({ color: 0xa1a1a1, x: 10, y: -1, z: -5});
phoneCase.scale.set(2, 4, .25);
var phoneLight = createLight();
phoneLight.position.set(10, 5, 0);
phoneSceneGroup.add(phoneLight);
phoneSceneGroup.add(phoneCase);
var starGeo = new THREE.BufferGeometry();
var verts = new Float32Array(1800);
for(let i = 0; i < 1800; i++) {
    verts[i] = Math.random() * 1000 - 500;
}
var pointProps = [];
for (let i = 0; i < 1800; i++) {
  pointProps.push({velocity: 0, acceleration: 0.02});
}
starGeo.setAttribute( 'position', new THREE.BufferAttribute( verts, 3 ) );
let sprite = new THREE.TextureLoader().load(starUrl);
var starMaterial = new THREE.PointsMaterial({
  size: 1.5,
  transparent: true,
  opacity: 0,
  map: sprite
});
let stars = new THREE.Points(starGeo, starMaterial);
phoneSceneGroup.add(stars);
var currCityBrightness = 0;
function highlight()
{
  flashCityAnim.pause();
  changeCityBrightness(.3);
}

function unhighlight()
{
  flashCityAnim.restart();
  flashCityAnim.play();
}

function changeCityBrightness(value)
{
  let factor = 1 + value;
  for (let c = 0; c < cityMats.length; c++)
  {
    cityMats[c].color.r = cityColors[c].r * factor;
    cityMats[c].color.g = cityColors[c].g * factor;
    cityMats[c].color.b = cityColors[c].b * factor;
  }
}

var flashCityAnim = anime({
  duration: 2250,
  loop: true,
  autoplay: false,
  update: function(anim) {
    changeCityBrightness(.15 * Math.sin((2*Math.PI * anim.progress)/100) + .05);
  }
});

var cameraPanInAnim = anime({
  targets: [camera.position],
  easing: 'easeInOutSine',
  duration: 2500,
  autoplay: false,
  x: .2,
  y: 3.5,
  z: initialCameraZ,
  complete: initTimeline
});

var cameraRotateInAnim = anime({
  targets: camera.rotation,
  easing: 'easeInOutSine',
  duration: 2500,
  autoplay: false,
  x: -.2,
  y: 0,
  z: 0,
});

var fadeMainPointAnim = anime({
  targets: '#main-point1',
  easing: 'easeInOutSine',
  duration: 1000,
  autoplay: false,
  opacity: 0
});

function cityClickHandler()
{
  cameraPanInAnim.play();
  cameraRotateInAnim.play();
  fadeMainPointAnim.play();
  unhighlight();
  cityGroup.removeEventListener("click", cityClickHandler);
  cityGroup.removeEventListener("mouseover", highlight);
  cityGroup.removeEventListener("mouseout", unhighlight);
  flashCityAnim.pause();
  changeCityBrightness(-currCityBrightness);
  canv.style.zIndex = -1;
}
interactionManager.add(cityGroup);
var mtlLoader = new MTLLoader();
var objLoader = new OBJLoader();
  
//create timeline
var animDurations = 
{
  beforeFirstStop: 1000,
  firstStop: 1500,
  afterFirstStop: 1000,
  secondStop: 1500,
  panOutToCity: 1500,
}

function getTimePosition(anim)
{
  let timePos = 0;
  for (const key of Object.keys(animDurations))
  {
    if (key == anim)
      return timePos;
    timePos += animDurations[key];
  }
  return -1;
}

function getTimelineLength()
{
  let timePos = 0;
  for (const key of Object.keys(animDurations))
    timePos += animDurations[key];
  return timePos;
}

var timelineLength = getTimelineLength();
var timeline;
var scrollDistance = -35;
var initialCarZ = -6.5;

var buttonPressed = false;
document.getElementById("learn-more-btn").onclick = function()
{
  if (buttonPressed) return;
  var opacity = window.getComputedStyle(learnMore).getPropertyValue("opacity");
  if (opacity <= .6) return;
  buttonPressed = true;
  timeline.pause();
  timeline = null;
  anime({
    targets: [camera.position],
    easing: 'easeInQuint',
    duration: 2250,
    x: phoneSceneGroup.position.x,
    y: phoneSceneGroup.position.y,
    z: phoneSceneGroup.position.z,
    begin: function(){
      camera.near = 20;
    },
    complete: function () {
      camera.rotation.set(0,0,0);
      camera.near = 1;
    }
  }); 
  anime({
    targets: ['#main-point3', '#learn-more'],
    easing: 'easeInOutSine',
    duration: 1000,
    opacity: 0,
    complete: function() {
      learnMore.style.display = "none";
    }
  });
  anime({
    targets: scene.background,
    easing: 'easeInQuad',
    duration: 1500,
    delay: 500,
    r: 15/255,
    g: 25/255,
    b: 60/255,
    complete: function() {
      updateStars = true;
      camera.far = 500;
    }
  });
  document.body.style.overflow = "hidden";
  anime({
    duration:1750,
    delay: 3200,
    easing: 'easeOutElastic(1.5, .5)',
    targets: phoneCase.position,
    x: 0
  });
  anime({
    duration: 580,
    delay: 3200,
    targets: [phoneCase.rotation],
    direction: 'alternate',
    easing: 'easeInElastic(3, 2)',
    z: .25
  });
  anime({
    targets: ['#main-point4'],
    easing: 'easeOutElastic(1, .65)',
    bottom: window.innerHeight - document.getElementById("main-point4").offsetHeight + "px",
    duration: 750,
    delay: 2200
  });
}


function initTimeline() 
{
  document.body.style.overflow = "auto";
  timeline = anime.timeline({
    autoplay: false,
    duration: timelineLength,
    easing: 'easeInOutSine'
  });

  //camera before stop 1
  timeline.add({
    targets: [camera.position],
    z: initialCameraZ + -23,
    duration: animDurations["beforeFirstStop"],
  });

  //car before stop 1
  timeline.add({ 
    targets: [car.position],
    z: initialCarZ + -23,
    duration: animDurations["beforeFirstStop"],
  }, getTimePosition("beforeFirstStop"));
}

function createFinalTimeline()
{
  timeline.add({ 
    targets: ["#main-point2"],
    easing: 'easeOutElastic(4, .65)',
    bottom: canv.offsetHeight - (mainPoint2.offsetHeight) + "px",
    duration: animDurations["beforeFirstStop"]/3,
  }, getTimePosition("beforeFirstStop") + animDurations["beforeFirstStop"]/5);

  //first stop
  timeline.add({
    duration: animDurations["firstStop"]/4,
    targets: ['#extra-fact1-1'],
    top: mainPoint2.offsetHeight + "px",
  }, getTimePosition("firstStop"));

  timeline.add({
    duration: animDurations["firstStop"]/3,
    targets: ['#extra-fact1-2'],
    top: pxTovh(mainPoint2.offsetHeight + document.getElementById('extra-fact1-1').offsetHeight) + 2 + "vh",
  }, getTimePosition("firstStop") + animDurations["firstStop"]/4);

  timeline.add({
    duration: 7 * animDurations["firstStop"]/8,
    easing: "easeInOutSine",
    targets: [camera.rotation],
    x: -.1,
    y: -.425 * rotFactor,
  }, getTimePosition("firstStop"));

  //camera after stop 1
  timeline.add({
    duration: 3 * animDurations["firstStop"]/4,
    easing: "easeInOutSine",
    targets: [camera.rotation],
    x: -.2,
    y: 0,
    z:0,
  }, getTimePosition("afterFirstStop"));

  timeline.add({
    duration: animDurations["afterFirstStop"],
    targets: camera.position,
    z: initialCameraZ - 43.5,
    }, getTimePosition("afterFirstStop"));

    //car after stop 1
    timeline.add({
      duration: animDurations["afterFirstStop"],
      targets: car.position,
      z: initialCarZ - 43.5,
    }, getTimePosition("afterFirstStop"));

    timeline.add({
      duration: timelineLength/10,
      targets: ['#extra-fact1-1', '#extra-fact1-2'],
      opacity: 0,
    }, getTimePosition("secondStop") - timelineLength/10);

    //stop 2
    timeline.add({
      duration: animDurations["secondStop"]/1.5,
      targets: '#extra-fact2',
      top: mainPoint2.offsetHeight + "px"
    }, getTimePosition("secondStop"));
    
    timeline.add({
      duration: animDurations["secondStop"] / 2,
      change: function(anim) {
        for (let i = 0; i < houseMats.length; i++) {
          let currSat = lerp(houseColors[i].s * saturationFactor, houseColors[i].s, anim.progress / 100);
          let currLit = lerp(houseColors[i].l * lightFactor, houseColors[i].l, anim.progress / 100);
          houseMats[i].color.setHSL(houseColors[i].h, currSat, currLit);
        }
      }
    }, getTimePosition("secondStop") + animDurations["secondStop"]/2);

    timeline.add({
      duration: animDurations["secondStop"]/2,
      targets: [camera.rotation],
      y: -.4 * rotFactor,
      x: -.1
    }, getTimePosition("secondStop") + animDurations["secondStop"]/2);

    timeline.add({
      duration: animDurations["panOutToCity"]/3,
      targets: ['#extra-fact2', "#main-point2"],
      opacity: 0,
    }, getTimePosition("panOutToCity") + animDurations["panOutToCity"]/3);

    timeline.add({
      duration: 2*animDurations["panOutToCity"] / 3,
      change: function(anim) {
        for (let i = 0; i < residentialMats.length; i++) {
          let currSat = lerp(residentialColors[i].s * saturationFactor, residentialColors[i].s, anim.progress / 100);
          let currLit = lerp(residentialColors[i].l * lightFactor, residentialColors[i].l, anim.progress / 100);
          residentialMats[i].color.setHSL(residentialColors[i].h, currSat, currLit);
        }
      }
      
    }, getTimePosition("panOutToCity") + animDurations["panOutToCity"]/3);

    timeline.add({
      duration: animDurations["panOutToCity"],
      targets: camera.position,
      x:  -48.5,
      y: 44,
      z: 47.6,
    }, getTimePosition("panOutToCity"));
    timeline.add({
      duration: animDurations["panOutToCity"],
      targets: camera.rotation,
      x: -.893,
      y: -0.588,
      z: -0.603,
    }, getTimePosition("panOutToCity"));
    timeline.add({
      duration: animDurations["panOutToCity"]/3,
      targets: ["#main-point3"],
      easing: 'easeOutElastic(10, .65)',
      bottom: window.innerHeight - (mainPoint3.offsetHeight) + "px",
    }, getTimePosition("panOutToCity")+ animDurations["panOutToCity"]/3);
    timeline.add({
      duration:animDurations["panOutToCity"]/3,
      targets: "#learn-more",
      opacity: 1,

    }, getTimePosition("panOutToCity") + 2*animDurations["panOutToCity"]/3);
}

function vhToPx(vh)
{
  return vh / 100 * document.documentElement.clientHeight;
}

function pxTovh(pixels)
{
  return pixels / document.documentElement.clientHeight * 100;
}

var prevTime = 0;
//const controls = new OrbitControls( camera, canv );
var updateStars = false;
var starFlyTime = 1;

var starBuff = starGeo.getAttribute('position');
var finalTimeline = false;
animate((time) => 
{
  //console.log("rot " + camera.rotation.x + ", " + camera.rotation.y + ", " + camera.rotation.z);
  //console.log("pos " + camera.position.x + ", " + camera.position.y + ", " + camera.position.z);
  fps.innerHTML = "fps: " +  Math.round(1000 / (time - prevTime));
  prevTime = time;
  if (!finalTimeline && window.scrollY / maxHeight > .04)
  {
    finalTimeline = true;
    createFinalTimeline();
  }
  percentage = lerp(percentage, window.scrollY, .03);  
  var timelinePoint =  timelineLength * (percentage / maxHeight);
  if (timeline) {
    timeline.seek(timelinePoint);
  }
  //controls.update();
  interactionManager.update();
  if (updateStars)
  {
    for (let i = 0; i < 600; i++) {
      pointProps[i].velocity += pointProps[i].acceleration;
      starBuff.setZ(i, starBuff.getZ(i) + pointProps[i].velocity);
      if (starBuff.getZ(i) > 0)
      {
        starBuff.setZ(i, -600);
        pointProps[i].velocity = 0;
      }
    }
    starBuff.needsUpdate = true;
    stars.rotation.z += 0.002;
    if (stars.material.opacity < .99)
      stars.material.opacity += .0025;
  }
  stats.update();
  composer.render();
});

function createRenderer() 
{
  const renderer = new THREE.WebGLRenderer({ canvas: canv, antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

function createScene() 
{
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF9F1E6);
  return scene;
}
  
function createCamera(zPos) 
{
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    4000
  );
  camera.position.z = zPos;
  return camera;
}
  
  function createCube({ color, x, y, z}) 
  {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
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
  const light = new THREE.PointLight(0xffffff, .5, 1000);
  light.position.set(0, 50, 90);
  return light;
}

function resize () 
{
  renderer.width = window.innerWidth;
  renderer.height = window.innerHeight;
  renderer.setSize(renderer.width, renderer.height);
  let aspect = renderer.width / renderer.height;
  camera.aspect = aspect;
  if (aspect < 1)
    handleMobileAspect();
  else
    handleDefautlAspect();
  camera.updateProjectionMatrix();
}


window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}


function handleMobileAspect()
{
  rotFactor = 2;
  camera.zoom = .7;
  camera.fov = 95;
  camera.updateMatrix();
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();
  camera.updateWorldMatrix();
  //initialCameraZ = 2.25;
  const textBoxes = document.querySelectorAll('.textbox');
  textBoxes.forEach(tb => {
    tb.style.width = "30vw";
    tb.style.fontSize = "100%";
  });
  const banners = document.querySelectorAll('.banner-point');
  banners.forEach(b => { 
    b.style.width = "75vw";
    b.style.fontSize = "175%";
  });
  mainPoint1.style.width = "40vw";
  mainPoint1.style.left = "5vw";
}

function handleDefautlAspect()
{
  rotFactor = 1;
  camera.zoom = 1;
  camera.fov = 75;
  //initialCameraZ = 3;
  const textBoxes = document.querySelectorAll('.textbox');
  textBoxes.forEach(tb =>{
    tb.style.width = "12.5vw";
    tb.style.fontSize = "150%";
  });
}
