let scene, camera, renderer, controls;
let cube, ground;
let leftPillar, rightPillar,
    nuki, gakuzuka,
    shimaki, kasagi,
    bar1, bar2, column1, column2,
    colTop1, colTop2, colTopCone1, colTopCone2,
    leftSideGroup, rightSideGroup,
    sun;

// Properties for the torii
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
    let geometry = new THREE.BoxGeometry(2, 2, 2);
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
    geometry = new THREE.BoxGeometry(11, 0.9, 0.5);
    nuki = new THREE.Mesh(geometry, TORII.redMaterial);
    nuki.position.x = TORII.x;
    nuki.position.y = TORII.y + TORII.pillarHeight / 4 + 0.5;
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
    geometry = new THREE.BoxGeometry(12, 0.9, 0.7);
    shimaki = new THREE.Mesh(geometry, TORII.redMaterial);
    shimaki.position.x = TORII.x;
    shimaki.position.y = TORII.y + TORII.pillarHeight / 2;
    shimaki.position.z = TORII.z;
    scene.add(shimaki);

    // -- KASAGI --
    // Top black bar
    geometry = new THREE.BoxGeometry(14.5, 0.9, 0.8);
    kasagi = new THREE.Mesh(geometry, TORII.blackMaterial);
    kasagi.position.x = TORII.x;
    kasagi.position.y = shimaki.position.y + 0.6;
    kasagi.position.z = TORII.z;
    scene.add(kasagi);

    // -- SIDE STRUCTURES --
    // Positions are relative to the group.
    geometry = new THREE.BoxGeometry(0.4, 0.65, 7.25);
    bar1 = new THREE.Mesh(geometry, TORII.redMaterial);
    bar1.position.y = 2;
    bar2 = bar1.clone();
    bar2.position.y = -0.75;

    // Columns
    geometry = new THREE.CylinderGeometry(0.35, 0.4, 6, 24);
    column1 = new THREE.Mesh(geometry, TORII.redMaterial);
    column1.position.z = 3;
    column2 = column1.clone();
    column2.position.z = -3;

    // Column top
    geometry = new THREE.CylinderGeometry(0.75, 0.7, 0.25, 4);
    colTop1 = new THREE.Mesh(geometry, TORII.redMaterial);
    colTop1.position.y = 3;
    colTop1.position.z = 3;
    colTop1.rotation.y = 0.8;
    colTop2 = colTop1.clone();
    colTop2.position.z = -3;

    // Cone on column top
    geometry = new THREE.ConeGeometry(0.85, 0.3, 4);
    colTopCone1 = new THREE.Mesh(geometry, TORII.blackMaterial);
    colTopCone1.position.y = 3.25;
    colTopCone1.position.z = 3;
    colTopCone1.rotation.y = 0.8;
    colTopCone2 = colTopCone1.clone();
    colTopCone2.position.z = -3;

    // Groups
    leftSideGroup = new THREE.Group();
    leftSideGroup.position.x = TORII.x - TORII.radius;
    leftSideGroup.position.y = TORII.y / 2;
    leftSideGroup.position.z = TORII.z;
    leftSideGroup.add(bar1);
    leftSideGroup.add(bar2);
    leftSideGroup.add(column1);
    leftSideGroup.add(column2);
    leftSideGroup.add(colTop1);
    leftSideGroup.add(colTop2);
    leftSideGroup.add(colTopCone1);
    leftSideGroup.add(colTopCone2);
    scene.add(leftSideGroup);

    rightSideGroup = leftSideGroup.clone();
    rightSideGroup.position.x = TORII.x + TORII.radius;
    scene.add(rightSideGroup);

    // == SUN ==
    // radius, widthSegments, heightSegments
    geometry = new THREE.SphereGeometry(2.5, 32, 32);
    material = new THREE.MeshBasicMaterial( {color: 0xfff9d4} );
    sun = new THREE.Mesh(geometry, material);
    sun.position.x = 16;
    sun.position.y = 16;
    sun.position.z = -40;
    scene.add(sun);

    // == CAMERA ==
    // Place the camera a bit higher.
    camera.position.y = 4;
    
    ///////////////////////
    //   DEBUG CAMERA   //
    //   /‾\_/‾\        //
    //  |\_/‾\_/‾‾|_    //
    //  |         | |   //
    //  |_________|‾    //
    camera.position.x = 0;
    camera.position.y = 6;
    camera.position.z = 10;
    
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    ///////////////////////
    
    // Tilt the camera slightly down.
    camera.rotation.x = -0.1;
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

// Called every tick.
function animate() {
    requestAnimationFrame(animate);

    //controls.update();

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
