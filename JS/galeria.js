import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true; //ShadowMap
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local');// default THREE.PCFShadowMap
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

/////////////////////////////////////////////////////////////////

camera.position.z = 1

//arma
const armaGeometry = new THREE.BoxGeometry( 0.5, 0.5, 2 ); 
const armaMaterial = new THREE.MeshBasicMaterial( {color: 0x00fff0} ); 
const arma = new THREE.Mesh( armaGeometry, armaMaterial ); 
arma.position.set(1, -0.5, -2)
camera.add(arma)
scene.add(camera)

//objetivos
const objetivos = [];
const objetivoGeometry = new THREE.SphereGeometry(0.3, 32, 16);
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

// Disparar con raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector3();
let aciertos = 0;

function disparar() {
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObjects(objetivos);

    if (intersect.length > 0) {
        const objetivo = intersect[0].object;
        scene.remove(objetivo);
        crearObjetivo();
        aciertos++;
        console.log(`Aciertos: ${aciertos}`);
    }

}

window.addEventListener('click', (event) => {
    // Convertir posición del mouse a coordenadas normalizadas
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    disparar();
});

// Animación
function animate() {
    //requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
