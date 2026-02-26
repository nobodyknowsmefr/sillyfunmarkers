// Three.js 3D Bucket Renderer - Large side-mounted buckets
(function() {
    const bucketContainer = document.getElementById('bucket-container');
    const bucketCanvas = document.getElementById('bucket-canvas');
    
    if (!bucketCanvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup - wider view for side buckets
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Renderer setup - full screen
    const renderer = new THREE.WebGLRenderer({ 
        canvas: bucketCanvas, 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Create large bucket geometry
    function createBucket(color, isLeft) {
        const bucketGroup = new THREE.Group();

        // Large bucket dimensions
        const radiusTop = 2.0;
        const radiusBottom = 1.5;
        const height = 3.5;
        const radialSegments = 32;

        // Outer bucket
        const bucketGeometry = new THREE.CylinderGeometry(
            radiusTop, radiusBottom, height, radialSegments, 1, true
        );
        const bucketMaterial = new THREE.MeshPhongMaterial({
            color: color,
            side: THREE.DoubleSide,
            shininess: 100,
            specular: 0x666666
        });
        const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
        bucketGroup.add(bucket);

        // Bucket bottom
        const bottomGeometry = new THREE.CircleGeometry(radiusBottom, radialSegments);
        const bottomMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 80
        });
        const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
        bottom.rotation.x = -Math.PI / 2;
        bottom.position.y = -height / 2;
        bucketGroup.add(bottom);

        // Thick bucket rim
        const rimGeometry = new THREE.TorusGeometry(radiusTop, 0.15, 16, 32);
        const rimMaterial = new THREE.MeshPhongMaterial({
            color: 0x222222,
            shininess: 100
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = height / 2;
        bucketGroup.add(rim);

        // Metal band around middle
        const bandGeometry = new THREE.TorusGeometry(radiusTop * 0.85, 0.08, 8, 32);
        const bandMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            shininess: 120
        });
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.rotation.x = Math.PI / 2;
        band.position.y = 0;
        bucketGroup.add(band);

        // Hook at top for hanging effect
        const hookCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, height / 2 + 0.2, 0),
            new THREE.Vector3(isLeft ? 1.5 : -1.5, height / 2 + 1.2, 0),
            new THREE.Vector3(isLeft ? 2.5 : -2.5, height / 2 + 2, 0)
        );
        const hookGeometry = new THREE.TubeGeometry(hookCurve, 20, 0.1, 8, false);
        const hookMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            shininess: 100
        });
        const hook = new THREE.Mesh(hookGeometry, hookMaterial);
        bucketGroup.add(hook);

        // Inner dark gradient
        const innerGeometry = new THREE.CylinderGeometry(
            radiusTop - 0.1, radiusBottom - 0.1, height - 0.2, radialSegments, 1, true
        );
        const innerMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(color).multiplyScalar(0.4),
            side: THREE.BackSide
        });
        const inner = new THREE.Mesh(innerGeometry, innerMaterial);
        bucketGroup.add(inner);

        return bucketGroup;
    }

    // Calculate positions based on screen aspect
    function getPositions() {
        const aspect = window.innerWidth / window.innerHeight;
        const xOffset = aspect * 5.5;
        return { left: -xOffset, right: xOffset };
    }

    const positions = getPositions();

    // Create yellow bucket (left side)
    const yellowBucket = createBucket(0xFFFF00, true);
    yellowBucket.position.set(positions.left, -1, 0);
    yellowBucket.rotation.z = 0.2; // Slight tilt hanging from left
    scene.add(yellowBucket);

    // Create blue bucket (right side)
    const blueBucket = createBucket(0x0066FF, false);
    blueBucket.position.set(positions.right, -1, 0);
    blueBucket.rotation.z = -0.2; // Slight tilt hanging from right
    scene.add(blueBucket);

    // Store bucket screen positions for hit detection
    function updateBucketPositions() {
        const bucketScreenWidth = 200;
        const bucketScreenHeight = 300;
        
        window.bucketPositions = {
            yellow: { 
                left: 0,
                right: bucketScreenWidth,
                top: window.innerHeight * 0.3,
                bottom: window.innerHeight * 0.3 + bucketScreenHeight
            },
            blue: { 
                left: window.innerWidth - bucketScreenWidth,
                right: window.innerWidth,
                top: window.innerHeight * 0.3,
                bottom: window.innerHeight * 0.3 + bucketScreenHeight
            }
        };
    }
    updateBucketPositions();

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.015;
        
        // Gentle swaying animation like hanging buckets
        yellowBucket.rotation.z = 0.2 + Math.sin(time) * 0.03;
        yellowBucket.position.y = -1 + Math.sin(time * 0.8) * 0.1;
        
        blueBucket.rotation.z = -0.2 + Math.sin(time + 0.5) * 0.03;
        blueBucket.position.y = -1 + Math.sin(time * 0.8 + 0.5) * 0.1;
        
        renderer.render(scene, camera);
    }

    // Handle resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        // Reposition buckets based on new aspect
        const newPositions = getPositions();
        yellowBucket.position.x = newPositions.left;
        blueBucket.position.x = newPositions.right;
        
        updateBucketPositions();
    });

    // Start animation
    animate();

    // Expose highlight functions for game feedback
    window.highlightYellowBucket = function() {
        yellowBucket.children[0].material.emissive.setHex(0x666600);
        yellowBucket.scale.set(1.1, 1.1, 1.1);
        setTimeout(() => {
            yellowBucket.children[0].material.emissive.setHex(0x000000);
            yellowBucket.scale.set(1, 1, 1);
        }, 300);
    };

    window.highlightBlueBucket = function() {
        blueBucket.children[0].material.emissive.setHex(0x000066);
        blueBucket.scale.set(1.1, 1.1, 1.1);
        setTimeout(() => {
            blueBucket.children[0].material.emissive.setHex(0x000000);
            blueBucket.scale.set(1, 1, 1);
        }, 300);
    };

    // Set bucket glow state for hover feedback
    window.setBucketGlow = function(bucket, glowing) {
        if (bucket === 'yellow') {
            if (glowing) {
                yellowBucket.children[0].material.emissive.setHex(0x444400);
                yellowBucket.scale.set(1.08, 1.08, 1.08);
            } else {
                yellowBucket.children[0].material.emissive.setHex(0x000000);
                yellowBucket.scale.set(1, 1, 1);
            }
        } else if (bucket === 'blue') {
            if (glowing) {
                blueBucket.children[0].material.emissive.setHex(0x000044);
                blueBucket.scale.set(1.08, 1.08, 1.08);
            } else {
                blueBucket.children[0].material.emissive.setHex(0x000000);
                blueBucket.scale.set(1, 1, 1);
            }
        }
    };
})();
