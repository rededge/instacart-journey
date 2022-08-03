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
import carUrl from './free_car_001.gltf';



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

//camera.position.set(18000,22000,17000);
//camera.rotation.set(0,0,0);
camera.position.set(-34.26239634764333, 27.5, 17.327648759285232);
camera.rotation.set(-0.7647684463428301, -0.629728848719099, -0.5143735079666867);
var initialCameraZ = 3;

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
var leftBuildings = [];
var rightBuildings = [];
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

let selectedObjects = [];

let composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );


const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);
var cityGroup = new THREE.Group();
var loader = new GLTFLoader();

var oldCityMats = [];
var newCityMats = [];

//create city
scene.add(cityGroup);
let zStep = -3;
for (let c = 0; c < 10; c++)
{
  let cube = createCube({ color: 0x6c79a1, x: -2, y: 0, z: c*zStep});
  cube.scale.set(1,2.5,1);
  cityGroup.add(cube);
  leftBuildings.push(cube);
}

for (let c = 0; c < 10; c++)
{
  let cube = createCube({ color: 0x6c79a1, x: 2, y: 0, z: c*zStep});
  cube.scale.set(1,2.5,1);
  cityGroup.add(cube);
  rightBuildings.push(cube);
}
rightBuildings[4].material.color = new THREE.Color(0xc9c94f);
let street = createCube({color: 0X212121, x:0, y:-1, z:-18});
street.material.color.a
street.scale.set(2, .1, 40);
cityGroup.add(street);
let floor = createCube({color: 0Xa1a1a1, x:0, y:-2, z:-18});
floor.scale.set(40, 2, 40);
cityGroup.add(floor);

//phone scene
var phoneSceneGroup = new THREE.Group();
phoneSceneGroup.position.set(18000, 22000, 17000);
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
  changeCityBrightness(.3 - currCityBrightness);
}

function unhighlight()
{
  changeCityBrightness(-currCityBrightness);
  flashCityAnim.restart();
  flashCityAnim.play();
}


function changeCityBrightness(value)
{
  /*
  for (let c = 0; c < cityGroup.children.length; c++) {
    cityGroup.children[c].material.color.addScalar(value);
  }
  */
  for (let c = 0; c < newCityMats.length; c++)
  {
    newCityMats[c].color.addScalar(value);
    currCityBrightness += value;
  }
}

var flashCityAnim = anime({
  duration: 2250,
  loop: true,
  autoplay: false,
  update: function(anim) {
    changeCityBrightness(.004 * Math.sin((2*Math.PI * anim.progress)/100));
  }
});

var cameraPanInAnim = anime({
  targets: [camera.position],
  easing: 'easeInOutSine',
  duration: 2500,
  autoplay: false,
  x: 0,
  y: 1.25,
  z: initialCameraZ,
  complete: initTimeline
});

var cameraRotateInAnim = anime({
  targets: camera.rotation,
  easing: 'easeInOutSine',
  duration: 2500,
  autoplay: false,
  x: -.3,
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
var car = new THREE.Scene();
  
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
var scrollDistance = -24;
var initialCarZ = .25;
var changeColorBuildings = []
for (let b in leftBuildings) {
  changeColorBuildings.push(leftBuildings[b].material.color);
}
for (let b in rightBuildings) {
  changeColorBuildings.push(rightBuildings[b].material.color);
}

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
    x: 18000,
    y: 22000,
    z: 17000,
    complete: function () {
      camera.rotation.set(0,0,0);
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

changeColorBuildings.splice(4,1);
changeColorBuildings.splice(3,1);
changeColorBuildings.splice(12,1);

loader.load(carUrl, function (gltf) {
  scene.add(gltf.scene);
  car = gltf.scene;
  car.scale.set(.5,.5,.5);
  car.position.set(0, -1, initialCarZ);
  car.rotation.set(0,Math.PI,0)
});

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
    z: initialCameraZ + scrollDistance/2,
    duration: animDurations["beforeFirstStop"],
  });

  //car before stop 1
  timeline.add({ 
    targets: [car.position],
    z: initialCarZ + scrollDistance/2,
    duration: animDurations["beforeFirstStop"],
  }, getTimePosition("beforeFirstStop"));
}

function createFinalTimeline()
{
  timeline.add({ 
    targets: ["#main-point2"],
    easing: 'easeOutElastic(10, .65)',
    bottom: canv.offsetHeight - (mainPoint2.offsetHeight) + "px",
    duration: animDurations["beforeFirstStop"]/2,
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
    duration: 3 * animDurations["firstStop"]/4,
    easing: "easeInOutQuad",
    targets: [camera.rotation],
    x: -.2,
    y: -.25 * rotFactor,
  }, getTimePosition("firstStop"));

  //camera after stop 1
  timeline.add({
    duration: 3 * animDurations["firstStop"]/4,
    easing: "easeInOutQuad",
    targets: [camera.rotation],
    x: -.3,
    y: 0,
    z:0,
  }, getTimePosition("afterFirstStop"));

  timeline.add({
    duration: animDurations["afterFirstStop"],
    targets: camera.position,
    z: initialCameraZ + scrollDistance,
    }, getTimePosition("afterFirstStop"));

    //car after stop 1
    timeline.add({
      duration: animDurations["afterFirstStop"],
      targets: car.position,
      z: initialCarZ + scrollDistance,
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
      duration: animDurations["secondStop"]/2,
      targets: [leftBuildings[8].material.color, camera.rotation],
      r: 60/255,
      g: 190/255,
      b: 60/255,
      y: .3 * rotFactor,
      x: -.2
    }, getTimePosition("secondStop") + animDurations["secondStop"]/2);
    
    timeline.add({
      duration: animDurations["panOutToCity"]/3,
      targets: ['#extra-fact2', "#main-point2"],
      opacity: 0,
    }, getTimePosition("panOutToCity")) + animDurations["panOutToCity"]/3;

    timeline.add({
      duration: animDurations["panOutToCity"] / 1.25,
      targets: camera.position,
      x:  25.58,
      y: 13.60,
      z: 7.06,
    }, getTimePosition("panOutToCity"));
    timeline.add({
      duration: animDurations["panOutToCity"],
      targets: camera.rotation,
      x: -0.795,
      y: 0.60,
      z: 0.523,
    }, getTimePosition("panOutToCity"));
    timeline.add({
      duration: animDurations["panOutToCity"]/1.5,
      targets: changeColorBuildings,
      r: 60/255,
      g: 190/255,
      b: 60/255,
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
  fps.innerHTML = "fps: " +  Math.round(1000 / (time - prevTime));
  prevTime = time;
  //console.log(window.scrollY);
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
  //renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    .75,
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
  initialCameraZ = 2.25;
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
  initialCameraZ = 3;
  const textBoxes = document.querySelectorAll('.textbox');
  textBoxes.forEach(tb =>{
    tb.style.width = "12.5vw";
    tb.style.fontSize = "150%";
  });
}

