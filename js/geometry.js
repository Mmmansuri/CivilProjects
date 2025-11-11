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
