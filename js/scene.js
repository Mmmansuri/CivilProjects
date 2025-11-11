// ============================================
// THREE.JS SCENE SETUP
// ============================================

let scene, camera, renderer;
let structure;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        1,
        buildingMaxSize * 30
    );
    
    // Set Z as up axis (vertical)
    camera.up.set(0, 0, 1);
    
    // Auto-position camera based on building size
    const cameraDistance = buildingMaxSize * 3.5;
    camera.position.set(
        buildingCenter.x + cameraDistance * 0.8,
        buildingCenter.y + cameraDistance * 0.5,
        buildingCenter.z + cameraDistance * 0.8
    );
    
    cameraTarget = new THREE.Vector3(buildingCenter.x, buildingCenter.y, buildingCenter.z);
    cameraPan = new THREE.Vector3(buildingCenter.x, buildingCenter.y, buildingCenter.z);
    camera.lookAt(cameraTarget);

    const canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 20);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-20, 20, -20);
    scene.add(directionalLight2);

    createStructureFromData();

    // Canvas focus management
    canvas.addEventListener('mouseenter', () => {
        canvasHasFocus = true;
    });
    
    canvas.addEventListener('mouseleave', () => {
        canvasHasFocus = false;
    });

    canvas.addEventListener('mousedown', (e) => {
        canvasHasFocus = true;
        onMouseDown(e);
    });

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);

    animate();
}

function onWindowResize() {
    const container = document.getElementById('container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
