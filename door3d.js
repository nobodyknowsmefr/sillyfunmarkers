// 3D Door Component using Three.js
(function() {
    const container = document.getElementById('door-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 3, 4);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xc5ecfa, 0.5);
    pointLight.position.set(-2, 2, 3);
    scene.add(pointLight);

    // Door group
    const doorGroup = new THREE.Group();
    scene.add(doorGroup);

    // Door frame
    const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.3,
        roughness: 0.7
    });

    // Frame pieces
    const frameThickness = 0.15;
    const doorWidth = 1.4;
    const doorHeight = 2.2;

    // Top frame
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(doorWidth + frameThickness * 2, frameThickness, 0.2),
        frameMaterial
    );
    topFrame.position.y = doorHeight / 2 + frameThickness / 2;
    doorGroup.add(topFrame);

    // Left frame
    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameThickness, doorHeight, 0.2),
        frameMaterial
    );
    leftFrame.position.x = -doorWidth / 2 - frameThickness / 2;
    doorGroup.add(leftFrame);

    // Right frame
    const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameThickness, doorHeight, 0.2),
        frameMaterial
    );
    rightFrame.position.x = doorWidth / 2 + frameThickness / 2;
    doorGroup.add(rightFrame);

    // Door panel with gradient-like effect
    const doorCanvas = document.createElement('canvas');
    doorCanvas.width = 256;
    doorCanvas.height = 512;
    const doorCtx = doorCanvas.getContext('2d');

    // Create gradient for door
    const gradient = doorCtx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#c5ecfa');
    gradient.addColorStop(0.5, '#8dd8f0');
    gradient.addColorStop(1, '#5bc0de');
    doorCtx.fillStyle = gradient;
    doorCtx.fillRect(0, 0, 256, 512);

    // Add panel details
    doorCtx.strokeStyle = '#4a9bb3';
    doorCtx.lineWidth = 4;
    
    // Upper panel
    doorCtx.strokeRect(30, 30, 196, 180);
    doorCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    doorCtx.fillRect(30, 30, 196, 180);
    
    // Lower panel
    doorCtx.strokeStyle = '#4a9bb3';
    doorCtx.strokeRect(30, 240, 196, 240);
    doorCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    doorCtx.fillRect(30, 240, 196, 240);

    const doorTexture = new THREE.CanvasTexture(doorCanvas);

    const doorMaterial = new THREE.MeshStandardMaterial({ 
        map: doorTexture,
        metalness: 0.1,
        roughness: 0.6
    });

    const doorPanel = new THREE.Mesh(
        new THREE.BoxGeometry(doorWidth, doorHeight, 0.1),
        doorMaterial
    );
    doorPanel.position.z = 0.05;
    doorGroup.add(doorPanel);

    // Door handle
    const handleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2
    });

    // Handle plate
    const handlePlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.25, 0.03),
        handleMaterial
    );
    handlePlate.position.set(0.5, 0, 0.12);
    doorGroup.add(handlePlate);

    // Handle knob
    const handleKnob = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        handleMaterial
    );
    handleKnob.position.set(0.5, 0, 0.18);
    doorGroup.add(handleKnob);

    // Glow effect around door
    const glowGeometry = new THREE.PlaneGeometry(doorWidth + 0.5, doorHeight + 0.5);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            void main() {
                float dist = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
                float glow = smoothstep(0.5, 0.35, dist);
                float pulse = 0.5 + 0.3 * sin(time * 2.0);
                vec3 color = vec3(0.77, 0.93, 0.98);
                gl_FragColor = vec4(color, glow * 0.3 * pulse);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.1;
    doorGroup.add(glow);

    // Floating shapes around the door
    const shapes = [];
    const shapeColors = [0xFF0000, 0x0000FF, 0xFFFF00, 0x4CBB17];

    function createFloatingShape() {
        const type = Math.floor(Math.random() * 4);
        let geometry;
        
        switch(type) {
            case 0: geometry = new THREE.TetrahedronGeometry(0.12); break;
            case 1: geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15); break;
            case 2: geometry = new THREE.SphereGeometry(0.08, 8, 8); break;
            case 3: geometry = new THREE.OctahedronGeometry(0.1); break;
        }
        
        const material = new THREE.MeshStandardMaterial({
            color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
            metalness: 0.3,
            roughness: 0.5
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.9 + Math.random() * 0.2;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.y = (Math.random() - 0.5) * 1.5;
        mesh.position.z = Math.sin(angle) * 0.3;
        
        mesh.userData = {
            angle: angle,
            radius: radius,
            speed: 0.2 + Math.random() * 0.3,
            yOffset: mesh.position.y,
            rotSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        
        return mesh;
    }

    // Create floating shapes
    for (let i = 0; i < 8; i++) {
        const shape = createFloatingShape();
        shapes.push(shape);
        scene.add(shape);
    }

    // Hover and click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHovered = false;
    let isZooming = false;

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(doorPanel);
        
        if (intersects.length > 0 && !isZooming) {
            isHovered = true;
            container.style.cursor = 'pointer';
        } else {
            isHovered = false;
            container.style.cursor = 'default';
        }
    });

    container.addEventListener('click', (event) => {
        if (isHovered && !isZooming) {
            triggerCrashZoom();
        }
    });

    // Crash zoom effect
    function triggerCrashZoom() {
        isZooming = true;
        
        // Create flash overlay
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            opacity: 0;
            z-index: 10000;
            pointer-events: none;
            transition: opacity 0.15s ease-out;
        `;
        document.body.appendChild(flash);

        // Create zoom container
        const zoomOverlay = document.createElement('div');
        zoomOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            opacity: 0;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(zoomOverlay);

        // Animate camera zoom
        let zoomProgress = 0;
        const zoomDuration = 800;
        const startZ = camera.position.z;
        const startTime = Date.now();

        function animateZoom() {
            const elapsed = Date.now() - startTime;
            zoomProgress = Math.min(1, elapsed / zoomDuration);
            
            // Easing function - ease in cubic
            const eased = zoomProgress * zoomProgress * zoomProgress;
            
            camera.position.z = startZ - eased * (startZ + 2);
            camera.fov = 50 + eased * 80;
            camera.updateProjectionMatrix();

            if (zoomProgress < 0.6) {
                requestAnimationFrame(animateZoom);
            } else {
                // Flash and transition
                flash.style.opacity = '1';
                zoomOverlay.style.opacity = '1';
                
                setTimeout(() => {
                    // Navigate to shapes room
                    window.location.href = 'shapes-room.html';
                }, 150);
            }
        }

        animateZoom();
    }

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        // Update glow
        glowMaterial.uniforms.time.value = time;

        // Animate floating shapes
        shapes.forEach(shape => {
            shape.userData.angle += shape.userData.speed * 0.01;
            shape.position.x = Math.cos(shape.userData.angle) * shape.userData.radius;
            shape.position.y = shape.userData.yOffset + Math.sin(time * shape.userData.speed) * 0.15;
            shape.position.z = Math.sin(shape.userData.angle) * 0.3;
            
            shape.rotation.x += shape.userData.rotSpeed.x;
            shape.rotation.y += shape.userData.rotSpeed.y;
            shape.rotation.z += shape.userData.rotSpeed.z;
        });

        // Hover effect
        if (isHovered && !isZooming) {
            doorGroup.rotation.y += (0.1 - doorGroup.rotation.y) * 0.1;
            doorGroup.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1);
        } else {
            doorGroup.rotation.y += (0 - doorGroup.rotation.y) * 0.1;
            doorGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }

        // Subtle floating animation
        doorGroup.position.y = Math.sin(time * 0.8) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
})();
