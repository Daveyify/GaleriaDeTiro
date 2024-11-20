import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// Configuración básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local');
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let loader = new THREE.TextureLoader()

var armaN = loader.load('Assets/Jinx/ArmaJinx.png');

var paredN = loader.load('Assets/Jinx/pared/Brick_wall_008_NORM.jpg');
var paredM = loader.load('Assets/Jinx/pared/Brick_wall_008_COLOR2.jpg');
var paredM2 = loader.load('Assets/Jinx/pared/Brick_wall_008_COLOR.jpg');
var paredOC = loader.load('Assets/Jinx/pared/Brick_wall_008_OCC.jpg');
var paredSP = loader.load('Assets/Jinx/pared/Brick_wall_008_SPEC.jpg');
var paredDISP = loader.load('Assets/Jinx/pared/Brick_wall_008_DISP.png');

var sueloM = loader.load('Assets/Jinx/suelo/tiles_0033_color_2k.png');
var sueloN = loader.load('Assets/Jinx/suelo/tiles_0033_normal_directx_2k.png');
var sueloAO = loader.load('Assets/Jinx/suelo/tiles_0033_ao_2k.jpg');
var sueloRO = loader.load('Assets/Jinx/suelo/tiles_0033_roughness_2k.jpg');

// Posición inicial de la cámara
camera.position.set(0, 3, 3); // Altura típica de una persona en VR

const path = 'Assets/Jinx/cube/';
const format = '.png';
const urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
];
const reflectionCube = new THREE.CubeTextureLoader().load(urls);
scene.background = reflectionCube;

//Suelo
const sueloGeometry = new THREE.PlaneGeometry(15, 12);
const sueloMaterial = new THREE.MeshStandardMaterial(
    {
        color: 0xff0ff0,
        map: sueloM,
        normalMap: sueloN,
        aoMap: sueloAO,
        roughnessMap: sueloRO,
        side: THREE.DoubleSide
    }
)
const suelo = new THREE.Mesh(sueloGeometry, sueloMaterial);
suelo.rotation.set(Math.PI/2, 0, 0)
suelo.position.set(0, -2, -1)
scene.add(suelo)

//Pared
const paredGeometry = new THREE.PlaneGeometry(15, 8);
const paredMaterial = new THREE.MeshStandardMaterial(
    {
        color: 0x6c6c6c,
        map: paredM,
        normalMap: paredN,
        displacementMap: paredDISP,
        displacementScale: 0.1, // Escala del desplazamiento
        metalnessMap: paredSP, // Usar specular como metalness map
        roughnessMap: paredOC,
        side: THREE.DoubleSide
    }
)

const paredMaterial2 = new THREE.MeshStandardMaterial(
    {
        color: 0x6c6c6c,
        map: paredM2,
        normalMap: paredN,
        displacementMap: paredDISP,
        displacementScale: 0.1, // Escala del desplazamiento
        metalnessMap: paredSP, // Usar specular como metalness map
        roughnessMap: paredOC,
        side: THREE.DoubleSide
    }
)
const pared1 = new THREE.Mesh(paredGeometry, paredMaterial2);
pared1.position.set(0, 1.5, -8)
scene.add(pared1)

const pared2 = new THREE.Mesh(paredGeometry, paredMaterial);
pared2.rotation.set(0, Math.PI/2, 0)
pared2.position.set(-7.5, 1.5, -1)
scene.add(pared2)

const pared3 = new THREE.Mesh(paredGeometry, paredMaterial);
pared3.rotation.set(0, Math.PI/2, 0)
pared3.position.set(7.5, 1.5, -1)
scene.add(pared3)

const pared4 = new THREE.Mesh(paredGeometry, paredMaterial);
pared4.position.set(0, 1.5, 5)
scene.add(pared4)

//Como Jugar
const avisoGeometry = new THREE.PlaneGeometry(2, 1)
const avisoMaterial1 = new THREE.MeshStandardMaterial({
        map: loader.load('Assets/aviso1.png'),
        side: THREE.DoubleSide
    }
)

const avisoMaterial2 = new THREE.MeshStandardMaterial({
    map: loader.load('Assets/aviso2.png'),
}
)

const aviso = new THREE.Mesh(avisoGeometry, avisoMaterial1);
aviso.rotation.set(0, Math.PI/3, 0)
aviso.position.set(-3, 0, 0)
scene.add(aviso)

const aviso2 = new THREE.Mesh(avisoGeometry, avisoMaterial2);
aviso2.rotation.set(0, -Math.PI/3, 0)
aviso2.position.set(3, 0, 0)
scene.add(aviso2)

// Arma
const armaGeometry = new THREE.PlaneGeometry(1, 0.5);
const armaMaterial = new THREE.MeshStandardMaterial(
    {
        color: 0xffffff,
        map: armaN,
        transparent: true,
        side: THREE.DoubleSide
    });
const arma = new THREE.Mesh(armaGeometry, armaMaterial);
arma.position.set(0.3, -0.2, -0.8);
arma.rotation.set(0, -Math.PI / 2, 0)
camera.add(arma);

// Mira
const miraGeometry = new THREE.PlaneGeometry(0.02, 0.02);
const miraMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const mira = new THREE.Mesh(miraGeometry, miraMaterial);
mira.position.set(0, 0, -1); // Ajustar posición relativa a la cámara
camera.add(mira);

// Añadir la cámara a la escena
scene.add(camera);

// Objetivos
const objetivos = [];
const objetivoGeometry = new THREE.PlaneGeometry(1.3, 1.3);

const texturasObjetivos = [
    loader.load('Assets/Jinx/objetivos/Obj1.png'),
    loader.load('Assets/Jinx/objetivos/Obj2.png'),
    loader.load('Assets/Jinx/objetivos/Obj3.png'),
];

function crearObjetivo() {

    const texturaAleatoria = texturasObjetivos[Math.floor(Math.random() * texturasObjetivos.length)];
    const objetivoMaterial = new THREE.MeshBasicMaterial({
        map: texturaAleatoria,
        transparent: true,
    });

    const objetivo = new THREE.Mesh(objetivoGeometry, objetivoMaterial);
    objetivo.position.set(
        (Math.random() - 0.5) * 10, // X aleatorio
        Math.random() * (3 + 1) - 1,  // Y aleatorio
        -6
    );
    scene.add(objetivo);
    objetivos.push(objetivo);
}

for (let i = 0; i < 5; i++) {
    crearObjetivo();
}

// Disparar con Raycasting
const raycaster = new THREE.Raycaster();
const tempMatrix = new THREE.Matrix4();
let aciertos = 0;

function disparar() {
    tempMatrix.identity().extractRotation(camera.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix); // Dirección de la mira

    const intersect = raycaster.intersectObjects(objetivos);

    if (intersect.length > 0) {
        const objetivo = intersect[0].object;
        scene.remove(objetivo);
        crearObjetivo();
        aciertos++;
        console.log(`Aciertos: ${aciertos}`);
    }
}

// Evento de disparo
window.addEventListener('click', disparar);

//Luces
const lightAzul = new THREE.PointLight(0x00bfff, 2, 10);
lightAzul.position.set(-5, 3, 0); // Ajusta la posición según la escena
scene.add(lightAzul);

const lightRosa = new THREE.PointLight(0xff69b4, 2, 10);
lightRosa.position.set(5, 3, 0);
scene.add(lightRosa);

const ambientLight = new THREE.AmbientLight(0x575785, 1); // Azul oscuro
scene.add(ambientLight);

const luzParpadeante = new THREE.PointLight(0xff0000, 2, 10);
luzParpadeante.position.set(0, 3, -3);
scene.add(luzParpadeante);

// Animación para parpadeo
function updateLuzParpadeante() {
  luzParpadeante.intensity = Math.random() * 2; // Cambia la intensidad aleatoriamente
}


// Animación
function animate() {
    updateLuzParpadeante();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
