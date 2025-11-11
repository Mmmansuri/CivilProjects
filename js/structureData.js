// ============================================
// STRUCTURAL DATA DEFINITION
// ============================================

// Define element colors
const ELEMENT_COLORS = {
    COLUMN: 0x4CAF50,      // Green
    BEAM: 0x2196F3,        // Blue
    BRACE: 0xFF9800,       // Orange
    WALL: 0xBDBDBD,        // Gray (transparent)
    SLAB: 0x9E9E9E,        // Dark Gray (transparent)
    SUPPORT: 0xFF0000      // Red
};

// Cross-section definitions
const CROSS_SECTIONS = {
    I_350x12x400x20: { type: 'i-beam', height: 0.39, width: 0.4, webThickness: 0.012, flangeThickness: 0.02 },
    I_350x10x330x15: { type: 'i-beam', height: 0.38, width: 0.33, webThickness: 0.01, flangeThickness: 0.015 },
};

// Structural elements data
const structuralData = {
    // Columns (start point, end point, cross-section, local rotation angle in degrees)
    columns: [
        { id: '56', start: [0, 0, 0.25], end: [0, 0, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: '60', start: [0, 5, 0.25], end: [0, 5, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: '64', start: [6, 0, 0.25], end: [6, 0, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: '68', start: [6, 5, 0.25], end: [6, 5, 3.8], section: 'I_350x12x400x20', rotation: 0 },
    ],

    // Beams (start point, end point, cross-section, local rotation angle in degrees)
    beams: [
        { id: '5', start: [0, 5, 3.8], end: [0, 0, 3.8], section: 'I_350x10x330x15', rotation: 0 },
        { id: '6', start: [0, 0, 3.8], end: [6, 0, 3.8], section: 'I_350x10x330x15', rotation: 90 },
        { id: '7', start: [6, 0, 3.8], end: [6, 5, 3.8], section: 'I_350x10x330x15', rotation: 0 },
        { id: '8', start: [6, 5, 3.8], end: [0, 5, 3.8], section: 'I_350x10x330x15', rotation: 90 },
    ],

    // Braces (start point, end point, cross-section, local rotation angle in degrees)
    braces: [ 
        { id: '155', start: [0, 0, .25], end: [6, 5, 3.8], section: 'I_350x10x330x15', rotation: 0 },
],

    // Slabs (defined by corner points)
// Slabs (defined by corner points)
slabs: [
    { 
        id: 'SLAB1', 
        points: [
            [0, 0, 3.8],    // Bottom-left corner
            [6, 0, 3.8],    // Bottom-right corner
            [6, 5, 3.8],    // Top-right corner
            [0, 5, 3.8]     // Top-left corner
        ], 
        thickness: 0.2      // 200mm thick slab
    }
],

// Walls (defined by corner points, with thickness)
walls: [
    { 
        id: 'WALL1', 
        points: [
            [0, 0, 0.25],   // Bottom-left at foundation level
            [6, 0, 0.25],   // Bottom-right at foundation level
            [6, 0, 3.8],    // Top-right at roof level
            [0, 0, 3.8]     // Top-left at roof level
        ], 
        thickness: 0.15     // 150mm thick wall
    }
],


    // Supports (point location, type: 'fixed', 'pinned', 'roller')
    supports: [
        { id: 'SUP1', location: [0.000, 0.000, 0.250], type: 'pinned' },
        { id: 'SUP2', location: [0.000, 5.000, 0.250], type: 'fixed' },
        { id: 'SUP3', location: [6.000, 0.000, 0.250], type: 'roller' },
        { id: 'SUP4', location: [6.000, 5.000, 0.250], type: 'pinned' },
    ]
};


// ============================================
// CROSS-SECTION GEOMETRY CREATION
// ============================================

function createCircularCrossSection(diameter, length) {
    // Cylinder geometry: radiusTop, radiusBottom, height, radialSegments
    return new THREE.CylinderGeometry(diameter / 2, diameter / 2, length, 32);
}

function createRectangularCrossSection(width, height, length) {
    // Box geometry: width(X), height(Y), depth(Z)
    // For extrusion along length, we use: width, height, length
    return new THREE.BoxGeometry(width, height, length);
}

function createIBeamCrossSection(sectionData, length) {
    const { height, width, webThickness, flangeThickness } = sectionData;
    
    // Create I-beam shape in XY plane, extrude along Z
    const shape = new THREE.Shape();
    
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfWeb = webThickness / 2;
    
    // Start from bottom-left of bottom flange
    shape.moveTo(-halfWidth, -halfHeight);
    shape.lineTo(halfWidth, -halfHeight);
    shape.lineTo(halfWidth, -halfHeight + flangeThickness);
    shape.lineTo(halfWeb, -halfHeight + flangeThickness);
    shape.lineTo(halfWeb, halfHeight - flangeThickness);
    shape.lineTo(halfWidth, halfHeight - flangeThickness);
    shape.lineTo(halfWidth, halfHeight);
    shape.lineTo(-halfWidth, halfHeight);
    shape.lineTo(-halfWidth, halfHeight - flangeThickness);
    shape.lineTo(-halfWeb, halfHeight - flangeThickness);
    shape.lineTo(-halfWeb, -halfHeight + flangeThickness);
    shape.lineTo(-halfWidth, -halfHeight + flangeThickness);
    shape.lineTo(-halfWidth, -halfHeight);
    
    const extrudeSettings = {
        depth: length,
        bevelEnabled: false,
        steps: 1
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Center the geometry - ExtrudeGeometry starts at Z=0 and goes to Z=length
    geometry.translate(0, 0, -length / 2);
    
    return geometry;
}

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
