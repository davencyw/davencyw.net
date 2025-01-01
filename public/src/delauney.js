import * as THREE from 'three';
import Delaunator from 'delaunator';

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
camera.position.z = 1;

const numPoints = 100;

// Create a renderer and set it to the canvas
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Set up Delaunay Triangulation
let points = generateRandomPoints(numPoints*2);  // Random points
let delaunay = new Delaunator(points);  // Initialize with flattened points

// Set up geometry and material for lines
const material = new THREE.LineBasicMaterial({ color: 0x999999, linewidth: 1 });

// Create points and add to geometry
const spheres = []; // To store sphere meshes for animation

points.forEach((point, index) => {
  if (index % 2 === 0) {  // Ensure you're accessing x, y pairs
    const x = point;
    const y = points[index + 1];
    const sphere = new THREE.SphereGeometry(0.1, 8, 8); // Increased sphere size
    const mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    mesh.position.set(x, y, 0);
    // log position
    console.log(x, y);
    scene.add(mesh);
    spheres.push(mesh);  // Store the sphere mesh for movement
  }
});

// Add edges of Delaunay Triangulation
let lines = []; // To store line objects for animation
function addLines() {
  // Clear old lines
  lines.forEach(line => scene.remove(line));
  lines = [];

  for (let i = 0; i < delaunay.triangles.length; i += 3) {
    const p1 = [points[delaunay.triangles[i] * 2], points[delaunay.triangles[i] * 2 + 1]];
    const p2 = [points[delaunay.triangles[i + 1] * 2], points[delaunay.triangles[i + 1] * 2 + 1]];
    const p3 = [points[delaunay.triangles[i + 2] * 2], points[delaunay.triangles[i + 2] * 2 + 1]];

    // Create lines for the edges of the triangles
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p1[0], p1[1], 0), new THREE.Vector3(p2[0], p2[1], 0)]);
    const line = new THREE.Line(lineGeometry, material);
    scene.add(line);
    lines.push(line);

    // Repeat for the other edges
    const lineGeometry2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p2[0], p2[1], 0), new THREE.Vector3(p3[0], p3[1], 0)]);
    const line2 = new THREE.Line(lineGeometry2, material);
    scene.add(line2);
    lines.push(line2);

    const lineGeometry3 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p3[0], p3[1], 0), new THREE.Vector3(p1[0], p1[1], 0)]);
    const line3 = new THREE.Line(lineGeometry3, material);
    scene.add(line3);
    lines.push(line3);
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  let movement_ration = 0.05;

  // Move points slightly for animation (you can add your own movement logic here)
  for (let i = 0; i < points.length; i += 2) {
    points[i] += Math.random() * movement_ration - (movement_ration/2.0);  // x movement
    points[i + 1] += Math.random() * movement_ration - (movement_ration/2.0);  // y movement
  }

  // Update the triangulation and lines
  delaunay.update(points);
  addLines();  // Re-add lines after triangulation update

  // Update spheres' positions
  spheres.forEach((sphere, index) => {
    sphere.position.set(points[index * 2], points[index * 2 + 1], 0);
  });

  renderer.render(scene, camera);
}

camera.position.z = 10; // Camera farther back to see the scene
animate();

// Helper function to generate random points (flattened)
function generateRandomPoints(numPoints) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push(Math.random() * 10 - 5, Math.random() * 10 - 5);  // Random x, y pairs in a flat array
  }
  return points;
}
