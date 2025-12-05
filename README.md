# StructureView

A collection of five different methods for viewing 3D building structures in the browser. Each method demonstrates a different approach to loading and displaying 3D models, particularly useful for architects, engineers, and developers working with BIM (Building Information Modeling) data.

## Technologies Used

- Three.js for 3D rendering
- IFC.js for IFC file processing
- WebGL for hardware-accelerated graphics

## Live Demos

1. **JS to JS Method**  
   **[View Live Demo →](https://mmmansuri.github.io/StructureView/js2js/index.html)**  
   Pure JavaScript approach for loading and displaying 3D structures. All rendering logic, model loading, and scene setup are handled entirely through JavaScript modules without requiring external HTML templates, ideal for programmatic model generation.

2. **IFC to GLB Converter**  
   **[View Live Demo →](https://mmmansuri.github.io/StructureView/IFC2GLB/index.html)**  
   Upload and convert IFC (Industry Foundation Classes) building files to GLB format, then view them in an interactive 3D viewer with navigation controls. IFC files are industry-standard formats used in BIM software like Revit, ArchiCAD, and Tekla. This tool converts them to the more web-friendly GLB format.

3. **HTML to JS Method**  
   **[View Live Demo →](https://mmmansuri.github.io/StructureView/html2js/index.html)**  
   Demonstrates loading 3D models by embedding HTML content directly into JavaScript code. The HTML structure (viewer interface) is stored as a string within JS and injected at runtime, useful for creating single-file bundled viewers or distributing viewers without separate HTML files.

4. **Load HTML Method**  
   **[View Live Demo →](https://mmmansuri.github.io/StructureView/loadHtml/index.html)**  
   Dynamically fetches and loads HTML content at runtime using AJAX/fetch to display 3D structure visualizations. The viewer interface is loaded from external HTML files on-demand, allowing for modular architecture and easier maintenance of viewer components.

5. **Main Viewer**  
   **[View Live Demo →](https://mmmansuri.github.io/StructureView/index.html)**  
   Primary structure viewing interface with full 3D navigation and model inspection capabilities. Serves as the main entry point with controls for rotation, zoom, pan, and object selection.

## File Sources

Models can be loaded from:
- Local file uploads (IFC, GLB formats)
- Embedded/hardcoded models in the source code
- External URLs pointing to 3D model files
- Dynamically generated geometry through code