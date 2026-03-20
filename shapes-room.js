// 3D Shapes Room - Floating shapes environment with rotational camera
(function() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    document.getElementById('shapes-room-container').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Colored point lights for atmosphere
    const lights = [
        { color: 0xFF0000, pos: [20, 10, 20] },
        { color: 0x0000FF, pos: [-20, -10, 20] },
        { color: 0xFFFF00, pos: [0, 20, -20] },
        { color: 0x4CBB17, pos: [-20, 10, -20] }
    ];

    lights.forEach(l => {
        const light = new THREE.PointLight(l.color, 0.8, 50);
        light.position.set(...l.pos);
        scene.add(light);
    });

    // Shape colors
    const colors = [0xFF0000, 0x0000FF, 0xFFFF00, 0x4CBB17];

    // Falling shapes array
    const shapes = [];
    const shapeCount = 60;

    // Create different shape geometries
    function createRandomGeometry() {
        const type = Math.floor(Math.random() * 6);
        const size = 0.5 + Math.random() * 1.5;
        
        switch(type) {
            case 0: return new THREE.BoxGeometry(size, size, size);
            case 1: return new THREE.TetrahedronGeometry(size);
            case 2: return new THREE.OctahedronGeometry(size);
            case 3: return new THREE.IcosahedronGeometry(size);
            case 4: return new THREE.DodecahedronGeometry(size);
            case 5: return new THREE.SphereGeometry(size * 0.6, 16, 16);
        }
    }

    // Create shapes
    for (let i = 0; i < shapeCount; i++) {
        const geometry = createRandomGeometry();
        const material = new THREE.MeshStandardMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            metalness: 0.3,
            roughness: 0.5,
            transparent: true,
            opacity: 0.9
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random starting position in a sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 15 + Math.random() * 40;
        
        mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
        mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
        mesh.position.z = radius * Math.cos(phi);
        
        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
        mesh.rotation.z = Math.random() * Math.PI * 2;
        
        mesh.userData = {
            fallSpeed: 0.02 + Math.random() * 0.05,
            rotSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            originalRadius: radius,
            theta: theta,
            phi: phi,
            orbitSpeed: (Math.random() - 0.5) * 0.002,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        shapes.push(mesh);
        scene.add(mesh);
    }

    // Create wireframe sphere boundary (subtle)
    const boundaryGeometry = new THREE.IcosahedronGeometry(50, 2);
    const boundaryMaterial = new THREE.MeshBasicMaterial({
        color: 0x222222,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    scene.add(boundary);

    // Starfield background
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 200;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.6
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Camera rotation state
    let cameraAngle = 0;
    let cameraVerticalAngle = 0;
    let targetCameraAngle = 0;
    let targetVerticalAngle = 0;
    let isUserInteracting = false;
    let mouseX = 0;
    let mouseY = 0;

    // Mouse interaction for camera control
    document.addEventListener('mousemove', (event) => {
        if (!isUserInteracting) {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 0.3;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 0.2;
        }
    });

    document.addEventListener('mousedown', () => isUserInteracting = true);
    document.addEventListener('mouseup', () => isUserInteracting = false);

    // Touch support
    document.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        mouseX = (touch.clientX / window.innerWidth - 0.5) * 0.3;
        mouseY = (touch.clientY / window.innerHeight - 0.5) * 0.2;
    });

    // Animation
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        // Auto-rotate camera with mouse influence
        cameraAngle += 0.002;
        targetCameraAngle = cameraAngle + mouseX;
        targetVerticalAngle = mouseY;

        // Smooth camera movement
        const cameraRadius = 30;
        camera.position.x = Math.sin(targetCameraAngle) * cameraRadius;
        camera.position.z = Math.cos(targetCameraAngle) * cameraRadius;
        camera.position.y = targetVerticalAngle * 20 + Math.sin(time * 0.3) * 3;
        camera.lookAt(0, 0, 0);

        // Animate shapes
        shapes.forEach((shape, i) => {
            // Orbital movement
            shape.userData.theta += shape.userData.orbitSpeed;
            
            const radius = shape.userData.originalRadius + Math.sin(time + shape.userData.floatOffset) * 3;
            
            shape.position.x = radius * Math.sin(shape.userData.phi) * Math.cos(shape.userData.theta);
            shape.position.y = radius * Math.sin(shape.userData.phi) * Math.sin(shape.userData.theta) + 
                              Math.sin(time * shape.userData.fallSpeed * 10 + shape.userData.floatOffset) * 2;
            shape.position.z = radius * Math.cos(shape.userData.phi);
            
            // Rotation
            shape.rotation.x += shape.userData.rotSpeed.x;
            shape.rotation.y += shape.userData.rotSpeed.y;
            shape.rotation.z += shape.userData.rotSpeed.z;
        });

        // Rotate boundary slowly
        boundary.rotation.x += 0.0003;
        boundary.rotation.y += 0.0005;

        // Rotate stars
        stars.rotation.y += 0.0001;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Entrance animation - Windows 98 style (instant pop)
    const buyButton = document.getElementById('buy-button-container');
    if (buyButton) {
        buyButton.style.opacity = '0';
        buyButton.style.transform = 'translate(-50%, -50%) scale(0.95)';
        
        setTimeout(() => {
            buyButton.style.transition = 'all 0.2s ease-out';
            buyButton.style.opacity = '1';
            buyButton.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);
    }

    // Back button entrance
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.style.opacity = '0';
        
        setTimeout(() => {
            backBtn.style.transition = 'opacity 0.3s ease-out';
            backBtn.style.opacity = '1';
        }, 200);
    }
})();
