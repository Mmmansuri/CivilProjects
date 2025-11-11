
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
