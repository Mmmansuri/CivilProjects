// ============================================
// INTERACTION HANDLERS (FIXED FOR Z-UP)
// ============================================

let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let isDragging = false;
let isPanning = false;
let cameraTarget, cameraPan;

let keys = {};
let moveSpeed = 0.3;
let canvasHasFocus = false;

function onMouseDown(e) {
    if (e.button === 0) {
        isDragging = true;
        isPanning = false;
    } else if (e.button === 2) {
        isPanning = true;
        isDragging = false;
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function onMouseMove(e) {
    if (isDragging) {
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
        
        // For Z-up coordinate system with proper rotation:
        // - Horizontal drag rotates around the world Z axis (always vertical)
        // - Vertical drag rotates around the current horizontal axis (view-relative)
        
        // Horizontal rotation around world Z axis
        targetRotationY += deltaX * 0.005;
        
        // Vertical rotation - adjust direction based on current Z rotation
        // When rotated past 90 or 270 degrees, we need to flip the direction
        const currentZRot = structure ? structure.rotation.z : 0;
        const normalizedZ = ((currentZRot % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        
        // Determine if we're in a flipped quadrant (90-270 degrees)
        const isFlipped = normalizedZ > Math.PI / 2 && normalizedZ < Math.PI * 3 / 2;
        const direction = isFlipped ? 1 : -1;
        
        targetRotationX += deltaY * 0.005 * direction;
        
        // Clamp vertical rotation to prevent flipping
        targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationX));
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    } else if (isPanning) {
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
        
        const panSpeed = 0.05;
        
        // Get camera direction
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        
        // Calculate right vector (perpendicular to camera direction and up vector)
        // For Z-up, use (0, 0, 1) as the up vector
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 0, 1)).normalize();
        
        // Calculate actual up vector relative to camera
        const cameraUp = new THREE.Vector3();
        cameraUp.crossVectors(cameraRight, cameraDirection).normalize();
        
        // Apply panning
        const panX = cameraRight.clone().multiplyScalar(-deltaX * panSpeed);
        const panY = cameraUp.clone().multiplyScalar(deltaY * panSpeed);
        
        camera.position.add(panX).add(panY);
        cameraTarget.add(panX).add(panY);
        cameraPan.copy(cameraTarget);
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
}

function onMouseUp() {
    isDragging = false;
    isPanning = false;
}

function onWheel(e) {
    e.preventDefault();
    
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const zoomDirection = raycaster.ray.direction.clone();
    const zoomAmount = e.deltaY > 0 ? 2 : -2;
    
    camera.position.addScaledVector(zoomDirection, zoomAmount);
    cameraTarget.addScaledVector(zoomDirection, zoomAmount);
    cameraPan.copy(cameraTarget);
    
    const distance = camera.position.length();
    if (distance < 5) {
        camera.position.normalize().multiplyScalar(5);
    }
}

function onKeyDown(e) {
    const navKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
    const keyLower = e.key.toLowerCase();
    const codeLower = e.code.toLowerCase();
    
    if (canvasHasFocus && (navKeys.includes(keyLower) || navKeys.includes(codeLower))) {
        e.preventDefault();
        keys[keyLower] = true;
        keys[codeLower] = true;
    } else if (!navKeys.includes(keyLower) && !navKeys.includes(codeLower)) {
        keys[keyLower] = true;
        keys[codeLower] = true;
    }
}

function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
    keys[e.code.toLowerCase()] = false;
}

function updateWalkMovement() {
    if (!canvasHasFocus) return;

    // Get forward direction and project it onto the XY plane (horizontal plane in Z-up)
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.z = 0; // Changed from forward.y = 0 (keep movement in XY plane)
    forward.normalize();

    // Calculate right vector perpendicular to forward in XY plane
    // For Z-up system, cross with (0, 0, 1)
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 0, 1)).normalize();

    // Apply movement
    if (keys['w'] || keys['arrowup']) {
        camera.position.addScaledVector(forward, moveSpeed);
        cameraTarget.addScaledVector(forward, moveSpeed);
    }
    if (keys['s'] || keys['arrowdown']) {
        camera.position.addScaledVector(forward, -moveSpeed);
        cameraTarget.addScaledVector(forward, -moveSpeed);
    }

    if (keys['a'] || keys['arrowleft']) {
        camera.position.addScaledVector(right, -moveSpeed);
        cameraTarget.addScaledVector(right, -moveSpeed);
    }
    if (keys['d'] || keys['arrowright']) {
        camera.position.addScaledVector(right, moveSpeed);
        cameraTarget.addScaledVector(right, moveSpeed);
    }

    cameraPan.copy(cameraTarget);
}
