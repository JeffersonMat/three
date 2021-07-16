import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { DragControls } from "three/examples/jsm/controls/DragControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { TextureLoader } from "three/examples/jsm/textures/FlakesTexture"

//This is the package that handles the GUI control
import * as dat from "dat.gui"

//Texture loader

// Scene
const scene = new THREE.Scene()
const loader = new GLTFLoader()
// Canvas
const canvas = document.getElementById("canva")
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
})

//GLTF Model

const haloModel = "/images/spartan/scene.gltf"

//Camera setup

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const camera = new THREE.PerspectiveCamera(
  3,
  sizes.width / sizes.height,
  1,
  5000
)

camera.position.set(70, 70, 70)
camera.rotation.y = (45 / 180) * Math.PI

//  Controls
const controls = new OrbitControls(camera, canvas)
controls.update()

//Enables Drag

const dragobjects = []

function drawBox(objectwidth, objectheight, objectdepth) {
  let geometry, material, box
  geometry = new THREE.BoxGeometry(objectwidth, objectheight, objectdepth)
  material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 1,
    depthTest: false,
  })
  box = new THREE.Mesh(geometry, material)
  dragobjects.push(box)
  box.position.set(0, 0, 0)
  return box
}

const addGLTFObjectIntoScene = () => {
  loader.load(haloModel, (gltf) => {

  //It adds the object as a group, by creating a box that encapsulated the model to DragController
  //The group is added to the scene globally to run the dragController that handles the box
  //This function is called in the init func. Then added to the scene  
    gltf.scene.scale.set(1.6, 1.6, 1.6)
    scene.add(gltf.scene)
    //Box set up to drag object
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const center = box.getCenter(new THREE.Vector3())
    gltf.scene.receiveShadow = false
    gltf.scene.castShadow = true
    gltf.scene.position.x += gltf.scene.position.x - center.x
    gltf.scene.position.y += gltf.scene.position.y - center.y
    gltf.scene.position.z += gltf.scene.position.z - center.z

    const objectwidth = Math.floor(box.getSize().x)
    const objectheight = Math.floor(box.getSize().y)
    const objectdepth = Math.floor(box.getSize().z)
    objectwidth = objectwidth + parseInt(2)
    objectheight = objectheight + parseInt(2)
    objectdepth = objectdepth + parseInt(1)
    box = drawBox(objectwidth, objectheight, objectdepth)

    const modelLook = new THREE.MeshStandardMaterial({
      roughness: 0.1,
      metalness: 0.9,
    })
    scene.add(modelLook)
  })
}



//Handles dragController
//DragObjects only contains on element which is the model that has been added to the group
//Since the controller handles the box containing the model not the model itself

const controlsDrag = new DragControls(dragobjects, camera, canvas)
controlsDrag.transformGroup = true
// add event listener to highlight dragged objects
controlsDrag.addEventListener("dragstart", function (event) {
  event.object.material.emissive.set(0xaaaaaa)
})
controlsDrag.addEventListener("dragend", function (event) {
  event.object.material.emissive.set(0x000000)
})

const Textureloader = new THREE.TextureLoader()
const bgTexture = Textureloader.load(
  "https://images.unsplash.com/photo-1542879412-4309c2cade1d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
)
scene.background = bgTexture

//Debug

/*
  This helps to find the correct values to pass to elements
   This provides a interface to the correct value and see them in action.
   For instance, I have added plane.rotation as one the properties so I can find the right value to its rotation
// */
const gui = new dat.GUI()


//Lights handlers

const pointLight = new THREE.PointLight(0x757535, 10, 40);

pointLight.position.x = 40;
pointLight.position.y = 0;
pointLight.position.z= 80 //#757535 //40 0 80

const lightDirection = new THREE.DirectionalLight(0x000000, 100, 100);

lightDirection.castShadow = true
lightDirection.position.set(10, 0, -1)
lightDirection.shadow.mapSize.width = 512 // default
lightDirection.shadow.mapSize.height = 512 // default
lightDirection.shadow.camera.near = 1 // default
lightDirection.shadow.camera.far = 500 // default


const amlight = new THREE.AmbientLight(0x751d1d, 1, 10)
amlight.position.set(0, 1, 0);

const hemiLight = new THREE.HemisphereLight(0x0000, 0xf5f5f5, 10, 10)
hemiLight.position.set(1, 0, 0);

const dirLight = new THREE.DirectionalLight(0x134103, 10, 10)
dirLight.position.set(0, 1, 0);

const col = { colour: "#f5f5f5" }
gui.addColor(col, "colour").onChange(() => {
  dirLight.color.set(col.colour)
});

gui.addColor(col, "colour").onChange(() => {
  amlight.color.set(col.colour)
});

gui.addColor(col, "colour").onChange(() => {
  lightDirection.color.set(col.colour)
});

gui.addColor(col, "colour").onChange(() => {
  hemiLight.color.set(col.colour)
})

gui.addColor(col, "colour").onChange(() => {
 pointLight.color.set(col.colour)
})





// /**
//  * Renderer
//  */

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



//Animation -No animation was set
const clock = new THREE.Clock()

//Functions

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  //   // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//This function would be handling animation -No animation was set at this stage
const tick = () => {
  
  const elapsedTime = clock.getElapsedTime()
  // Render
  renderer.render(scene, camera)
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

const init = () => {
  //It's guide line to position element to the center
  // scene.add(new THREE.AxesHelper(500))
  //add following code in init function
  const gltfobject = addGLTFObjectIntoScene()
  scene.add(gltfobject)

  //Handles lightning
  scene.add(hemiLight)
  scene.add(dirLight)
  scene.add(pointLight)
  scene.add(amlight)
  scene.add(lightDirection)

  renderer.setClearColor(0x000000)
  tick()
}

init()
