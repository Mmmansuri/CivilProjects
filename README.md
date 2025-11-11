# StructureView - 3D Structural Optimization Viewer

A professional 3D structural visualization tool built with Three.js for displaying and analyzing building structures in real-time. Perfect for structural engineers, architects, and construction professionals.

## 🚀 Live Demo

**[View Live Demo →](https://mmmansuri.github.io/CivilProjects/)**

## 🌟 Features

- **Interactive 3D Visualization** - Rotate, pan, and zoom to explore structures from any angle
- **Real-time Rendering** - Smooth 60 FPS rendering with optimized performance
- **Color-Coded Elements** - Visual indicators for different structural components
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Fullscreen Mode** - Immersive viewing experience
- **Dark/Light Canvas** - Toggle between canvas backgrounds for better visibility
- **Support Visualization** - Display fixed, pinned, and roller supports
- **Easy Customization** - Modify structures by editing a single data file

## 📂 Project Structure

```
structureview/
├── index.html              # Main HTML file
├── README.md               # Project documentation
├── css/
│   └── styles.css         # All styling
└── js/
    ├── structureData.js   # Structural data (EDIT THIS FILE)
    ├── scene.js          # Three.js scene setup
    ├── interactions.js   # Mouse/keyboard handlers
    └── main.js           # Main initialization & animation
```

## 🛠️ Installation

### Option 1: GitHub Pages (Recommended)

1. **Fork or Clone this repository**
   ```bash
   git clone https://github.com/mmmansuri/structureview.git
   cd structureview
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/` (root)
   - Save and wait 1-2 minutes

4. **Access your site**
   - URL: `https://mmmansuri.github.io/structureview`

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/mmmansuri/structureview.git
   cd structureview
   ```

2. **Serve locally** (choose one method)

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js:**
   ```bash
   npx serve
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   - Navigate to: `http://localhost:8000`

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see below:

```
MIT License

Copyright (c) 2025 StructureView

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [CDNjs](https://cdnjs.com/) - CDN hosting

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for Structural Engineers**
