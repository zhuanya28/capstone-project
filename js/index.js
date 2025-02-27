// Declare global variables properly
let scene, camera, renderer, experienceManager, stats;

class ExperienceManager {
    constructor(scene) {
        this.scene = scene;
        this.stages = {
            OPENING: new OpeningStage(scene),
            TRANSITION: new TransitionStage(scene),
            MAIN: new MainStage(scene),
        };
        this.currentStage = null;
        this.stageOrder = ['OPENING', 'TRANSITION', 'MAIN'];
        this.currentStageIndex = 0;
    }

    async init() {
        await this.setStage(this.stageOrder[this.currentStageIndex]);
    }

    async nextStage() {
        this.currentStageIndex = (this.currentStageIndex + 1) % this.stageOrder.length;
        await this.setStage(this.stageOrder[this.currentStageIndex]);
    }

    async setStage(newStageKey) {
        if (this.currentStage && this.currentStage.exit) {
            await this.currentStage.exit();
        }
        this.currentStage = this.stages[newStageKey];
        await this.currentStage.enter();
    }
}

class StageBase {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
    }

    enter() { }

    exit() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            if (this.mesh.material) this.mesh.material.dispose();
            this.mesh = null;
        }
    }

    update() { }
}

class OpeningStage extends StageBase {
    enter() {
        this.mesh = getBox();
        this.mesh.position.set(0, 0, 0);
        this.scene.add(this.mesh);
        // Add required lighting
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(5, 5, 5);
        this.scene.add(this.light);
    }
    exit() {
        super.exit();
        this.scene.remove(this.light);
    }
}

class TransitionStage extends StageBase {
    enter() {

        this.mesh = getBox();
        this.mesh.position.set(0, 0, 0);
        this.scene.add(this.mesh);
        // Add required lighting
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(5, 5, 5);
        this.scene.add(this.light);

    }
}

class MainStage extends StageBase {
    enter() {
        this.mesh = getTorusKnot();
        this.scene.add(this.mesh);

        // Manage lighting properly
        this.ambient = new THREE.AmbientLight(0x404040, 0.5);
        this.directional = new THREE.DirectionalLight(0xffffff, 1);
        this.directional.position.set(5, 5, 5);
        this.scene.add(this.ambient, this.directional);
    }

    exit() {
        super.exit();
        if (this.ambient) this.scene.remove(this.ambient);
        if (this.directional) this.scene.remove(this.directional);
    }
}

// THREE.JS Initialization
function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50; // Adjusted for better visibility

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container-three").appendChild(renderer.domElement);

    // Initialize stage system
    experienceManager = new ExperienceManager(scene);
    experienceManager.init();

    // Stage controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            experienceManager.nextStage();
        }
    });

    // lighting
    scene.add(new THREE.AmbientLight(0x404040));

    renderer.setAnimationLoop(animate);
}

// Animation loop
function animate() {
    if (typeof stats !== 'undefined') stats.update(); // Prevent reference error
    if (experienceManager.currentStage) {
        experienceManager.currentStage.update();
    }
    renderer.render(scene, camera);
}

// Geometry Helpers
function getBox() {
    return new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
    );
}

function getTorusKnot() {
    return new THREE.Mesh(
        new THREE.TorusKnotGeometry(11, 1.3, 300, 20, 6, 16),
        new THREE.MeshPhongMaterial({ color: 0xffff00 })
    );
}

initThree();
