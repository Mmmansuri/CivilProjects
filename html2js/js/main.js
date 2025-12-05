// ============================================
// MAIN INITIALIZATION AND ANIMATION
// ============================================

// Fullscreen Toggle Function
function toggleFullscreen() {
    const body = document.body;
    const toggle = document.getElementById('fullscreenToggle');
    
    if (toggle.checked) {
        body.classList.add('fullscreen-mode');
    } else {
        body.classList.remove('fullscreen-mode');
    }
    
    setTimeout(() => {
        onWindowResize();
    }, 100);
}

// Canvas Background Toggle Function
function toggleCanvasBackground() {
    const container = document.getElementById('container');
    const toggle = document.getElementById('canvasBgToggle');
    
    if (toggle.checked) {
        container.classList.add('dark-canvas');
        scene.background = new THREE.Color(0x1a1a1a);
    } else {
        container.classList.remove('dark-canvas');
        scene.background = new THREE.Color(0xf8fafc);
    }
}

// Slabs and Walls Toggle Function
function toggleSlabsWalls() {
    const toggle = document.getElementById('slabWallToggle');
    
    if (slabMesh) {
        slabMesh.visible = toggle.checked;
    }
    
    console.log('Slabs & Walls visibility:', toggle.checked);
}

// Create animated moving stars background
function createStars() {
    const container = document.getElementById('starsContainer');
    const numStars = 200;
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        const twinkleDuration = Math.random() * 4 + 2;
        const moveDuration = Math.random() * 40 + 40;
        
        star.style.animation = `twinkle ${twinkleDuration}s linear infinite, moveStar ${moveDuration}s linear infinite`;
        
        container.appendChild(star);
    }
}

createStars();

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

function animate() {
    requestAnimationFrame(animate);

    updateWalkMovement();

    if (structure) {
        // FIXED ROTATION with proper order (ZXY)
        // This ensures X rotation (tilt) always happens around a horizontal axis
        // even after Z rotation (spin)
        structure.rotation.order = 'ZXY';  // Apply Z first, then X, then Y
        
        // Smooth interpolation for rotations
        structure.rotation.z += (targetRotationY - structure.rotation.z) * 0.1;
        structure.rotation.x += (targetRotationX - structure.rotation.x) * 0.1;
    }

    if (cameraTarget && cameraPan) {
        cameraTarget.x = cameraPan.x;
        cameraTarget.y = cameraPan.y;
        camera.lookAt(cameraTarget);
    }

    renderer.render(scene, camera);
}

init();
