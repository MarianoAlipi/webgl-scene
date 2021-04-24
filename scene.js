let scene, camera, renderer, cube;

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(
        75, // FOV angle
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near plane distance (too close to render)
        1000 // Far plane  distance (too far to render)
    );
    
    renderer = new THREE.WebGLRenderer( {antialias: true} );
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);    
    
    const geometry = new THREE.BoxGeometry(2, 2, 2); // depth, width, height
    const material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    camera.position.z = 5;
}

// Called every tick.
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
