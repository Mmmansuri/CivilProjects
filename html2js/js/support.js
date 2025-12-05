// ============================================
// SUPPORT VISUALIZATION
// ============================================

// Original support creation function - kept for future use
function createSupport(supportData) {
    const position = new THREE.Vector3(...supportData.location);
    const group = new THREE.Group();

    if (supportData.type === 'fixed') {
        // Fixed support - represented by a pyramid/cone
        const geometry = new THREE.ConeGeometry(0.3, 0.6, 4);
        const material = new THREE.MeshPhongMaterial({
            color: ELEMENT_COLORS.SUPPORT,
            shininess: 30
        });
        const cone = new THREE.Mesh(geometry, material);
        // cone.rotation.x = Math.PI;
        //cone.position.y = -0.3;
        //group.add(cone);

        // Add base plate
        const plateHeight = 0.1;
        const plateGeom = new THREE.CylinderGeometry(0.4, 0.4, plateHeight, 16);
        const plate = new THREE.Mesh(plateGeom, material);
        // Put the plate so its TOP sits at y = 0 (before the group's X-rotation)
        plate.position.y = -plateHeight / 2;   // was -0.65 with the cone present
        group.add(plate);

    } else if (supportData.type === 'pinned') {
        // Pinned support - represented by a triangle
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(-0.3, -0.5);
        shape.lineTo(0.3, -0.5);
        shape.lineTo(0, 0);

        const extrudeSettings = { depth: 0.1, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial({
            color: ELEMENT_COLORS.SUPPORT,
            shininess: 30
        });
        const triangle = new THREE.Mesh(geometry, material);
        triangle.position.z = -0.05;
        group.add(triangle);

        // Add circle at top
        const circleGeom = new THREE.SphereGeometry(0.15, 16, 16);
        const circle = new THREE.Mesh(circleGeom, material);
        circle.position.y = 0;
        group.add(circle);

    } else if (supportData.type === 'roller') {
        // Roller support - triangle with rollers
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(-0.3, -0.5);
        shape.lineTo(0.3, -0.5);
        shape.lineTo(0, 0);

        const extrudeSettings = { depth: 0.1, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial({
            color: ELEMENT_COLORS.SUPPORT,
            shininess: 30
        });
        const triangle = new THREE.Mesh(geometry, material);
        triangle.position.z = -0.05;
        group.add(triangle);

        // Add rollers
        const rollerGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 16);
        const roller1 = new THREE.Mesh(rollerGeom, material);
        roller1.position.set(-0.15, -0.6, 0);
        roller1.rotation.z = Math.PI / 2;
        group.add(roller1);

        const roller2 = new THREE.Mesh(rollerGeom, material);
        roller2.position.set(0.15, -0.6, 0);
        roller2.rotation.z = Math.PI / 2;
        group.add(roller2);
    }
    group.rotateX(Math.PI / 2);
    group.position.copy(position);
    structure.add(group);
}

// NEW FUNCTION: Find minimum Z level and calculate support locations
function calculateSupportLocationsAtBase() {
    if (!buildingBounds || !geometryData) {
        console.log('Cannot calculate support locations - missing data');
        return [];
    }
    
    // Calculate minimum Z in centered coordinates
    const minZ = buildingBounds.min.z - buildingCenter.z;
    
    console.log('Calculating support locations at Z =', minZ);
    
    // Find all unique XY positions at minimum level
    const tolerance = 0.1; // Small tolerance for floating point comparison
    const supportLocations = [];
    
    // Check all vertices in geometry
    const positions = geometryData;
    const offsetX = -buildingCenter.x;
    const offsetY = -buildingCenter.y;
    const offsetZ = -buildingCenter.z;
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i] + offsetX;
        const y = positions[i + 1] + offsetY;
        const z = positions[i + 2] + offsetZ;
        
        // If vertex is at minimum level
        if (Math.abs(z - minZ) < tolerance) {
            // Check if we already have a support at this XY location
            const exists = supportLocations.some(loc => 
                Math.abs(loc[0] - x) < 0.5 && Math.abs(loc[1] - y) < 0.5
            );
            
            if (!exists) {
                supportLocations.push([x, y, minZ]);
            }
        }
    }
    
    console.log(`Found ${supportLocations.length} support locations at base`);
    return supportLocations;
}

// NEW FUNCTION: Add supports at base using original support shapes
function addSupportsAtBase() {
    console.log('addSupportsAtBase called');
    console.log('structure:', structure);
    console.log('buildingBounds:', buildingBounds);
    console.log('geometryData:', geometryData ? 'exists' : 'null');
    
    if (!structure) {
        console.error('No structure available');
        return;
    }
    
    if (!buildingBounds || !geometryData) {
        console.error('Missing buildingBounds or geometryData');
        return;
    }
    
    const locations = calculateSupportLocationsAtBase();
    
    // Create fixed supports at each location using the original createSupport function
    locations.forEach(location => {
        const supportData = {
            type: 'fixed',  // Default to fixed support
            location: location
        };
        createSupport(supportData);
    });
    
    console.log(`Added ${locations.length} fixed supports at base`);
}
