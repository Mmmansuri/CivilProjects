// ============================================
// AUTOMATIC BUILDING CALCULATIONS
// ============================================

// Calculate building bounds automatically from data
function calculateBuildingBounds() {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    
    // Check all element types
    const allElements = [
        ...structuralData.columns,
        ...structuralData.beams,
        ...structuralData.braces
    ];
    
    allElements.forEach(element => {
        [element.start, element.end].forEach(point => {
            minX = Math.min(minX, point[0]);
            minY = Math.min(minY, point[1]);
            minZ = Math.min(minZ, point[2]);
            maxX = Math.max(maxX, point[0]);
            maxY = Math.max(maxY, point[1]);
            maxZ = Math.max(maxZ, point[2]);
        });
    });
    
    structuralData.slabs.forEach(slab => {
        slab.points.forEach(point => {
            minX = Math.min(minX, point[0]);
            minY = Math.min(minY, point[1]);
            minZ = Math.min(minZ, point[2]);
            maxX = Math.max(maxX, point[0]);
            maxY = Math.max(maxY, point[1]);
            maxZ = Math.max(maxZ, point[2]);
        });
    });
    
    structuralData.walls.forEach(wall => {
        wall.points.forEach(point => {
            minX = Math.min(minX, point[0]);
            minY = Math.min(minY, point[1]);
            minZ = Math.min(minZ, point[2]);
            maxX = Math.max(maxX, point[0]);
            maxY = Math.max(maxY, point[1]);
            maxZ = Math.max(maxZ, point[2]);
        });
    });
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;
    
    const sizeX = maxX - minX;
    const sizeY = maxY - minY;
    const sizeZ = maxZ - minZ;
    
    const maxSize = Math.max(sizeX, sizeY, sizeZ);
    
    return {
        center: { x: centerX, y: centerY, z: centerZ },
        size: { x: sizeX, y: sizeY, z: sizeZ },
        maxSize: maxSize,
        bounds: { minX, minY, minZ, maxX, maxY, maxZ }
    };
}

// ============================================
// ELEMENT CREATION FUNCTIONS
// ============================================

function createStructureFromData() {
    structure = new THREE.Group();

    // Create grid perpendicular to Z axis (horizontal plane in XY)
    const gridSize = Math.max(buildingBounds.size.x, buildingBounds.size.y) * 2;
    const gridDivisions = Math.ceil(gridSize / 2);
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x888888, 0xcccccc);
    
    // GridHelper is created in XZ plane by default, rotate to XY plane
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(buildingCenter.x, buildingCenter.y, 0);
    structure.add(gridHelper);

    // Create global axes - size based on building
    const axesSize = buildingMaxSize * 0.3;
    const axesHelper = new THREE.AxesHelper(axesSize);
    structure.add(axesHelper);

    // Create supports
    structuralData.supports.forEach(support => {
        createSupport(support);
    });

    // Create columns
    structuralData.columns.forEach(column => {
        createColumn(column);
    });

    // Create beams
    structuralData.beams.forEach(beam => {
        createBeam(beam);
    });

    // Create braces
    structuralData.braces.forEach(brace => {
        createBrace(brace);
    });

    // Create slabs
    structuralData.slabs.forEach(slab => {
        createSlab(slab);
    });

    // Create walls
    structuralData.walls.forEach(wall => {
        createWall(wall);
    });

    scene.add(structure);
}

function createColumn(columnData) {
    const start = new THREE.Vector3(...columnData.start);
    const end = new THREE.Vector3(...columnData.end);
    const section = CROSS_SECTIONS[columnData.section];
    
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    let geometry;
    if (section.type === 'circular') {
        geometry = createCircularCrossSection(section.diameter, length);
    } else if (section.type === 'rectangular') {
        geometry = createRectangularCrossSection(section.width, section.height, length);
    } else if (section.type === 'i-beam') {
        geometry = createIBeamCrossSection(section, length);
    }

    const material = new THREE.MeshPhongMaterial({
        color: ELEMENT_COLORS.COLUMN,
        shininess: 30
    });

    const column = new THREE.Mesh(geometry, material);
    column.position.copy(midpoint);

    // Align column with direction vector (columns are vertical, so align with Y-axis by default)
    if (section.type === 'circular') {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        column.setRotationFromQuaternion(quaternion);
    } else if (section.type === 'rectangular' || section.type === 'i-beam') {
        // For extruded shapes, the extrusion is along Z, so we need different alignment
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());
        column.setRotationFromQuaternion(quaternion);
    }

    // Apply local rotation around the longitudinal axis (start to end direction)
    if (columnData.rotation !== 0) {
        const longitudinalAxis = direction.clone().normalize();
        column.rotateOnWorldAxis(longitudinalAxis, (columnData.rotation * Math.PI) / 180);
    }

    structure.add(column);
}

function createBeam(beamData) {
    const start = new THREE.Vector3(...beamData.start);
    const end = new THREE.Vector3(...beamData.end);
    const section = CROSS_SECTIONS[beamData.section];
    
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    let geometry;
    if (section.type === 'rectangular') {
        geometry = createRectangularCrossSection(section.width, section.height, length);
    } else if (section.type === 'i-beam') {
        geometry = createIBeamCrossSection(section, length);
    } else if (section.type === 'circular') {
        geometry = createCircularCrossSection(section.diameter, length);
    }

    const material = new THREE.MeshPhongMaterial({
        color: ELEMENT_COLORS.BEAM,
        shininess: 30
    });

    const beam = new THREE.Mesh(geometry, material);
    beam.position.copy(midpoint);

    // Align beam with direction vector
    if (section.type === 'circular') {
        // For cylinder, align Y-axis with direction
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        beam.setRotationFromQuaternion(quaternion);
    } else {
        // For extruded shapes (rectangular and I-beam), align Z-axis with direction
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());
        beam.setRotationFromQuaternion(quaternion);
    }

    // Apply local rotation around the longitudinal axis (start to end direction)
    if (beamData.rotation !== 0) {
        const longitudinalAxis = direction.clone().normalize();
        beam.rotateOnWorldAxis(longitudinalAxis, (beamData.rotation * Math.PI) / 180);
    }

    structure.add(beam);
}

function createBrace(braceData) {
    const start = new THREE.Vector3(...braceData.start);
    const end = new THREE.Vector3(...braceData.end);
    const section = CROSS_SECTIONS[braceData.section];
    
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    let geometry;
    if (section.type === 'circular') {
        geometry = createCircularCrossSection(section.diameter, length);
    } else if (section.type === 'rectangular') {
        geometry = createRectangularCrossSection(section.width, section.height, length);
    } else if (section.type === 'i-beam') {
        geometry = createIBeamCrossSection(section, length);
    }

    const material = new THREE.MeshPhongMaterial({
        color: ELEMENT_COLORS.BRACE,
        shininess: 30
    });

    const brace = new THREE.Mesh(geometry, material);
    brace.position.copy(midpoint);

    // Align brace with direction vector
    if (section.type === 'circular') {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        brace.setRotationFromQuaternion(quaternion);
    } else {
        // For extruded shapes
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());
        brace.setRotationFromQuaternion(quaternion);
    }

    structure.add(brace);
}

function createSlab(slabData) {
    const points = slabData.points.map(p => new THREE.Vector3(...p));
    
    // Calculate dimensions
    const width = points[1].distanceTo(points[0]);
    const depth = points[2].distanceTo(points[1]);
    
    // Calculate center
    const center = new THREE.Vector3();
    points.forEach(p => center.add(p));
    center.divideScalar(points.length);

    const geometry = new THREE.BoxGeometry(width, slabData.thickness, depth);
    const material = new THREE.MeshPhongMaterial({
        color: ELEMENT_COLORS.SLAB,
        transparent: true,
        opacity: 0.6,
        shininess: 30
    });

    const slab = new THREE.Mesh(geometry, material);
    slab.position.copy(center);

    structure.add(slab);
}

function createWall(wallData) {
    const points = wallData.points.map(p => new THREE.Vector3(...p));
    
    // Calculate dimensions
    const width = points[1].distanceTo(points[0]);
    const height = points[2].y - points[0].y;
    
    // Calculate center
    const center = new THREE.Vector3();
    points.forEach(p => center.add(p));
    center.divideScalar(points.length);

    // Determine orientation
    const isAlongX = Math.abs(points[1].x - points[0].x) > 0.01;
    
    const geometry = isAlongX ? 
        new THREE.BoxGeometry(width, height, wallData.thickness) :
        new THREE.BoxGeometry(wallData.thickness, height, width);

    const material = new THREE.MeshPhongMaterial({
        color: ELEMENT_COLORS.WALL,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        shininess: 20
    });

    const wall = new THREE.Mesh(geometry, material);
    wall.position.copy(center);

    structure.add(wall);
}

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
