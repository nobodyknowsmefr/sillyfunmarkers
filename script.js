// Matter.js module aliases
const { Engine, Render, Runner, Bodies, Body, Composite, Events, Mouse, MouseConstraint } = Matter;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Reduce gravity for slower falling effect
engine.world.gravity.y = 0.3;

// Get canvas and set dimensions
const canvas = document.getElementById('shapes-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Primary colors palette (Red, Blue, Yellow, Green)
const colors = [
    { main: '#FF0000', shadow: '#CC0000', highlight: '#FF4444' },
    { main: '#0000FF', shadow: '#0000CC', highlight: '#4444FF' },
    { main: '#FFFF00', shadow: '#CCCC00', highlight: '#FFFF66' },
    { main: '#4CBB17', shadow: '#3A9213', highlight: '#6CD33A' }
];

// Store shapes with their visual properties
const shapes = [];

// Shape types
const shapeTypes = ['cube', 'pyramid', 'sphere', 'cylinder', 'diamond'];

// Create ground and walls
const ground = Bodies.rectangle(width / 2, height + 30, width + 100, 60, { 
    isStatic: true,
    friction: 0.9,
    restitution: 0.1
});

const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true });
const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true });

// Door collision body - positioned at bottom center
// Responsive dimensions based on screen size
function getDoorDimensions() {
    if (window.innerWidth <= 480) {
        // Mobile: door is 110x154px visually
        return { width: 70, height: 120, yOffset: 25 };
    } else if (window.innerWidth <= 768) {
        // Tablet: door is 140x196px visually
        return { width: 90, height: 160, yOffset: 15 };
    } else {
        // Desktop: door is 180x252px visually
        return { width: 100, height: 200, yOffset: 10 };
    }
}

let doorDims = getDoorDimensions();
let doorWidth = doorDims.width;
let doorHeight = doorDims.height;
const doorX = width / 2;
const doorY = height - 30 - (doorHeight / 2) + doorDims.yOffset;
const doorBody = Bodies.rectangle(doorX, doorY, doorWidth, doorHeight, { 
    isStatic: true,
    friction: 0.5,
    restitution: 0.3,
    label: 'door'
});

Composite.add(world, [ground, leftWall, rightWall, doorBody]);

// Create runner
const runner = Runner.create();
Runner.run(runner, engine);

// Add mouse interaction for click and drag
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: { visible: false }
    }
});
Composite.add(world, mouseConstraint);

// ==================== SOUND EFFECTS ====================

// Audio context for generating sounds
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Goofy pop sound when picking up shapes
function playPickupSound() {
    initAudio();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(300, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    osc.type = 'sine';
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.15);
}

// Goofy success sound when sorting into bucket
function playBucketSound() {
    initAudio();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    // Ascending happy tone
    osc.frequency.setValueAtTime(400, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    osc.type = 'square';
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.3);
}

// ==================== MINI GAME LOGIC ====================

// Game state
const gameState = {
    active: false,
    prompted: false,
    won: false,
    timeRemaining: 30,
    sortedCount: 0,
    targetCount: 5,
    timerInterval: null,
    sortedShapes: new Set()
};

// DOM elements for game
const gameUI = document.getElementById('game-ui');
const gamePrompt = document.getElementById('game-prompt');
const discountPopup = document.getElementById('discount-popup');
const bucketContainer = document.getElementById('bucket-container');
const timerDisplay = document.getElementById('timer');
const sortedCountDisplay = document.getElementById('sorted-count');
const startGameBtn = document.getElementById('start-game-btn');
const closePopupBtn = document.getElementById('close-popup-btn');

// Get bucket bounds for collision detection (generous drop zones above buckets)
function getBucketBounds() {
    // Large drop zones that extend above the visual bucket opening
    const bucketWidth = 250;
    const dropZoneHeight = 400;
    const topOffset = height * 0.2; // Start higher up for easier drops
    
    return {
        yellow: {
            left: 0,
            right: bucketWidth,
            top: topOffset,
            bottom: topOffset + dropZoneHeight
        },
        blue: {
            left: width - bucketWidth,
            right: width,
            top: topOffset,
            bottom: topOffset + dropZoneHeight
        }
    };
}

// Check if a shape is in a bucket
function isShapeInBucket(shapePos, bucketBounds) {
    return shapePos.x >= bucketBounds.left && 
           shapePos.x <= bucketBounds.right && 
           shapePos.y >= bucketBounds.top && 
           shapePos.y <= bucketBounds.bottom;
}

// Start game immediately when user picks up a shape
function triggerGameStart() {
    if (!gameState.active && !gameState.won) {
        startGame();
    }
}

// Start the game
function startGame() {
    gameState.active = true;
    gameState.timeRemaining = 30;
    gameState.sortedCount = 0;
    gameState.sortedShapes.clear();
    
    // Update displays
    timerDisplay.textContent = gameState.timeRemaining;
    sortedCountDisplay.textContent = gameState.sortedCount;
    
    // Show game UI and buckets
    gameUI.classList.remove('hidden');
    bucketContainer.classList.remove('hidden');
    
    // Start timer
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        timerDisplay.textContent = gameState.timeRemaining;
        
        // Timer color change when low
        if (gameState.timeRemaining <= 10) {
            timerDisplay.style.animation = 'pulse 0.5s infinite';
        }
        
        if (gameState.timeRemaining <= 0) {
            endGame(false);
        }
    }, 1000);
}

// End the game
function endGame(won) {
    gameState.active = false;
    clearInterval(gameState.timerInterval);
    
    // Hide game UI and buckets
    gameUI.classList.add('hidden');
    bucketContainer.classList.add('hidden');
    
    // Reset timer style
    timerDisplay.style.animation = 'none';
    
    if (won) {
        // Mark as won so game can't be triggered again
        gameState.won = true;
        // Show discount popup
        discountPopup.classList.remove('hidden');
    } else {
        // Allow retry
        gameState.prompted = false;
    }
}

// Remove shape from world and array with animation into bucket
function removeShape(shape, bucketSide) {
    // Animate shape falling into bucket
    const targetX = bucketSide === 'yellow' ? 100 : width - 100;
    const targetY = height * 0.5;
    
    // Disable physics on this body
    Body.setStatic(shape.body, true);
    
    // Animate position
    const startX = shape.body.position.x;
    const startY = shape.body.position.y;
    let progress = 0;
    
    function animateInto() {
        progress += 0.1;
        if (progress >= 1) {
            // Remove from world
            Composite.remove(world, shape.body);
            const index = shapes.indexOf(shape);
            if (index > -1) {
                shapes.splice(index, 1);
            }
            return;
        }
        
        // Ease into bucket with slight curve
        const eased = 1 - Math.pow(1 - progress, 3);
        const newX = startX + (targetX - startX) * eased;
        const newY = startY + (targetY - startY) * eased + Math.sin(progress * Math.PI) * -30;
        
        Body.setPosition(shape.body, { x: newX, y: newY });
        Body.setAngle(shape.body, shape.body.angle + 0.2);
        
        // Scale down as it falls in
        shape.size = shape.size * 0.95;
        
        requestAnimationFrame(animateInto);
    }
    
    animateInto();
}

// Check if shape matches bucket criteria
function checkShapePlacement(shape) {
    if (!gameState.active || gameState.sortedShapes.has(shape.body.id)) return;
    
    const pos = shape.body.position;
    const buckets = getBucketBounds();
    
    // Check yellow bucket (Yellow shapes)
    if (isShapeInBucket(pos, buckets.yellow)) {
        if (shape.color.main === '#FFFF00') {
            // Correct! Yellow shape in yellow bucket
            gameState.sortedShapes.add(shape.body.id);
            gameState.sortedCount++;
            sortedCountDisplay.textContent = gameState.sortedCount;
            
            // Play bucket sound
            playBucketSound();
            
            // Animate shape into bucket
            removeShape(shape, 'yellow');
            
            // Highlight bucket via Three.js
            if (window.highlightYellowBucket) {
                window.highlightYellowBucket();
            }
            
            if (gameState.sortedCount >= gameState.targetCount) {
                setTimeout(() => endGame(true), 500);
            }
            return;
        }
    }
    
    // Check blue bucket (Cubes)
    if (isShapeInBucket(pos, buckets.blue)) {
        if (shape.type === 'cube') {
            // Correct! Cube in blue bucket
            gameState.sortedShapes.add(shape.body.id);
            gameState.sortedCount++;
            sortedCountDisplay.textContent = gameState.sortedCount;
            
            // Play bucket sound
            playBucketSound();
            
            // Animate shape into bucket
            removeShape(shape, 'blue');
            
            // Highlight bucket via Three.js
            if (window.highlightBlueBucket) {
                window.highlightBlueBucket();
            }
            
            if (gameState.sortedCount >= gameState.targetCount) {
                setTimeout(() => endGame(true), 500);
            }
            return;
        }
    }
}

// Track currently dragged shape for hover feedback
let draggedShape = null;

// Listen for mouse drag start to trigger game
Events.on(mouseConstraint, 'startdrag', function(event) {
    triggerGameStart();
    
    // Play pickup sound
    playPickupSound();
    
    // Find the dragged shape
    const draggedBody = event.body;
    draggedShape = shapes.find(s => s.body.id === draggedBody.id);
});

// Check bucket hover during drag for visual feedback
Events.on(engine, 'afterUpdate', function() {
    if (!gameState.active || !draggedShape) return;
    
    const pos = draggedShape.body.position;
    const buckets = getBucketBounds();
    
    // Check if near yellow bucket with valid shape
    const nearYellow = isShapeInBucket(pos, buckets.yellow) && draggedShape.color.main === '#FFFF00';
    // Check if near blue bucket with valid shape
    const nearBlue = isShapeInBucket(pos, buckets.blue) && draggedShape.type === 'cube';
    
    // Update bucket glow states
    if (window.setBucketGlow) {
        window.setBucketGlow('yellow', nearYellow);
        window.setBucketGlow('blue', nearBlue);
    }
});

// Listen for mouse drag end to check shape placement
Events.on(mouseConstraint, 'enddrag', function(event) {
    // Clear bucket glow
    if (window.setBucketGlow) {
        window.setBucketGlow('yellow', false);
        window.setBucketGlow('blue', false);
    }
    
    if (!gameState.active) {
        draggedShape = null;
        return;
    }
    
    // Find the shape that was dropped
    const droppedBody = event.body;
    const shape = shapes.find(s => s.body.id === droppedBody.id);
    
    if (shape) {
        checkShapePlacement(shape);
    }
    
    draggedShape = null;
});

// Button event listeners
if (startGameBtn) {
    startGameBtn.addEventListener('click', startGame);
}

if (closePopupBtn) {
    closePopupBtn.addEventListener('click', function() {
        discountPopup.classList.add('hidden');
    });
}

// ==================== END MINI GAME LOGIC ====================

// Function to create a random shape
function createShape() {
    const size = Math.random() * 40 + 30; // Size between 30-70
    const x = Math.random() * (width - 100) + 50;
    const y = -100;
    const colorScheme = colors[Math.floor(Math.random() * colors.length)];
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    
    let body;
    const options = {
        friction: 0.8,
        restitution: 0.2,
        frictionAir: 0.02,
        angle: Math.random() * Math.PI * 2
    };

    switch(type) {
        case 'cube':
            body = Bodies.rectangle(x, y, size, size, options);
            break;
        case 'pyramid':
            body = Bodies.polygon(x, y, 3, size * 0.7, options);
            break;
        case 'sphere':
            body = Bodies.circle(x, y, size / 2, options);
            break;
        case 'cylinder':
            body = Bodies.rectangle(x, y, size * 0.6, size, options);
            break;
        case 'diamond':
            body = Bodies.polygon(x, y, 4, size * 0.6, options);
            break;
    }

    // Add random angular velocity for tumbling effect
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

    Composite.add(world, body);
    
    shapes.push({
        body: body,
        type: type,
        size: size,
        color: colorScheme,
        rotation3D: {
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI * 2
        },
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        }
    });
}

// Draw halftone pattern
function drawHalftone(ctx, x, y, width, height, intensity) {
    const dotSize = 3;
    const spacing = 6;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    
    for (let dx = 0; dx < width; dx += spacing) {
        for (let dy = 0; dy < height; dy += spacing) {
            const noise = Math.random() * 0.5 + 0.5;
            const radius = dotSize * intensity * noise;
            ctx.beginPath();
            ctx.arc(x + dx - width/2, y + dy - height/2, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Draw 3D cube with halftone
function drawCube(ctx, x, y, size, angle, color, rotation3D) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const depth = size * 0.3;
    const offsetX = Math.cos(rotation3D.y) * depth;
    const offsetY = Math.sin(rotation3D.x) * depth;
    
    // Back face
    ctx.fillStyle = color.shadow;
    ctx.beginPath();
    ctx.moveTo(-size/2 + offsetX, -size/2 + offsetY);
    ctx.lineTo(size/2 + offsetX, -size/2 + offsetY);
    ctx.lineTo(size/2 + offsetX, size/2 + offsetY);
    ctx.lineTo(-size/2 + offsetX, size/2 + offsetY);
    ctx.closePath();
    ctx.fill();
    
    // Top face
    ctx.fillStyle = color.highlight;
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/2);
    ctx.lineTo(size/2, -size/2);
    ctx.lineTo(size/2 + offsetX, -size/2 + offsetY);
    ctx.lineTo(-size/2 + offsetX, -size/2 + offsetY);
    ctx.closePath();
    ctx.fill();
    
    // Side face
    ctx.fillStyle = color.main;
    ctx.beginPath();
    ctx.moveTo(size/2, -size/2);
    ctx.lineTo(size/2, size/2);
    ctx.lineTo(size/2 + offsetX, size/2 + offsetY);
    ctx.lineTo(size/2 + offsetX, -size/2 + offsetY);
    ctx.closePath();
    ctx.fill();
    
    // Front face
    ctx.fillStyle = color.main;
    ctx.fillRect(-size/2, -size/2, size, size);
    
    // Halftone overlay
    drawHalftone(ctx, 0, 0, size, size, 0.3);
    
    // Outline
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-size/2, -size/2, size, size);
    
    ctx.restore();
}

// Draw 3D pyramid with halftone
function drawPyramid(ctx, x, y, size, angle, color, rotation3D) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const h = size * 0.9;
    const offsetX = Math.cos(rotation3D.y) * 10;
    
    // Left face
    ctx.fillStyle = color.shadow;
    ctx.beginPath();
    ctx.moveTo(0, -h/2);
    ctx.lineTo(-size/2, h/2);
    ctx.lineTo(0 + offsetX, h/3);
    ctx.closePath();
    ctx.fill();
    
    // Right face
    ctx.fillStyle = color.main;
    ctx.beginPath();
    ctx.moveTo(0, -h/2);
    ctx.lineTo(size/2, h/2);
    ctx.lineTo(0 + offsetX, h/3);
    ctx.closePath();
    ctx.fill();
    
    // Front face
    ctx.fillStyle = color.highlight;
    ctx.beginPath();
    ctx.moveTo(0, -h/2);
    ctx.lineTo(-size/2, h/2);
    ctx.lineTo(size/2, h/2);
    ctx.closePath();
    ctx.fill();
    
    // Halftone
    drawHalftone(ctx, 0, 0, size, h, 0.25);
    
    // Outline
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -h/2);
    ctx.lineTo(-size/2, h/2);
    ctx.lineTo(size/2, h/2);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
}

// Draw 3D sphere with halftone
function drawSphere(ctx, x, y, size, color, rotation3D) {
    ctx.save();
    ctx.translate(x, y);
    
    const radius = size / 2;
    
    // Main sphere gradient
    const gradient = ctx.createRadialGradient(
        -radius * 0.3, -radius * 0.3, 0,
        0, 0, radius
    );
    gradient.addColorStop(0, color.highlight);
    gradient.addColorStop(0.5, color.main);
    gradient.addColorStop(1, color.shadow);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Halftone dots pattern
    const dotSpacing = 5;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
        for (let r = dotSpacing; r < radius; r += dotSpacing) {
            const dx = Math.cos(angle + rotation3D.z) * r;
            const dy = Math.sin(angle + rotation3D.z) * r;
            const distFromCenter = Math.sqrt(dx*dx + dy*dy) / radius;
            const dotRadius = 1.5 * (1 - distFromCenter * 0.5);
            ctx.beginPath();
            ctx.arc(dx, dy, dotRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Draw 3D cylinder with halftone
function drawCylinder(ctx, x, y, width, height, angle, color, rotation3D) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const ellipseHeight = width * 0.3;
    
    // Body
    ctx.fillStyle = color.main;
    ctx.fillRect(-width/2, -height/2 + ellipseHeight/2, width, height - ellipseHeight);
    
    // Bottom ellipse
    ctx.fillStyle = color.shadow;
    ctx.beginPath();
    ctx.ellipse(0, height/2 - ellipseHeight/2, width/2, ellipseHeight/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Side gradient
    const gradient = ctx.createLinearGradient(-width/2, 0, width/2, 0);
    gradient.addColorStop(0, color.shadow);
    gradient.addColorStop(0.5, color.main);
    gradient.addColorStop(1, color.shadow);
    ctx.fillStyle = gradient;
    ctx.fillRect(-width/2, -height/2 + ellipseHeight/2, width, height - ellipseHeight);
    
    // Top ellipse
    ctx.fillStyle = color.highlight;
    ctx.beginPath();
    ctx.ellipse(0, -height/2 + ellipseHeight/2, width/2, ellipseHeight/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Halftone
    drawHalftone(ctx, 0, 0, width, height, 0.2);
    
    ctx.restore();
}

// Draw 3D diamond with halftone
function drawDiamond(ctx, x, y, size, angle, color, rotation3D) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 4);
    
    const depth = size * 0.2;
    const offsetX = Math.cos(rotation3D.y) * depth;
    const offsetY = Math.sin(rotation3D.x) * depth;
    
    // Back faces
    ctx.fillStyle = color.shadow;
    ctx.beginPath();
    ctx.moveTo(0 + offsetX, -size/2 + offsetY);
    ctx.lineTo(size/2 + offsetX, 0 + offsetY);
    ctx.lineTo(0 + offsetX, size/2 + offsetY);
    ctx.lineTo(-size/2 + offsetX, 0 + offsetY);
    ctx.closePath();
    ctx.fill();
    
    // Top left face
    ctx.fillStyle = color.highlight;
    ctx.beginPath();
    ctx.moveTo(0, -size/2);
    ctx.lineTo(0 + offsetX, -size/2 + offsetY);
    ctx.lineTo(-size/2 + offsetX, 0 + offsetY);
    ctx.lineTo(-size/2, 0);
    ctx.closePath();
    ctx.fill();
    
    // Top right face
    ctx.fillStyle = color.main;
    ctx.beginPath();
    ctx.moveTo(0, -size/2);
    ctx.lineTo(0 + offsetX, -size/2 + offsetY);
    ctx.lineTo(size/2 + offsetX, 0 + offsetY);
    ctx.lineTo(size/2, 0);
    ctx.closePath();
    ctx.fill();
    
    // Front face
    ctx.fillStyle = color.main;
    ctx.beginPath();
    ctx.moveTo(0, -size/2);
    ctx.lineTo(size/2, 0);
    ctx.lineTo(0, size/2);
    ctx.lineTo(-size/2, 0);
    ctx.closePath();
    ctx.fill();
    
    // Halftone
    drawHalftone(ctx, 0, 0, size, size, 0.25);
    
    // Outline
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size/2);
    ctx.lineTo(size/2, 0);
    ctx.lineTo(0, size/2);
    ctx.lineTo(-size/2, 0);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
}

// Main render loop
function render() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw each shape
    shapes.forEach(shape => {
        const pos = shape.body.position;
        const angle = shape.body.angle;
        
        // Slow down 3D rotation when shape is nearly stationary
        const velocity = shape.body.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const rotationMultiplier = Math.min(1, speed * 0.5 + 0.1);
        
        shape.rotation3D.x += shape.rotationSpeed.x * rotationMultiplier;
        shape.rotation3D.y += shape.rotationSpeed.y * rotationMultiplier;
        shape.rotation3D.z += shape.rotationSpeed.z * rotationMultiplier;
        
        switch(shape.type) {
            case 'cube':
                drawCube(ctx, pos.x, pos.y, shape.size, angle, shape.color, shape.rotation3D);
                break;
            case 'pyramid':
                drawPyramid(ctx, pos.x, pos.y, shape.size, angle, shape.color, shape.rotation3D);
                break;
            case 'sphere':
                drawSphere(ctx, pos.x, pos.y, shape.size, shape.color, shape.rotation3D);
                break;
            case 'cylinder':
                drawCylinder(ctx, pos.x, pos.y, shape.size * 0.6, shape.size, angle, shape.color, shape.rotation3D);
                break;
            case 'diamond':
                drawDiamond(ctx, pos.x, pos.y, shape.size, angle, shape.color, shape.rotation3D);
                break;
        }
    });
    
    requestAnimationFrame(render);
}

// Spawn shapes perpetually (shapes persist until page refresh)
function spawnShape() {
    createShape();
    
    // Slow down spawn rate as more shapes accumulate for performance
    const delay = Math.min(1500, 600 + shapes.length * 5);
    setTimeout(spawnShape, delay);
}

// Handle window resize
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Update ground position
    Body.setPosition(ground, { x: width / 2, y: height + 30 });
    Body.setPosition(rightWall, { x: width + 30, y: height / 2 });
    
    // Update door position and size based on screen
    doorDims = getDoorDimensions();
    doorWidth = doorDims.width;
    doorHeight = doorDims.height;
    const newDoorY = height - 30 - (doorHeight / 2) + doorDims.yOffset;
    Body.setPosition(doorBody, { x: width / 2, y: newDoorY });
    Body.setVertices(doorBody, Bodies.rectangle(width / 2, newDoorY, doorWidth, doorHeight).vertices);
});

// Start the animation
render();
spawnShape();

// Initial burst of shapes
for (let i = 0; i < 5; i++) {
    setTimeout(() => createShape(), i * 300);
}
