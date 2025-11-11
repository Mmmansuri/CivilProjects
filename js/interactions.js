// ============================================
// INTERACTION HANDLERS (ROTATION AROUND MAJOR AXES)
// ============================================

let mouseX = 0, mouseY = 0;
let isDragging = false;
let isPanning = false;
let cameraTarget, cameraPan;

// New variable for dynamic rotation center
let rotationCenter = new THREE.Vector3();
let dragStartX = 0, dragStartY = 0;
let rotationAxisLocked = null;

let keys = {};
let moveSpeed = 0.3;
let canvasHasFocus = false;

function onMouseDown(e) {
    if (e.button === 0) {
        isDragging = true;
        isPanning = false;
        rotationAxisLocked = null; // Reset axis lock
        
        // Raycast to find the 3D point where user clicked
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        // Check intersection with structure
        const intersects = raycaster.intersectObjects(structure.children, true);
        
        if (intersects.length > 0) {
            // Set rotation center to the clicked point
            rotationCenter.copy(intersects[0].point);
        } else {
            // If no intersection, use a point at a default distance along the ray
            const defaultDistance = 20; // Adjust based on your scene
            rotationCenter.copy(camera.position).add(
                raycaster.ray.direction.multiplyScalar(defaultDistance)
            );
        }
        
        // Store initial drag position
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
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
        
        // If axis not locked yet, determine which axis to use based on initial movement
        if (rotationAxisLocked === null) {
            const totalDeltaX = Math.abs(e.clientX - dragStartX);
            const totalDeltaY = Math.abs(e.clientY - dragStartY);
            
            // Need minimum movement to lock axis (prevents jitter)
            const threshold = 5;
            if (totalDeltaX > threshold || totalDeltaY > threshold) {
                if (totalDeltaX > totalDeltaY) {
                    // Horizontal movement dominates - rotate around Z axis (vertical)
                    rotationAxisLocked = 'Z';
                } else {
                    // Vertical movement dominates - determine X or Y based on camera angle
                    const cameraDirection = new THREE.Vector3();
                    camera.getWorldDirection(cameraDirection);
                    
                    // Project camera direction onto XY plane
                    const projectedDir = new THREE.Vector2(cameraDirection.x, cameraDirection.y).normalize();
                    
                    // Determine if camera is more aligned with X or Y axis
                    if (Math.abs(projectedDir.x) > Math.abs(projectedDir.y)) {
                        // Camera looking more along X, so rotate around Y
                        rotationAxisLocked = 'Y';
                    } else {
                        // Camera looking more along Y, so rotate around X
                        rotationAxisLocked = 'X';
                    }
                }
            }
        }
        
        // Apply rotation if axis is locked
        if (rotationAxisLocked !== null) {
            const rotationSpeed = 0.005;
            let rotationAxis;
            let angle;
            
            if (rotationAxisLocked === 'Z') {
                // Rotate around Z-axis (vertical)
                rotationAxis = new THREE.Vector3(0, 0, 1);
                angle = deltaX * rotationSpeed;
            } else if (rotationAxisLocked === 'X') {
                // Rotate around X-axis
                rotationAxis = new THREE.Vector3(1, 0, 0);
                angle = -deltaY * rotationSpeed;
            } else if (rotationAxisLocked === 'Y') {
                // Rotate around Y-axis
                rotationAxis = new THREE.Vector3(0, 1, 0);
                angle = -deltaY * rotationSpeed;
            }
            
            // Get vector from rotation center to camera
            const offset = new THREE.Vector3().subVectors(camera.position, rotationCenter);
            
            // Create quaternion for rotation around the chosen axis
            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(rotationAxis, angle);
            
            // Apply rotation to offset
            offset.applyQuaternion(quaternion);
            
            // Update camera position
            camera.position.copy(rotationCenter).add(offset);
            
            // Make camera look at rotation center
            camera.lookAt(rotationCenter);
            
            // Update camera target
            cameraTarget.copy(rotationCenter);
        }
        
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
    rotationAxisLocked = null; // Reset axis lock
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