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
    CIRCULAR_100: { type: 'circular', diameter: 0.1 }, 
};

// Structural elements data
const structuralData = {
    // Columns (start point, end point, cross-section, local rotation angle in degrees)
    columns: [
        // Ground floor columns (Z: 0.25 to 3.8)
        { id: 'C11', start: [0, 0, 0.25], end: [0, 0, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C12', start: [0, 5, 0.25], end: [0, 5, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C13', start: [0, 10, 0.25], end: [0, 10, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C14', start: [6, 0, 0.25], end: [6, 0, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C15', start: [6, 5, 0.25], end: [6, 5, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C16', start: [6, 10, 0.25], end: [6, 10, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C17', start: [12, 0, 0.25], end: [12, 0, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C18', start: [12, 5, 0.25], end: [12, 5, 3.8], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C19', start: [12, 10, 0.25], end: [12, 10, 3.8], section: 'I_350x12x400x20', rotation: 0 },

        // First floor columns (Z: 3.8 to 7.4)
        { id: 'C21', start: [0, 0, 3.8], end: [0, 0, 7.4], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C22', start: [0, 5, 3.8], end: [0, 5, 7.4], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C23', start: [0, 10, 3.8], end: [0, 10, 7.4], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C24', start: [6, 0, 3.8], end: [6, 0, 7.4], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C25', start: [6, 5, 3.8], end: [6, 5, 7.4], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C26', start: [6, 10, 3.8], end: [6, 10, 7.4], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C27', start: [12, 0, 3.8], end: [12, 0, 7.4], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C28', start: [12, 5, 3.8], end: [12, 5, 7.4], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C29', start: [12, 10, 3.8], end: [12, 10, 7.4], section: 'I_350x12x400x20', rotation: 0 },

        // Second floor columns (Z: 7.4 to 11.0)
        { id: 'C31', start: [0, 0, 7.4], end: [0, 0, 11.0], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C32', start: [0, 5, 7.4], end: [0, 5, 11.0], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C33', start: [0, 10, 7.4], end: [0, 10, 11.0], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C34', start: [6, 0, 7.4], end: [6, 0, 11.0], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C35', start: [6, 5, 7.4], end: [6, 5, 11.0], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C36', start: [6, 10, 7.4], end: [6, 10, 11.0], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C37', start: [12, 0, 7.4], end: [12, 0, 11.0], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C38', start: [12, 5, 7.4], end: [12, 5, 11.0], section: 'I_350x12x400x20', rotation: 0 },
        { id: 'C39', start: [12, 10, 7.4], end: [12, 10, 11.0], section: 'I_350x12x400x20', rotation: 0 },
    ],

    // Beams (start point, end point, cross-section, local rotation angle in degrees)
    beams: [
        // Ground floor beams (Z: 3.8)
        // Along Y-direction
        { id: 'B11', start: [0, 0, 3.8], end: [0, 5, 3.8], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B12', start: [0, 5, 3.8], end: [0, 10, 3.8], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B13', start: [6, 0, 3.8], end: [6, 5, 3.8], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B14', start: [6, 5, 3.8], end: [6, 10, 3.8], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B15', start: [12, 0, 3.8], end: [12, 5, 3.8], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B16', start: [12, 5, 3.8], end: [12, 10, 3.8], section: 'I_350x10x330x15', rotation: 0 },
        // Along X-direction
        { id: 'B17', start: [0, 0, 3.8], end: [6, 0, 3.8], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B18', start: [6, 0, 3.8], end: [12, 0, 3.8], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B19', start: [0, 5, 3.8], end: [6, 5, 3.8], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B110', start: [6, 5, 3.8], end: [12, 5, 3.8], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B111', start: [0, 10, 3.8], end: [6, 10, 3.8], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B112', start: [6, 10, 3.8], end: [12, 10, 3.8], section: 'I_350x10x330x15', rotation: 90 },

        // First floor beams (Z: 7.4)
        // Along Y-direction
        { id: 'B21', start: [0, 0, 7.4], end: [0, 5, 7.4], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B22', start: [0, 5, 7.4], end: [0, 10, 7.4], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B23', start: [6, 0, 7.4], end: [6, 5, 7.4], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B24', start: [6, 5, 7.4], end: [6, 10, 7.4], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B25', start: [12, 0, 7.4], end: [12, 5, 7.4], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B26', start: [12, 5, 7.4], end: [12, 10, 7.4], section: 'I_350x10x330x15', rotation: 0 },
        // Along X-direction
        { id: 'B27', start: [0, 0, 7.4], end: [6, 0, 7.4], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B28', start: [6, 0, 7.4], end: [12, 0, 7.4], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B29', start: [0, 5, 7.4], end: [6, 5, 7.4], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B210', start: [6, 5, 7.4], end: [12, 5, 7.4], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B211', start: [0, 10, 7.4], end: [6, 10, 7.4], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B212', start: [6, 10, 7.4], end: [12, 10, 7.4], section: 'I_350x10x330x15', rotation: 90 },

        // Second floor beams (Z: 11.0)
        // Along Y-direction
        { id: 'B31', start: [0, 0, 11.0], end: [0, 5, 11.0], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B32', start: [0, 5, 11.0], end: [0, 10, 11.0], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B33', start: [6, 0, 11.0], end: [6, 5, 11.0], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B34', start: [6, 5, 11.0], end: [6, 10, 11.0], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B35', start: [12, 0, 11.0], end: [12, 5, 11.0], section: 'I_350x10x330x15', rotation: 0 },
        { id: 'B36', start: [12, 5, 11.0], end: [12, 10, 11.0], section: 'I_350x10x330x15', rotation: 0 },
        // Along X-direction
        { id: 'B37', start: [0, 0, 11.0], end: [6, 0, 11.0], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B38', start: [6, 0, 11.0], end: [12, 0, 11.0], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B39', start: [0, 5, 11.0], end: [6, 5, 11.0], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B310', start: [6, 5, 11.0], end: [12, 5, 11.0], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B311', start: [0, 10, 11.0], end: [6, 10, 11.0], section: 'I_350x10x330x15', rotation: 90 },
        { id: 'B312', start: [6, 10, 11.0], end: [12, 10, 11.0], section: 'I_350x10x330x15', rotation: 90 },
    ],

    // Braces (start point, end point, cross-section, local rotation angle in degrees)
    braces: [ 
        // Ground floor braces
        { id: 'BR11', start: [0, 0, 0.25], end: [6, 5, 3.8], section: 'CIRCULAR_100', rotation: 0 },
        { id: 'BR12', start: [6, 5, 0.25], end: [12, 10, 3.8], section: 'CIRCULAR_100', rotation: 0 },
        
        // First floor braces
        { id: 'BR21', start: [0, 0, 3.8], end: [6, 5, 7.4], section: 'CIRCULAR_100', rotation: 0 },
        { id: 'BR22', start: [6, 5, 3.8], end: [12, 10, 7.4], section: 'CIRCULAR_100', rotation: 0 },
        
        // Second floor braces
        { id: 'BR31', start: [0, 0, 7.4], end: [6, 5, 11.0], section: 'CIRCULAR_100', rotation: 0 },
        { id: 'BR32', start: [6, 5, 7.4], end: [12, 10, 11.0], section: 'CIRCULAR_100', rotation: 0 },
    ],

    // Slabs (defined by corner points)
    slabs: [
        // Ground floor slab
        { 
            id: 'SLAB1', 
            points: [
                [0, 0, 3.8],
                [12, 0, 3.8],
                [12, 10, 3.8],
                [0, 10, 3.8]
            ], 
            thickness: 0.2
        },
        // First floor slab
        { 
            id: 'SLAB2', 
            points: [
                [0, 0, 7.4],
                [12, 0, 7.4],
                [12, 10, 7.4],
                [0, 10, 7.4]
            ], 
            thickness: 0.2
        },
        // Second floor slab (roof)
        { 
            id: 'SLAB3', 
            points: [
                [0, 0, 11.0],
                [12, 0, 11.0],
                [12, 10, 11.0],
                [0, 10, 11.0]
            ], 
            thickness: 0.2
        }
    ],

    // Walls (defined by corner points, with thickness)
    walls: [
        // Front wall (Y=0)
        { 
            id: 'WALL1', 
            points: [
                [0, 0, 0.25],
                [12, 0, 0.25],
                [12, 0, 11.0],
                [0, 0, 11.0]
            ], 
            thickness: 0.15
        },
        // Back wall (Y=10)
        { 
            id: 'WALL2', 
            points: [
                [0, 10, 0.25],
                [12, 10, 0.25],
                [12, 10, 11.0],
                [0, 10, 11.0]
            ], 
            thickness: 0.15
        },
        // Left wall (X=0)
        { 
            id: 'WALL3', 
            points: [
                [0, 0, 0.25],
                [0, 10, 0.25],
                [0, 10, 11.0],
                [0, 0, 11.0]
            ], 
            thickness: 0.15
        },
        // Right wall (X=12)
        { 
            id: 'WALL4', 
            points: [
                [12, 0, 0.25],
                [12, 10, 0.25],
                [12, 10, 11.0],
                [12, 0, 11.0]
            ], 
            thickness: 0.15
        }
    ],

    // Supports (point location, type: 'fixed', 'pinned', 'roller')
    supports: [
        { id: 'SUP1', location: [0, 0, 0.25], type: 'pinned' },
        { id: 'SUP2', location: [0, 5, 0.25], type: 'fixed' },
        { id: 'SUP3', location: [0, 10, 0.25], type: 'pinned' },
        { id: 'SUP4', location: [6, 0, 0.25], type: 'roller' },
        { id: 'SUP5', location: [6, 5, 0.25], type: 'pinned' },
        { id: 'SUP6', location: [6, 10, 0.25], type: 'roller' },
        { id: 'SUP7', location: [12, 0, 0.25], type: 'pinned' },
        { id: 'SUP8', location: [12, 5, 0.25], type: 'fixed' },
        { id: 'SUP9', location: [12, 10, 0.25], type: 'pinned' },
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
    
    // Calculate dimensions (slab is horizontal in XY plane)
    const width = points[1].distanceTo(points[0]);  // X direction
    const depth = points[2].distanceTo(points[1]);  // Y direction
    
    // Calculate center
    const center = new THREE.Vector3();
    points.forEach(p => center.add(p));
    center.divideScalar(points.length);

    // BoxGeometry(width_X, height_Y, depth_Z)
    // For horizontal slab: X-width, Y-depth, Z-thickness
    const geometry = new THREE.BoxGeometry(width, depth, slabData.thickness);
    const material = new THREE.MeshPhongMaterial({
        color: ELEMENT_COLORS.SLAB,
        transparent: true,
        opacity: 0.5,
        shininess: 30
    });

    const slab = new THREE.Mesh(geometry, material);
    slab.position.copy(center);

    structure.add(slab);
}

function createWall(wallData) {
    const points = wallData.points.map(p => new THREE.Vector3(...p));
    
    // Calculate dimensions (wall is vertical)
    const horizontalDistance = points[1].distanceTo(points[0]);  // Horizontal span
    const height = Math.abs(points[2].z - points[0].z);  // Vertical height (Z direction)
    
    // Calculate center
    const center = new THREE.Vector3();
    points.forEach(p => center.add(p));
    center.divideScalar(points.length);

    // Determine orientation (which horizontal direction the wall runs)
    const isAlongX = Math.abs(points[1].x - points[0].x) > 0.01;
    
    // BoxGeometry(width_X, height_Y, depth_Z)
    // For vertical wall along X: X-length, Y-thickness, Z-height
    // For vertical wall along Y: X-thickness, Y-length, Z-height
    const geometry = isAlongX ? 
        new THREE.BoxGeometry(horizontalDistance, wallData.thickness, height) :
        new THREE.BoxGeometry(wallData.thickness, horizontalDistance, height);

    const material = new THREE.MeshPhongMaterial({
        color: ELEMENT_COLORS.WALL,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        shininess: 20
    });

    const wall = new THREE.Mesh(geometry, material);
    wall.position.copy(center);

    structure.add(wall);
}