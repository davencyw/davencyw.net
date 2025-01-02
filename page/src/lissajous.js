import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';

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

// Create a renderer and set it to the canvas
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

let glitchPass;

// Define parameters for the Lissajous grid
const sizeGrid = 5;
const numCols = 8; // Number of frequency variations along the x-axis
const numRows = sizeGrid; // Number of phase variations along the y-axis
const freqRange = [1, 5]; // Frequency range for x-axis
const phaseRange = [0, Math.PI]; // Phase range for y-axis
const numPoints = 400; // Number of points per figure
const amplitude = 1; // Scale of each figure
const spacing = 3; // Spacing between figures

const labels = []; // Store labels for animation
const lissajousCurves = []; // Store the lissajous curve objects

// Create the Lissajous grid
for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
        const freqX = freqRange[0] + (col / (numCols - 1)) * (freqRange[1] - freqRange[0]);
        const freqY = freqRange[0]; // Keep y-frequency constant for simplicity
        const phase = phaseRange[0] + (row / (numRows - 1)) * (phaseRange[1] - phaseRange[0]);

        // Generate points for the Lissajous figure
        const points = [];
        for (let i = 0; i < numPoints; i++) {
            const t = (i / numPoints) * 2 * Math.PI;
            const x = amplitude * Math.sin(freqX * t + phase);
            const y = amplitude * Math.sin(freqY * t);
            points.push(new THREE.Vector3(x, y, 0));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create a material and line
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const lissajousCurve = new THREE.Line(geometry, material);

        // Position the figure in the grid
        lissajousCurve.position.x = col * spacing;
        lissajousCurve.position.y = row * spacing;
        scene.add(lissajousCurve);

        lissajousCurves.push({ curve: lissajousCurve, freqX, freqY, phase });
    }
}

// Set up camera position
camera.position.z = numCols * spacing;
camera.position.x = (numCols - 1) * spacing / 2;
camera.position.y = (numRows - 1) * spacing / 2;
camera.lookAt((numCols - 1) * spacing / 2, (numRows - 1) * spacing / 2, 0);
camera.position.z = 8;

// postprocessing
const composer = new EffectComposer(renderer);
composer.addPass( new RenderPass( scene, camera ) );

const effect1 = new ShaderPass( DotScreenShader );
effect1.uniforms[ 'scale' ].value = 2;
composer.addPass( effect1 );

// const effect2 = new ShaderPass( RGBShiftShader );
// effect2.uniforms[ 'amount' ].value = 0.0005;
// composer.addPass( effect2 );

// glitchPass = new GlitchPass();
// composer.addPass( glitchPass );

// const renderPixelatedPass = new RenderPixelatedPass( 16, scene, camera );
// composer.addPass( renderPixelatedPass );

// const unrealbloom = new UnrealBloomPass();
// unrealbloom.strength = 0.4;
// unrealbloom.radius = 0.3;
// unrealbloom.threshold = 0.0;
// composer.addPass( unrealbloom );

const effect3 = new OutputPass();
composer.addPass( effect3 );

// Animation loop
let time = 0;
const gapSpeed = 0.005; // Lower values = slower motion (more gap between oscillations), higher values = faster motion (closer oscillations)

function animate() {
    requestAnimationFrame(animate);
    time += gapSpeed; // Control the speed of the curve animation

    // Animate the Lissajous curves
    lissajousCurves.forEach(({ curve, freqX, freqY, phase }) => {
        const points = curve.geometry.attributes.position.array;
        for (let i = 0; i < numPoints; i++) {
            // const t = (i / numPoints) * 2 * Math.PI + time; // Update time for animation
            const tMin = Math.PI * 0.15; // Offset the start of the curve
            const tMax = Math.PI * 1.85; // Offset the end of the curve
            const t = tMin + ((i / numPoints) * (tMax - tMin)) + time;

            const x = amplitude * Math.sin(freqX * t + phase);
            const y = amplitude * Math.sin(freqY * t);
            points[i * 3] = x;
            points[i * 3 + 1] = y;
        }
        curve.geometry.attributes.position.needsUpdate = true; // Update the geometry
    });

    // renderer.render(scene, camera);
    composer.render();
}

animate();


// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


