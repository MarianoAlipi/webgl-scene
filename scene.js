let scene, camera, renderer, controls;
let cube, water;
let leftPillar, rightPillar,
    nuki, gakuzuka,
    shimaki, kasagi,
    bar1, bar2, column1, column2,
    colTop1, colTop2, colTopCone1, colTopCone2,
    leftSideGroup, rightSideGroup,
    sun, sunGroup,
    shipBody, shipTip, shipRoof1, shipRoof2,
    shipGroup;

const   bobDuration = 30,
        sunInitialX = 50,
        sunMinY = -4,
        sunZ = -55;

const   seaTexture = new THREE.TextureLoader().load('textures/sea.jpg'),
        seaMaterial = new THREE.MeshBasicMaterial( {map: seaTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.4} );

let shipTurning = false, shipDir = 'left',
    shipBob = true, bobFrames = bobDuration;

// Properties for the torii
const TORII = {
    x: -8,
    y: 4.8,
    z: -15,
    pillarHeight: 10,
    radius: 3,
    textures: {
        'torii': new THREE.TextureLoader().load('textures/torii.png'),
        'pillar': new THREE.TextureLoader().load('textures/torii_pillar.png'),
        'roof': new THREE.TextureLoader().load('textures/roof.png'),
    },
    materials: {
        red: new THREE.MeshBasicMaterial( {color: 0xaa0000} ),
        black: new THREE.MeshBasicMaterial( {color: 0x0a0a0a} ),
        torii: null,
        pillar: null,
        roof: null,
    },
    init: function() {
        this.materials.torii = new THREE.MeshBasicMaterial( {map: this.textures.torii} );
        this.materials.pillar = new THREE.MeshBasicMaterial( {map: this.textures.pillar} );
        this.materials.roof = new THREE.MeshBasicMaterial( {map: this.textures.roof} );
        return this;
    }
}.init();

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
    renderer.setClearColor(0xd797f7);
    
    document.body.appendChild(renderer.domElement);

    // CUBE
    // width, height, depth, widthSegments, heightSegments, depthSegments
    let geometry = new THREE.BoxGeometry(2, 2, 2);
    let texture = new THREE.TextureLoader().load('textures/hello.png');
    let material = new THREE.MeshBasicMaterial( {map: texture} );
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = 20;
    cube.position.y = 2;
    cube.position.z = -10;
    scene.add(cube);
    
    // WATER
    // radius, segments
    geometry = new THREE.CircleGeometry(200, 32);
    material = new THREE.MeshBasicMaterial( {color: 0x3e67ad, side: THREE.DoubleSide} );
    //water = new THREE.Mesh(geometry, material);
    water = new THREE.Mesh(geometry, seaMaterial);
    water.rotation.x = -1 * Math.PI / 2;
    scene.add(water);

    // == TORII ==
    // -- LEFT PILLAR --
    // radiusTop, radiusBottom, height, radialSegments
    geometry = new THREE.CylinderGeometry(0.4, 0.7, TORII.pillarHeight, 32);
    leftPillar = new THREE.Mesh(geometry, TORII.materials.pillar);
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
    nuki = new THREE.Mesh(geometry, TORII.materials.torii);
    nuki.position.x = TORII.x;
    nuki.position.y = TORII.y + TORII.pillarHeight / 4 + 0.5;
    nuki.position.z = TORII.z;
    scene.add(nuki);

    // -- GAKUZUKA --
    // Bar from middle to top
    // TODO: Add plaque.
    geometry = new THREE.BoxGeometry(0.8, 2, 0.3);
    gakuzuka = new THREE.Mesh(geometry, TORII.materials.torii);
    gakuzuka.position.x = TORII.x;
    gakuzuka.position.y = nuki.position.y + 1.4;
    gakuzuka.position.z = TORII.z;
    scene.add(gakuzuka);
    
    // -- SHIMAKI --
    // Top red bar
    geometry = new THREE.BoxGeometry(12, 0.9, 0.7);
    shimaki = new THREE.Mesh(geometry, TORII.materials.torii);
    shimaki.position.x = TORII.x;
    shimaki.position.y = TORII.y + TORII.pillarHeight / 2;
    shimaki.position.z = TORII.z;
    scene.add(shimaki);

    // -- KASAGI --
    // Top black bar
    // TODO: Add sharp end. If possible, add curvature to the horizontal bars.
    geometry = new THREE.BoxGeometry(14.5, 0.9, 0.8);
    kasagi = new THREE.Mesh(geometry, TORII.materials.roof);
    kasagi.position.x = TORII.x;
    kasagi.position.y = shimaki.position.y + 0.6;
    kasagi.position.z = TORII.z;
    scene.add(kasagi);

    // -- SIDE STRUCTURES --
    // Positions are relative to the group.
    geometry = new THREE.BoxGeometry(0.4, 0.65, 7.25);
    bar1 = new THREE.Mesh(geometry, TORII.materials.torii);
    bar1.position.y = 2;
    bar2 = bar1.clone();
    bar2.position.y = -0.75;

    // Columns
    // TODO: Refactor smaller columns to be one complete object
    // (including top and topcone).
    geometry = new THREE.CylinderGeometry(0.35, 0.4, 6, 24);
    column1 = new THREE.Mesh(geometry, TORII.materials.pillar);
    column1.position.z = 3;
    column2 = column1.clone();
    column2.position.z = -3;

    // Column top
    geometry = new THREE.CylinderGeometry(0.75, 0.7, 0.25, 4);
    colTop1 = new THREE.Mesh(geometry, TORII.materials.torii);
    colTop1.position.y = 3;
    colTop1.position.z = 3;
    colTop1.rotation.y = 0.8;
    colTop2 = colTop1.clone();
    colTop2.position.z = -3;

    // Cone on column top
    geometry = new THREE.ConeGeometry(0.85, 0.3, 4);
    colTopCone1 = new THREE.Mesh(geometry, TORII.materials.roof);
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
    geometry = new THREE.SphereGeometry(3, 32, 32);
    material = new THREE.MeshBasicMaterial( {color: 0xfff9d4} );
    sun = new THREE.Mesh(geometry, material);
    sun.position.x = sunInitialX;

    // Adding the sun to a group makes the rotation
    // relative to the origin much easier.
    sunGroup = new THREE.Group();
    sunGroup.position.y = sunMinY;
    sunGroup.position.z = sunZ;
    sunGroup.add(sun);
    scene.add(sunGroup);

    // == SHIP ==
    // -- Body --
    // TODO: Add cover (plane) to the ship.
    geometry = new THREE.CylinderGeometry(1, 0.8, 3, 5, 3, false, 0, Math.PI);
    material = new THREE.MeshBasicMaterial( {color: 0x777777, side: THREE.DoubleSide} );
    shipBody = new THREE.Mesh(geometry, material);
    shipBody.rotation.z = 3 * Math.PI / 2;
    scene.add(shipBody);
    
    // -- Tip --
    geometry = new THREE.TetrahedronGeometry(0.9);
    shipTip = new THREE.Mesh(geometry, material);
    shipTip.position.x = -1.8;
    shipTip.position.y = -0.35;
    shipTip.rotation.x = 0.52;
    shipTip.rotation.y = 0.57;
    shipTip.rotation.z = 0.77;

    // -- Roof (1/2) --
    geometry = new THREE.BoxGeometry(1.8, 0.3, 1);
    shipRoof1 = new THREE.Mesh(geometry, material);
    shipRoof1.position.y = 0.15;

    // -- Roof (2/2) --
    geometry = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 2, 3, false, 0, Math.PI);
    shipRoof2 = new THREE.Mesh(geometry, material);
    shipRoof2.position.y = 0.3;
    shipRoof2.rotation.z = Math.PI / 2;

    shipGroup = new THREE.Group();
    shipGroup.add(shipBody);
    shipGroup.add(shipTip);
    shipGroup.add(shipRoof1);
    shipGroup.add(shipRoof2);

    shipGroup.position.x = 50;
    shipGroup.position.y = 0.6;
    shipGroup.position.z = -35;
    scene.add(shipGroup);

    // TODO: Add sky box.

    // == CAMERA ==
    // Place the camera a bit higher.
    camera.position.y = 4;
    
    ///////////////////////
    //   DEBUG CAMERA   //
    //   /‾‾\_/‾‾\      //
    //  |\__/‾\__/‾‾|_  //
    //  |           | | //
    //  |___________|‾  //
    camera.position.x = 0;
    camera.position.y = 3;
    camera.position.z = 10;
    //                  //
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

    controls.update();

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Sun movement
    sunGroup.rotation.z += 0.003;

    // Reset sun position
    if (sunGroup.rotation.z >= Math.PI + Math.PI / 4) {
        sunGroup.rotation.z = 0;
    }

    // Ship bobbing
    shipGroup.position.y += (shipBob ? 1 : -1) * Math.random() * 0.01;
    if (--bobFrames <= 0) {
        shipBob = !shipBob;
        bobFrames = bobDuration + (Math.random() < 0.5 ? 1 : -1) * 5;
    }
    
    if (shipGroup.position.y < 0.6) {
        shipGroup.position.y = 0.6;
    } else if (shipGroup.position.y > 0.7) {
        shipGroup.position.y = 0.7;
    }

    // TODO: Make the sea movement independent.
    water.position.y += (shipBob ? 1 : -1) * Math.random() * 0.02;

    if (water.position.y < -0.2) {
        water.position.y = -0.2;
    } else if (water.position.y > 0.2) {
        water.position.y = 0.2;
    }

    // Ship movement and turning
    if (shipTurning) {
        if (shipDir == 'left') {
            if (shipGroup.rotation.y < Math.PI) {
                shipGroup.rotation.y += 0.035;
                shipTurning = true;
            } else {
                shipTurning = false;
                shipDir = 'right';
            }
        } else {
            if (shipGroup.rotation.y > 0) {
                shipGroup.rotation.y -= 0.035;
                shipTurning = true;
            } else {
                shipTurning = false;
                shipDir = 'left';
            }
        }
    } else {
        if (shipDir == 'left') {
            if (shipGroup.position.x > -50) {
                shipGroup.position.x -= 0.025;
                shipTurning = false;
            } else {
                shipTurning = true;
            }
        } else {
            if (shipGroup.position.x < 50) {
                shipGroup.position.x += 0.025;
                shipTurning = false;
            } else {
                shipTurning = true;
            }
        }
    }

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
