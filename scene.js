let scene, camera, renderer, controls;
let cube, ground;
let leftPillar, rightPillar, nuki, gakuzuka, shimaki, kasagi;

const TORII = {
    x: -8,
    y: 4.8,
    z: -15,
    pillarHeight: 9.5,
    radius: 3,
    redMaterial: new THREE.MeshBasicMaterial( {color: 0xaa0000} ),
    blackMaterial: new THREE.MeshBasicMaterial( {color: 0x0a0a0a} ),
};

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(
        80, // FOV angle
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near plane distance (too close to render)
        1000 // Far plane  distance (too far to render)
    );
    
    renderer = new THREE.WebGLRenderer( {antialias: true} );
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);

    // CUBE
    // width, height, depth, widthSegments, heightSegments, depthSegments
    let geometry = new THREE.BoxGeometry(2, 2, 2); // depth, width, height
    let texture = new THREE.TextureLoader().load('textures/hello.png');
    let material = new THREE.MeshBasicMaterial( {map: texture} );
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = 10;
    cube.position.y = 2;
    cube.position.z = -10;
    scene.add(cube);
    
    // GROUND
    // width, height, widthSegments, heightSegments
    geometry = new THREE.PlaneGeometry(50, 50);
    material = new THREE.MeshBasicMaterial( {color: 0x555555, side: THREE.DoubleSide} );
    ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = Math.PI / 2;
    scene.add(ground);

    // == TORII ==
    // -- LEFT PILLAR --
    // radiusTop, radiusBottom, height, radialSegments
    geometry = new THREE.CylinderGeometry(0.4, 0.7, TORII.pillarHeight, 32);
    leftPillar = new THREE.Mesh(geometry, TORII.redMaterial);
    leftPillar.position.x = TORII.x - TORII.radius;
    leftPillar.position.y = TORII.y;
    leftPillar.position.z = TORII.z;
    scene.add(leftPillar);
    
    // -- RIGHT PILLAR --
    rightPillar = leftPillar.clone();
    rightPillar.position.x += 2 * TORII.radius;
    scene.add(rightPillar);

    // -- NUKI --
    // Middle horizontal bar
    geometry = new THREE.BoxGeometry(9, 0.9, 0.5);
    nuki = new THREE.Mesh(geometry, TORII.redMaterial);
    nuki.position.x = TORII.x;
    nuki.position.y = TORII.y + TORII.pillarHeight / 4;
    nuki.position.z = TORII.z;
    scene.add(nuki);

    // -- GAKUZUKA --
    // Bar from middle to top
    geometry = new THREE.BoxGeometry(0.8, 2, 0.3);
    gakuzuka = new THREE.Mesh(geometry, TORII.redMaterial);
    gakuzuka.position.x = TORII.x;
    gakuzuka.position.y = nuki.position.y + 1.4;
    gakuzuka.position.z = TORII.z;
    scene.add(gakuzuka);
    
    // -- SHIMAKI --
    // Top red bar
    geometry = new THREE.BoxGeometry(10, 0.9, 0.7);
    shimaki = new THREE.Mesh(geometry, TORII.redMaterial);
    shimaki.position.x = TORII.x;
    shimaki.position.y = TORII.y + TORII.pillarHeight / 2 + 0.4;
    shimaki.position.z = TORII.z;
    scene.add(shimaki);

    // -- KASAGI --
    // Top black bar
    geometry = new THREE.BoxGeometry(12, 0.9, 0.8);
    kasagi = new THREE.Mesh(geometry, TORII.blackMaterial);
    kasagi.position.x = TORII.x;
    kasagi.position.y = shimaki.position.y + 1;
    kasagi.position.z = TORII.z;
    scene.add(kasagi);

    // == CAMERA ==
    // Place the camera a bit higher.
    camera.position.y = 4;
    
    ///////////////////////
    //   DEBUG CAMERA   //
    //  /‾\_/‾\         //
    // |\_/‾\_/‾‾|_     //
    // |         | |    //
    // |_________|‾     //
    camera.position.x = -2;
    camera.position.y = 7;
    camera.position.z = -8;-12;
    
    camera.rotation.y = 0.7;1.5;
    camera.rotation.z = 0.1;
    ///////////////////////
    
    // Tilt the camera slightly down.
    camera.rotation.x = -0.2;
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

// Called every tick.
function animate() {
    requestAnimationFrame(animate);

    controls.update();

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
