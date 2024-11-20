import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// Configuración básica
class main {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.loader = new THREE.TextureLoader();

        this.setupRenderer();

        this.entorno = new entorno(this.scene, this.loader);
        this.playerView = new playerView(this.scene, this.camera, this.loader);
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        this.renderer.xr.setReferenceSpaceType('local');
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(VRButton.createButton(this.renderer));
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

class entorno {
    constructor(scene, loader) {
        this.scene = scene;
        this.loader = loader;
        this.skybox();
        this.piso();
        this.paredes();
        this.avisos();
        this.luces();
    }

    skybox() {
        const path = 'Assets/Jinx/cube/';
        const format = '.png';
        const urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];
        const reflectionCube = new THREE.CubeTextureLoader().load(urls);
        this.scene.background = reflectionCube;
    }

    piso() {
        const sueloGeometry = new THREE.PlaneGeometry(15, 12);
        const sueloMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0ff0,
            map: this.loader.load('Assets/Jinx/suelo/tiles_0033_color_2k.png'),
            normalMap: this.loader.load('Assets/Jinx/suelo/tiles_0033_normal_directx_2k.png'),
            aoMap: this.loader.load('Assets/Jinx/suelo/tiles_0033_ao_2k.jpg'),
            roughnessMap: this.loader.load('Assets/Jinx/suelo/tiles_0033_roughness_2k.jpg'),
            side: THREE.DoubleSide
        });
        const suelo = new THREE.Mesh(sueloGeometry, sueloMaterial);
        suelo.rotation.set(Math.PI / 2, 0, 0);
        suelo.position.set(0, -2, -1);
        this.scene.add(suelo);
    }

    paredes() {
        const wallGeometry = new THREE.PlaneGeometry(15, 8);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x6c6c6c,
            map: this.loader.load('Assets/Jinx/pared/Brick_wall_008_COLOR2.jpg'),
            normalMap: this.loader.load('Assets/Jinx/pared/Brick_wall_008_NORM.jpg'),
            displacementMap: this.loader.load('Assets/Jinx/pared/Brick_wall_008_DISP.png'),
            displacementScale: 0.1,
            metalnessMap: this.loader.load('Assets/Jinx/pared/Brick_wall_008_SPEC.jpg'),
            roughnessMap: this.loader.load('Assets/Jinx/pared/Brick_wall_008_OCC.jpg'),
            side: THREE.DoubleSide
        });

        const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall1.position.set(0, 1.5, -8);
        this.scene.add(wall1);

        const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall2.rotation.set(0, Math.PI / 2, 0);
        wall2.position.set(-7.5, 1.5, -1);
        this.scene.add(wall2);

        const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall3.rotation.set(0, Math.PI / 2, 0);
        wall3.position.set(7.5, 1.5, -1);
        this.scene.add(wall3);

        const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall4.position.set(0, 1.5, 5);
        this.scene.add(wall4);
    }

    avisos() {
        const avisoGeometry = new THREE.PlaneGeometry(2, 1);
        const avisoMaterial1 = new THREE.MeshStandardMaterial({
            map: this.loader.load('Assets/aviso1.png'),
            side: THREE.DoubleSide
        });

        const aviso1 = new THREE.Mesh(avisoGeometry, avisoMaterial1);
        aviso1.rotation.set(0, Math.PI / 3, 0);
        aviso1.position.set(-3, 0, 0);
        this.scene.add(aviso1);

        const avisoMaterial2 = new THREE.MeshStandardMaterial({
            map: this.loader.load('Assets/aviso2.png'),
        });

        const aviso2 = new THREE.Mesh(avisoGeometry, avisoMaterial2);
        aviso2.rotation.set(0, -Math.PI / 3, 0);
        aviso2.position.set(3, 0, 0);
        this.scene.add(aviso2);
    }

    luces() {
        const lightAzul = new THREE.PointLight(0x00bfff, 2, 10);
        lightAzul.position.set(-5, 3, 0);
        this.scene.add(lightAzul);

        const lightRosa = new THREE.PointLight(0xff69b4, 2, 10);
        lightRosa.position.set(5, 3, 0);
        this.scene.add(lightRosa);

        const ambientLight = new THREE.AmbientLight(0x575785, 1);
        this.scene.add(ambientLight);

        const luzParpadeante = new THREE.PointLight(0xff0000, 2, 10);
        luzParpadeante.position.set(0, 3, -3);
        this.scene.add(luzParpadeante);
    }
}

class playerView {
    constructor(scene, camera, loader) {
        this.scene = scene;
        this.camera = camera;
        this.loader = loader;
        this.objetivos = [];
        this.aciertos = 0;
        this.camera.position.set(0, 3, 3);

        this.createWeapon();
        this.createTargets();
        this.addEventListeners();
    }

    createWeapon() {
        const armaGeometry = new THREE.PlaneGeometry(1, 0.5);
        const armaMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: this.loader.load('Assets/Jinx/ArmaJinx.png'),
            transparent: true,
            side: THREE.DoubleSide
        });
        const weapon = new THREE.Mesh(armaGeometry, armaMaterial);
        weapon.position.set(0.3, -0.2, -0.8);
        weapon.rotation.set(0, -Math.PI / 2, 0);
        this.camera.add(weapon);
    }

    createTargets() {
        const targetGeometry = new THREE.PlaneGeometry(1.3, 1.3);
        const textures = [
            this.loader.load('Assets/Jinx/objetivos/Obj1.png'),
            this.loader.load('Assets/Jinx/objetivos/Obj2.png'),
            this.loader.load('Assets/Jinx/objetivos/Obj3.png'),
        ];

        function createTarget() {
            const texture = textures[Math.floor(Math.random() * textures.length)];
            const targetMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
            });

            const target = new THREE.Mesh(targetGeometry, targetMaterial);
            target.position.set(
                (Math.random() - 0.5) * 10, // X aleatorio
                Math.random() * (3 + 1) - 1,  // Y aleatorio
                -6
            );
            this.scene.add(target);
            this.objetivos.push(target);
        }

        for (let i = 0; i < 5; i++) {
            createTarget.call(this);
        }
    }


    addEventListeners() {
        window.addEventListener('click', () => this.shoot());
    }

    shoot() {
        const raycaster = new THREE.Raycaster();
        const tempMatrix = new THREE.Matrix4();
        tempMatrix.identity().extractRotation(this.camera.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(this.camera.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = raycaster.intersectObjects(this.objetivos);
        if (intersects.length > 0) {
            const target = intersects[0].object;
            this.scene.remove(target);
            this.createTarget();
            this.aciertos++;
            console.log(`Aciertos: ${this.aciertos}`);
        }
    }
}

const juego = new main();
juego.animate();