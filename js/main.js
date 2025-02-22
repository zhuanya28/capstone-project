let params = {
    color: "#FFF"
};

let cube;

let currentP = 6; // Initial p value matching constructor
let lastP = currentP;



function setupThree() {
    cube = getBox();
    // scene.add(cube);

    cube.position.set(1, 0, 0); //(x, y, z);
    cube.scale.x = 100;
    cube.scale.y = 100;
    cube.scale.z = 100;

    // setup gui
    gui.add(cube.scale, "x").min(1).max(200).step(0.1);
    gui.add(cube.scale, "y").min(1).max(200).step(0.1);
    gui.add(cube.scale, "z").min(1).max(200).step(0.1);
    gui.addColor(params, "color");

    torusKnot1 = getTorusKnot();
    scene.add(torusKnot1);
    torusKnot1.position.set(2, 0, 0);

    // Complete lighting system
    const ambient = new THREE.AmbientLight(0x404040, 0.5);  // Base fill
    const directional = new THREE.DirectionalLight(0xffffff, 1);

    directional.position.set(5, 5, 5);  // Set light direction
    directional.castShadow = true;       // Enable shadows

    scene.add(ambient, directional);


    torusKnot1.scale.x = 100;
    torusKnot1.scale.y = 100;
    torusKnot1.scale.z = 100;



}

function updateThree() {
    if (currentP !== lastP) {
        const newGeometry = new THREE.TorusKnotGeometry(
            11, 1.3, 300, 20, currentP, 16
        );

        // Preserve material and matrix
        torusKnot1.geometry.dispose();
        torusKnot1.geometry = newGeometry;
        torusKnot1.geometry.parameters.p = currentP;
        lastP = currentP;
    }

    torusKnot1.material.color.set(params.color);
    torusKnot1.rotation.x += 0.005;
    torusKnot1.rotation.y += 0.005;

    currentP += 0.005;
}

function getBox() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function getTorusKnot() {
    const geometry = new THREE.TorusKnotGeometry(11, 1.3, 300, 20, 6, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}