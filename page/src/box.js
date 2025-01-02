import * as THREE from 'three';

// Select the canvas
const canvas = document.getElementById("threejs-background");

// Create a Three.js scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
    75, 
    canvas.clientWidth / canvas.clientHeight, 
    0.1, 
    1000
);
camera.position.z = 2;

// Create a renderer and set it to the canvas
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add a rotating cube to the scene
const geometry = new THREE.BoxGeometry();

// Solid material
const solidMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
const cube = new THREE.Mesh(geometry, solidMaterial);
scene.add(cube);

// Wireframe overlay
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true });
const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
scene.add(wireframe);


// Animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    wireframe.rotation.x += 0.01;
    wireframe.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
}
animate();

// Handle resizing
window.addEventListener("resize", () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
});