import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// Configuración básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Habilitar sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local');
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

// Posición inicial de la cámara
camera.position.set(0, 1.6, 0); // Altura típica de una persona en VR

const armaGroup = new THREE.Group();
camera.add(armaGroup);

// Arma
const armaGeometry = new THREE.BoxGeometry(0.5, 0.5, 2);
const armaMaterial = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
const arma = new THREE.Mesh(armaGeometry, armaMaterial);
arma.position.set(0.3, -0.2, -0.8); // Ajustar posición relativa a la cámara
armaGroup.add(arma);

// Mira
const miraGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.5);
const miraMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const mira = new THREE.Mesh(miraGeometry, miraMaterial);
mira.position.set(0, 0, -1); // Ajustar posición relativa a la cámara
armaGroup.add(mira);

// Añadir la cámara a la escena
scene.add(camera);

// Objetivos
const objetivos = [];
const objetivoGeometry = new THREE.SphereGeometry(0.3, 8, 8);
const objetivoMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

function crearObjetivo() {
    const objetivo = new THREE.Mesh(objetivoGeometry, objetivoMaterial);
    objetivo.position.set(
        (Math.random() - 0.5) * 10, // X aleatorio
        (Math.random() - 0.5) * 5,  // Y aleatorio
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

// Animación
function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
