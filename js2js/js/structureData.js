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

// Building configuration
const BUILDING_CONFIG = {
    baysX: 6,           // 6 bays in X direction
    baysY: 3,           // 3 bays in Y direction
    stories: 5,         // 5 stories
    bayWidthX: 6,       // 6m bay width in X
    bayWidthY: 5,       // 5m bay width in Y
    storyHeight: 3.55,  // 3.55m story height
    foundationHeight: 0.25
};

// Generate grid coordinates
function generateGridCoordinates() {
    const coords = {
        x: [],
        y: [],
        z: []
    };
    
    // X coordinates (7 lines for 6 bays)
    for (let i = 0; i <= BUILDING_CONFIG.baysX; i++) {
        coords.x.push(i * BUILDING_CONFIG.bayWidthX);
    }
    
    // Y coordinates (4 lines for 3 bays)
    for (let i = 0; i <= BUILDING_CONFIG.baysY; i++) {
        coords.y.push(i * BUILDING_CONFIG.bayWidthY);
    }
    
    // Z coordinates (foundation + 5 floor levels)
    coords.z.push(BUILDING_CONFIG.foundationHeight); // Foundation
    for (let i = 1; i <= BUILDING_CONFIG.stories; i++) {
        coords.z.push(BUILDING_CONFIG.foundationHeight + i * BUILDING_CONFIG.storyHeight);
    }
    
    return coords;
}

const gridCoords = generateGridCoordinates();

// Generate structural data programmatically
function generateStructuralData() {
    const data = {
        columns: [],
        beams: [],
        braces: [],
        slabs: [],
        walls: [],
        supports: []
    };
    
    // Generate columns
    let columnId = 1;
    for (let story = 0; story < BUILDING_CONFIG.stories; story++) {
        for (let i = 0; i <= BUILDING_CONFIG.baysX; i++) {
            for (let j = 0; j <= BUILDING_CONFIG.baysY; j++) {
                data.columns.push({
                    id: `C${columnId}`,
                    start: [gridCoords.x[i], gridCoords.y[j], gridCoords.z[story]],
                    end: [gridCoords.x[i], gridCoords.y[j], gridCoords.z[story + 1]],
                    section: 'I_350x12x400x20',
                    rotation: 0
                });
                columnId++;
            }
        }
    }
    
    // Generate beams
    let beamId = 1;
    for (let story = 1; story <= BUILDING_CONFIG.stories; story++) {
        const z = gridCoords.z[story];
        
        // Beams along Y direction (parallel to Y-axis)
        for (let i = 0; i <= BUILDING_CONFIG.baysX; i++) {
            for (let j = 0; j < BUILDING_CONFIG.baysY; j++) {
                data.beams.push({
                    id: `B${beamId}`,
                    start: [gridCoords.x[i], gridCoords.y[j], z],
                    end: [gridCoords.x[i], gridCoords.y[j + 1], z],
                    section: 'I_350x10x330x15',
                    rotation: 0
                });
                beamId++;
            }
        }
        
        // Beams along X direction (parallel to X-axis)
        for (let j = 0; j <= BUILDING_CONFIG.baysY; j++) {
            for (let i = 0; i < BUILDING_CONFIG.baysX; i++) {
                data.beams.push({
                    id: `B${beamId}`,
                    start: [gridCoords.x[i], gridCoords.y[j], z],
                    end: [gridCoords.x[i + 1], gridCoords.y[j], z],
                    section: 'I_350x10x330x15',
                    rotation: 90
                });
                beamId++;
            }
        }
    }
    
    // Generate braces (diagonal bracing in selected bays)
    let braceId = 1;
    for (let story = 0; story < BUILDING_CONFIG.stories; story++) {
        // Add braces in first and last bays
        // Front-left bay
        data.braces.push({
            id: `BR${braceId}`,
            start: [gridCoords.x[0], gridCoords.y[0], gridCoords.z[story]],
            end: [gridCoords.x[1], gridCoords.y[1], gridCoords.z[story + 1]],
            section: 'CIRCULAR_100',
            rotation: 0
        });
        braceId++;
        
        // Front-right bay
        data.braces.push({
            id: `BR${braceId}`,
            start: [gridCoords.x[BUILDING_CONFIG.baysX - 1], gridCoords.y[0], gridCoords.z[story]],
            end: [gridCoords.x[BUILDING_CONFIG.baysX], gridCoords.y[1], gridCoords.z[story + 1]],
            section: 'CIRCULAR_100',
            rotation: 0
        });
        braceId++;
    }
    
    // Generate slabs
    for (let story = 1; story <= BUILDING_CONFIG.stories; story++) {
        const z = gridCoords.z[story];
        data.slabs.push({
            id: `SLAB${story}`,
            points: [
                [gridCoords.x[0], gridCoords.y[0], z],
                [gridCoords.x[BUILDING_CONFIG.baysX], gridCoords.y[0], z],
                [gridCoords.x[BUILDING_CONFIG.baysX], gridCoords.y[BUILDING_CONFIG.baysY], z],
                [gridCoords.x[0], gridCoords.y[BUILDING_CONFIG.baysY], z]
            ],
            thickness: 0.2
        });
    }
    
    // Generate walls
    const maxX = gridCoords.x[BUILDING_CONFIG.baysX];
    const maxY = gridCoords.y[BUILDING_CONFIG.baysY];
    const maxZ = gridCoords.z[BUILDING_CONFIG.stories];
    const minZ = gridCoords.z[0];
    
    // Front wall (Y=0)
    data.walls.push({
        id: 'WALL1',
        points: [
            [0, 0, minZ],
            [maxX, 0, minZ],
            [maxX, 0, maxZ],
            [0, 0, maxZ]
        ],
        thickness: 0.15
    });
    
    // Back wall (Y=max)
    data.walls.push({
        id: 'WALL2',
        points: [
            [0, maxY, minZ],
            [maxX, maxY, minZ],
            [maxX, maxY, maxZ],
            [0, maxY, maxZ]
        ],
        thickness: 0.15
    });
    
    // Left wall (X=0)
    data.walls.push({
        id: 'WALL3',
        points: [
            [0, 0, minZ],
            [0, maxY, minZ],
            [0, maxY, maxZ],
            [0, 0, maxZ]
        ],
        thickness: 0.15
    });
    
    // Right wall (X=max)
    data.walls.push({
        id: 'WALL4',
        points: [
            [maxX, 0, minZ],
            [maxX, maxY, minZ],
            [maxX, maxY, maxZ],
            [maxX, 0, maxZ]
        ],
        thickness: 0.15
    });
    
    // Generate supports (at foundation level)
    let supportId = 1;
    const supportTypes = ['pinned', 'fixed', 'roller'];
    for (let i = 0; i <= BUILDING_CONFIG.baysX; i++) {
        for (let j = 0; j <= BUILDING_CONFIG.baysY; j++) {
            // Alternate support types for variety
            const typeIndex = (i + j) % 3;
            data.supports.push({
                id: `SUP${supportId}`,
                location: [gridCoords.x[i], gridCoords.y[j], gridCoords.z[0]],
                type: supportTypes[typeIndex]
            });
            supportId++;
        }
    }
    
    return data;
}

const structuralData = generateStructuralData();

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
    const gridSize = Math.max(buildingBounds.size.x, buildingBounds.size.y) * 1.5;
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

    // Align column with direction vector
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

    // Apply local rotation around the longitudinal axis
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

    // Apply local rotation around the longitudinal axis
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
        opacity: 0.6,
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
        opacity: 0.4,
        side: THREE.DoubleSide,
        shininess: 20
    });

    const wall = new THREE.Mesh(geometry, material);
    wall.position.copy(center);

    structure.add(wall);
}