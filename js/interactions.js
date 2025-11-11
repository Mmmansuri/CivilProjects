// ============================================
// INTERACTION HANDLERS (ARCBALL ROTATION)
// ============================================

let mouseX = 0, mouseY = 0;
let isDragging = false;
let isPanning = false;
let cameraTarget, cameraPan;

// Rotation center - initialize with a default value
let rotationCenter = new THREE.Vector3(0, 0, 0);
let cameraDistance = 50;

let keys = {};
let moveSpeed = 0.3;
let canvasHasFocus = false;

// Helper function to get building center (call this after structure is created)
function initializeRotationCenter() {
    if (typeof buildingBounds !== 'undefined' && buildingBounds.center) {
        rotationCenter.set(
            buildingBounds.center.x, 
            buildingBounds.center.y, 
            buildingBounds.center.z
        );
    } else {
        // Fallback to origin
        rotationCenter.set(0, 0, 0);
    }
}

function onMouseDown(e) {
    if (e.button === 0) {
        isDragging = true;
        isPanning = false;
        
        // Raycast to find the 3D point where user clicked
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        // Check intersection with structure
        if (typeof structure !== 'undefined' && structure.children) {
            const intersects = raycaster.intersectObjects(structure.children, true);
            
            if (intersects.length > 0) {
                // Set rotation center to the clicked point
                rotationCenter.copy(intersects[0].point);
            } else {
                // If no intersection, use building center or origin
                if (typeof buildingBounds !== 'undefined' && buildingBounds.center) {
                    rotationCenter.set(
                        buildingBounds.center.x, 
                        buildingBounds.center.y, 
                        buildingBounds.center.z
                    );
                } else {
                    rotationCenter.set(0, 0, 5);
                }
            }
        }
        
        // Store camera distance from rotation center
        cameraDistance = camera.position.distanceTo(rotationCenter);
        
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
        
        // Arcball rotation speeds
        const rotationSpeed = 0.01;
        
        // Calculate angles
        const deltaAzimuth = deltaX * rotationSpeed;   // Horizontal rotation around Z
        const deltaElevation = deltaY * rotationSpeed;  // Vertical rotation
        
        // Get current camera offset from rotation center
        const offset = new THREE.Vector3().subVectors(camera.position, rotationCenter);
        
        // Convert to spherical coordinates for easier manipulation
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(offset);
        
        // Apply rotations
        spherical.theta -= deltaAzimuth;  // Azimuth (horizontal rotation)
        spherical.phi -= deltaElevation;  // Elevation (vertical rotation)
        
        // Limit elevation to prevent flipping (keep between 0.1 and PI-0.1)
        const minPhi = 0.1;
        const maxPhi = Math.PI - 0.1;
        spherical.phi = Math.max(minPhi, Math.min(maxPhi, spherical.phi));
        
        // Convert back to Cartesian coordinates
        offset.setFromSpherical(spherical);
        
        // Update camera position
        camera.position.copy(rotationCenter).add(offset);
        
        // Make camera look at rotation center
        camera.lookAt(rotationCenter);
        
        // Update camera target if it exists
        if (typeof cameraTarget !== 'undefined') {
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
        
        if (typeof cameraTarget !== 'undefined') {
            cameraTarget.add(panX).add(panY);
        }
        rotationCenter.add(panX).add(panY); // Also move rotation center
        
        if (typeof cameraPan !== 'undefined') {
            cameraPan.copy(cameraTarget);
        }
        
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
    
    // Zoom towards/away from rotation center
    const zoomAmount = e.deltaY > 0 ? 1.1 : 0.9;
    
    // Get vector from rotation center to camera
    const offset = new THREE.Vector3().subVectors(camera.position, rotationCenter);
    
    // Scale the offset (zoom in/out)
    offset.multiplyScalar(zoomAmount);
    
    // Limit minimum distance
    const minDistance = 2;
    if (offset.length() < minDistance) {
        offset.normalize().multiplyScalar(minDistance);
    }
    
    // Update camera position
    camera.position.copy(rotationCenter).add(offset);
    
    if (typeof cameraTarget !== 'undefined') {
        cameraTarget.copy(rotationCenter);
    }
    
    if (typeof cameraPan !== 'undefined') {
        cameraPan.copy(cameraTarget);
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
    forward.z = 0; // Keep movement in XY plane
    forward.normalize();

    // Calculate right vector perpendicular to forward in XY plane
    // For Z-up system, cross with (0, 0, 1)
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 0, 1)).normalize();

    // Apply movement
    if (keys['w'] || keys['arrowup']) {
        camera.position.addScaledVector(forward, moveSpeed);
        if (typeof cameraTarget !== 'undefined') {
            cameraTarget.addScaledVector(forward, moveSpeed);
        }
        rotationCenter.addScaledVector(forward, moveSpeed);
    }
    if (keys['s'] || keys['arrowdown']) {
        camera.position.addScaledVector(forward, -moveSpeed);
        if (typeof cameraTarget !== 'undefined') {
            cameraTarget.addScaledVector(forward, -moveSpeed);
        }
        rotationCenter.addScaledVector(forward, -moveSpeed);
    }

    if (keys['a'] || keys['arrowleft']) {
        camera.position.addScaledVector(right, -moveSpeed);
        if (typeof cameraTarget !== 'undefined') {
            cameraTarget.addScaledVector(right, -moveSpeed);
        }
        rotationCenter.addScaledVector(right, -moveSpeed);
    }
    if (keys['d'] || keys['arrowright']) {
        camera.position.addScaledVector(right, moveSpeed);
        if (typeof cameraTarget !== 'undefined') {
            cameraTarget.addScaledVector(right, moveSpeed);
        }
        rotationCenter.addScaledVector(right, moveSpeed);
    }

    if (typeof cameraPan !== 'undefined' && typeof cameraTarget !== 'undefined') {
        cameraPan.copy(cameraTarget);
    }
}