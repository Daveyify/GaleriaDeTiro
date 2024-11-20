import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local')
document.body.appendChild(VRButton.createButton(renderer));

const controls = new OrbitControls( camera, renderer.domElement ); 
camera.position.z = 15;
camera.position.y = 15;

const miraGeometry = new THREE.PlaneGeometry(0.02, 0.02);
const miraMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const mira = new THREE.Mesh(miraGeometry, miraMaterial);
mira.position.set(0, 0, -1); // Ajustar posición relativa a la cámara
camera.add(mira);

// Añadir la cámara a la escena
scene.add(camera);


const textureLoader = new THREE.TextureLoader();
const texturaparedes = textureLoader.load('Arcade/pared.jpg');
const texturapiso = textureLoader.load('Arcade/piso.jpg');
        
const wallGeometry = new THREE.PlaneGeometry(15, 7); 
const wall1 = new THREE.Mesh(wallGeometry, new THREE.MeshStandardMaterial(
    { 
        map: texturaparedes,
        roughness: 0.5,
        metalness: 0.5
    }
    ));
wall1.position.set(-0, -1, -4.5); 
scene.add(wall1);
        
const wall2 = wall1.clone();
wall2.rotation.y = -1.57; 
wall2.position.set(7.5, -0.7, 0); 
wall2.scale.set(0.6,0.92)
scene.add(wall2);

const wall3 = wall1.clone();
wall3.rotation.y = Math.PI / 2;
wall3.position.set(-7.5, -0.7, 0); 
wall3.scale.set(0.6,0.92)
scene.add(wall3);

const floorGeometry = new THREE.PlaneGeometry(15, 10);
const floorMaterial = new THREE.MeshStandardMaterial(
    {
        map: texturapiso,
        metalness: 0.5,
        roughness: 0.2,
    });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, -4, 0)
scene.add(floor); 


const video = document.createElement('video');
video.src = 'Arcade/jinxmaq.mp4'; 
video.loop = true;
video.autoplay = true;
video.muted = true; 
video.play();

var maq = textureLoader.load('Arcade/maquina.png');
var maq2 = textureLoader.load('Arcade/jayce.jpg');
var maq3 = textureLoader.load('Arcade/cait.png');
var videoTexture = new THREE.VideoTexture(video);

//textureLoader.load('laterales.jpeg');
//JINX
const maquinaGeometry = new THREE.PlaneGeometry(6, 6);
const maquinaMaterial = new THREE.MeshStandardMaterial(
    {
        map: maq,
        metalness: 0.7,
        roughness: 0.,
        transparent: true
    });
const maquina = new THREE.Mesh(maquinaGeometry, maquinaMaterial);
maquina.rotation.x = -Math.PI / 18;
maquina.position.set(0, -1.3, -3.5)
scene.add(maquina); 


const pantallaGeometry = new THREE.PlaneGeometry(1.6, 1.2);
const pantallaMaterial = new THREE.MeshStandardMaterial(
    {
        map: videoTexture,
    });
const pantalla = new THREE.Mesh(pantallaGeometry, pantallaMaterial);
pantalla.rotation.x = -Math.PI / 18;
pantalla.position.set(0, -0.45, -3.6)
scene.add(pantalla); 

////////////////////////////////////////////////////////////
//JAYCE
const maquina2Geometry = new THREE.PlaneGeometry(6, 6);
const maquina2Material = new THREE.MeshStandardMaterial(
    {
        map: maq,
        metalness: 0.7,
        roughness: 0.,
        transparent: true
    });
const maquina2 = new THREE.Mesh(maquina2Geometry, maquina2Material);
maquina2.rotation.x = -Math.PI / 18;
maquina2.position.set(4, -1.3, -3.7)
scene.add(maquina2); 


const pantalla2Geometry = new THREE.PlaneGeometry(1.7, 1.2);
const pantalla2Material = new THREE.MeshStandardMaterial(
    {
        map: maq2,
        metalness: 0.5,
        roughness: 0.6,
    });
const pantalla2 = new THREE.Mesh(pantalla2Geometry, pantalla2Material);
pantalla2.rotation.x = -Math.PI / 18;
pantalla2.position.set(4, -0.45, -3.8)
scene.add(pantalla2); 

//////////////////////////////////////////////////////////////////////
//CAIT
const maquina3Geometry = new THREE.PlaneGeometry(6, 6);
const maquina3Material = new THREE.MeshStandardMaterial(
    {
        map: maq,
        metalness: 0.7,
        roughness: 0.,
        transparent: true
    });
const maquina3 = new THREE.Mesh(maquina3Geometry, maquina3Material);
maquina3.rotation.x = -Math.PI / 18;
maquina3.position.set(-4, -1.3, -3.7)
scene.add(maquina3); 

const pantalla3Geometry = new THREE.PlaneGeometry(1.7, 1.2);
const pantalla3Material = new THREE.MeshStandardMaterial(
    {
        map: maq3,
        metalness: 0.5,
        roughness: 0.6,
    });
const pantalla3 = new THREE.Mesh(pantalla3Geometry, pantalla3Material);
pantalla3.rotation.x = -Math.PI / 18;
pantalla3.position.set(-4, -0.45, -3.8)
scene.add(pantalla3); 

// Luces
const light = new THREE.AmbientLight(0x404040, 3, 2); 
scene.add(light);

const pointLight = new THREE.PointLight(0xff0ff0, 1, 30);
pointLight.position.set(5, -3, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x0fff80, 2, 30);
pointLight2.position.set(-5, -3, 5);
scene.add(pointLight2);

//////////////////////////////////////


const raycaster = new THREE.Raycaster();
const tempMatrix = new THREE.Matrix4();

function teletransportar() {
    tempMatrix.identity().extractRotation(camera.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    const intersects = raycaster.intersectObjects([maquina]);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object === maquina) {
            loadNewScene();
        }
    }
}

function loadNewScene() {
    window.location.href = 'index2.html';
}

window.addEventListener('click', teletransportar);
/*
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function loadMinigameScene() {
    // Limpiar la escena principal
    scene.clear();

    // Importar la escena del minijuego desde el otro archivo JS
    import('JS/galeria.js').then((module) => {
        module.loadMinigame();
    });
}

// Detectar clics en las máquinas (raycasting)
function onMouseClick(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.update(camera); // Actualizamos el raycaster con la cámara

    // Verificar las intersecciones con las máquinas
    const intersects1 = raycaster.intersectObject(maquina);
    const intersects2 = raycaster.intersectObject(maquina2);
    const intersects3 = raycaster.intersectObject(maquina3);

    if (intersects1.length > 0) {
        loadMinigameScene();  // Cargar el minijuego al hacer clic en la primera máquina
    } else if (intersects2.length > 0) {
        loadMinigameScene();  // Cargar el minijuego al hacer clic en la segunda máquina
    } else if (intersects3.length > 0) {
        loadMinigameScene();  // Cargar el minijuego al hacer clic en la tercera máquina
    }
}

// Agregar el evento de clic del ratón
window.addEventListener('click', onMouseClick, false);
*/

function animate() {
    controls.update();
    renderer.render(scene, camera);
}

animate();


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});