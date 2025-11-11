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
    braces: [],

    // Slabs (defined by corner points)
    slabs: [],

    // Walls (defined by corner points, with thickness)
    walls: [],

    // Supports (point location, type: 'fixed', 'pinned', 'roller')
    supports: [
        { id: 'SUP1', location: [0.000, 0.000, 0.250], type: 'pinned' },
        { id: 'SUP2', location: [0.000, 5.000, 0.250], type: 'fixed' },
        { id: 'SUP3', location: [6.000, 0.000, 0.250], type: 'roller' },
        { id: 'SUP4', location: [6.000, 5.000, 0.250], type: 'pinned' },
    ]
};
