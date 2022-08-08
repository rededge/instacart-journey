import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { InteractionManager } from "three.interactive";
import Stats from 'three/examples/jsm/libs/stats.module'
import anime from 'animejs/lib/anime.es.js';
import starUrl from './star.png';
import carUrl from './Instacart_Project_car.gltf';
import hilightBuildingsUrl from './Instacart_Project_residential_v3.gltf';
import houseUrl from './Instacart_Project_house.gltf';
import city from './Instacart_Project_Background4.gltf';
import phoneUrl from './Phone.gltf'

const stats = Stats()
document.body.appendChild(stats.dom);
const canv = document.getElementById("myCanvas");
var mainPoint1 = document.getElementById("main-point1");
var mainPoint2 = document.getElementById("main-point2");
var mainPoint3 = document.getElementById("main-point3");
var learnMore = document.getElementById("learn-more");
var rotFactor = 1;

var point1Ps = mainPoint1.querySelectorAll("p");
let p1Idx =  0;

mainPoint1.querySelector(".next-btn").onclick = function()
{
  if (p1Idx <= point1Ps.length - 1)
    p1Idx++;
  mainPoint1.querySelector(".prev-btn").style.display = "block";
  if (p1Idx == point1Ps.length)
  {
    cityClickHandler();
    return;
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


var panOutCameraPos = new THREE.Vector3(-48.5, 44, 47.6);
var panOutCameraRot = new THREE.Vector3(-1.039, -.484, -.669);

var initialCameraPos = new THREE.Vector3(42.8, 34.5, 42.5);
var initialCameraRot = new THREE.Vector3(-1.023, .473, .641);

//var initialCameraPos = new THREE.Vector3(-20000, 20000, 20000);
//var initialCameraRot = new THREE.Vector3(0,0,0);

const light = createLight();
const ambLight = new THREE.AmbientLight(0xffffff, .6);
scene.add(light);
scene.add(ambLight);
window.onresize = resize;
resize();

camera.position.set(initialCameraPos.x, initialCameraPos.y, initialCameraPos.z);
camera.rotation.set(initialCameraRot.x, initialCameraRot.y, initialCameraRot.z);
var initialCameraZ = 26;

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
document.body.addEventListener('wheel', onWheel, { passive: false });
document.body.addEventListener('touchmove', onTouchMove, { passive: false });
document.body.addEventListener('touchstart', onTouchStart, { passive: false });

var touchStartY = 0;

function onTouchStart (e) {
  var t = (e.targetTouches) ? e.targetTouches[0] : e;
  touchStartY = t.pageY;
}

function onTouchMove (e) {
  var t = (e.targetTouches) ? e.targetTouches[0] : e;
  // the multiply factor on mobile must be about 10x the factor applied on the wheel
  _event.deltaY = (t.pageY - touchStartY) * 5;
  touchStartY = t.pageY;
  scroll(e)
}

function onWheel (e)
{
  _event.deltaY = e.wheelDeltaY || e.deltaY * -1;
  // reduce by half the delta amount otherwise it scroll too fast (in a other way we could increase the height of the container too)
  _event.deltaY *= 0.5;
  scroll(e);
};

function scroll (e) {
  // limit scroll top
  if ((_event.y + _event.deltaY) > 0 ) {
    _event.y = 0;
  // limit scroll bottom
  } else if ((-(_event.y + _event.deltaY)) >= maxHeight) {
    _event.y = -maxHeight;
  } else {
      _event.y += _event.deltaY;
  }
}

// linear interpolation function
function lerp(a, b, t) 
{
  return ((1 - t) * a + t * b);
}

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);
var cityGroup = new THREE.Group();
scene.add(cityGroup);
var loader = new GLTFLoader();

//var cityMats = [];
//var cityColors = [];
var residentialMats = [];
var residentialColors = [];
var houseMats = [];
var houseColors = [];
var saturationFactor = 0;
var greyValue = .6;
var lightFactor = 1;


loader.load(city, function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(0,0,0);
  gltf.scene.scale.set(.03,.03,.03);
  gltf.scene.rotation.set(0, -Math.PI/2, 0);
  /*
  gltf.scene.traverse((o) => {
    if (o.isMesh)) {
    }
  });
  */
  cityGroup.add(gltf.scene);
});

loader.load(hilightBuildingsUrl, function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(0,0,0);
  gltf.scene.scale.set(.03,.03,.03);
  gltf.scene.rotation.set(0, -Math.PI/2, 0);
  gltf.scene.traverse((o) => {
    if (o.isMesh && (!residentialMats.includes(o.material))) {
      let hsl = {};
      o.material.color.getHSL(hsl);
      o.material.color.setHSL(hsl.h, hsl.s * saturationFactor, greyValue);
      residentialMats.push(o.material);
      residentialColors.push(hsl);
    }
  });
  cityGroup.add(gltf.scene);
});

var deliveryHouse = new THREE.Scene();
loader.load(houseUrl, function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(0,0,0);
  gltf.scene.scale.set(.03,.03,.03);
  gltf.scene.rotation.set(0, -Math.PI/2, 0);
  gltf.scene.traverse((o) => {
    if (o.isMesh && !houseMats.includes(o.material)) {
      let hsl = {};
      o.material.color.getHSL(hsl);
      o.material.color.setHSL(hsl.h, hsl.s * saturationFactor, greyValue);
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
  /*
  car.traverse((o) => {
    if (o.isMesh) {
      
    }
  });
  */
  car.scale.set(.03,.03,.03);
  car.position.set(0, 0, initialCarZ);
  gltf.scene.rotation.set(0, -Math.PI/2, 0);
  cityGroup.add(car);
});


var phoneSceneGroup = new THREE.Scene();
var phone = new THREE.Scene();
phoneSceneGroup.position.set(-20000, 20000, 20000);
scene.add(phoneSceneGroup);
loader.load(phoneUrl, function (gltf) 
{
  phone = gltf.scene;
  phone.position.set(8, -1, -5);
  phone.rotation.set(Math.PI/2, 0, 0);
  phone.scale.set(.325,.325,.325);
  phoneSceneGroup.add(phone);
})
//var phoneCase = createCube({ color: 0xa1a1a1, x: 10, y: -1, z: -5});
//phoneCase.scale.set(2, 4, .25);


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


var cameraPanInAnim = anime({
  targets: [camera.position],
  easing: 'easeInOutSine',
  duration: 2500,
  autoplay: false,
  x: 0,
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
  cityGroup.removeEventListener("click", cityClickHandler);
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
    targets: phone.position,
    x: 0
  });
  anime({
    duration: 580,
    delay: 3200,
    targets: [phone.rotation],
    direction: 'alternate',
    easing: 'easeInElastic(3, 2)',
    y: .25
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
  anime({
    targets: "#scroll-instructions",
    duration: 1000,
    easing: 'easeOutElastic(7 , .65)',
    bottom: canv.offsetHeight - (document.getElementById("scroll-instructions").offsetHeight) + "px",
  });
  document.body.style.overflow = "auto";
  
  timeline = anime.timeline({
    autoplay: false,
    duration: timelineLength,
    easing: 'easeInOutSine'
  });

  //camera before stop 1
  timeline.add({
    targets: "#scroll-instructions",
    duration: animDurations["beforeFirstStop"]/5,
    opacity: 0,
  }, getTimePosition("beforeFirstStop"));

  timeline.add({
    targets: [camera.position],
    z: initialCameraZ + -23,
    duration: animDurations["beforeFirstStop"],
  }, getTimePosition("beforeFirstStop"));

  //car before stop 1
  timeline.add({ 
    targets: [car.position],
    z: initialCarZ + -23,
    duration: animDurations["beforeFirstStop"],
  }, getTimePosition("beforeFirstStop"));

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
    top: mainPoint2.offsetHeight + document.getElementById('extra-fact1-1').offsetHeight + 20 + "px",
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
    duration: animDurations["firstStop"]/2,
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
      duration: animDurations["secondStop"]/3,
      targets: '#extra-fact2',
      top: mainPoint2.offsetHeight + "px"
    }, getTimePosition("secondStop")+ animDurations["secondStop"]/3);
    
    timeline.add({
      duration: animDurations["secondStop"] / 3,
      change: function(anim) {
        for (let i = 0; i < houseMats.length; i++) {
          let currSat = lerp(houseColors[i].s * saturationFactor, houseColors[i].s, anim.progress / 100);
          let currLit = lerp(greyValue, houseColors[i].l, anim.progress / 100);
          houseMats[i].color.setHSL(houseColors[i].h, currSat, currLit);
        }
      }
    }, getTimePosition("secondStop") + animDurations["secondStop"]/4);

    timeline.add({
      duration: 3*animDurations["secondStop"]/4,
      targets: [camera.rotation],
      y: -.4 * rotFactor,
      x: -.1
    }, getTimePosition("secondStop"));

    timeline.add({
      duration: animDurations["panOutToCity"]/3,
      targets: ['#extra-fact2', "#main-point2"],
      opacity: 0,
    }, getTimePosition("panOutToCity"));

    timeline.add({
      duration: animDurations["panOutToCity"] / 3.5,
      change: function(anim) {
        for (let i = 0; i < residentialMats.length; i++) {
          let currSat = lerp(residentialColors[i].s * saturationFactor, residentialColors[i].s, anim.progress / 100);
          let currLit = lerp(greyValue, residentialColors[i].l, anim.progress / 100);
          residentialMats[i].color.setHSL(residentialColors[i].h, currSat, currLit);
        }
      }
      
    }, getTimePosition("panOutToCity") + animDurations["panOutToCity"]/2.65);

    timeline.add({
      duration: animDurations["panOutToCity"],
      targets: camera.position,
      x:  panOutCameraPos.x,
      y: panOutCameraPos.y,
      z: panOutCameraPos.z,
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
      easing: 'easeOutElastic(5, .65)',
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
animate((time) => 
{
  prevTime = time;
  //console.log(camera.position.x + ", " + camera.position.y + ", " + camera.position.z);
  //console.log(camera.rotation.x + ", " + camera.rotation.y + ", " + camera.rotation.z);
  percentage = lerp(percentage, -_event.y, .03);
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
  renderer.render(scene, camera);
});

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
    scene.background = new THREE.Color(0xF9F1E6);
    //scene.background = new THREE.Color(0x6be6ff);
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
    const light = new THREE.DirectionalLight(0xffffff, .6, 1000);
    //light.position.set(-50, 50, 50);
    light.position.set(0, 50, 100);
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
    initialCameraPos = new THREE.Vector3(43.76, 29.96, 43.1);
    initialCameraRot = new THREE.Vector3(-1.19, .364, .727);
    panOutCameraPos = new THREE.Vector3(-37.7, 33.4, 37.35);
    panOutCameraRot = new THREE.Vector3(-.893, -.588, -.603);

    rotFactor = 2.25;
    camera.zoom = .7;
    camera.fov = 95;
    camera.updateMatrix();
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
    camera.updateWorldMatrix();
    const textBoxes = document.querySelectorAll('.textbox');
    textBoxes.forEach(tb => {
      tb.style.width = "35vw";
      tb.style.fontSize = "100%";
    });
    const banners = document.querySelectorAll('.banner-point');
    banners.forEach(b => { 
      b.style.width = "90vw";
      b.style.fontSize = "150%";
    });
    mainPoint1.style.width = "80vw";
    mainPoint1.fontSize = "100%";
  }

  function handleDefautlAspect()
  {
    rotFactor = 1;
    camera.zoom = 1;
    camera.fov = 75;
    const textBoxes = document.querySelectorAll('.textbox');
    textBoxes.forEach(tb =>{
      tb.style.width = "12.5vw";
      tb.style.fontSize = "150%";
    });
  }

