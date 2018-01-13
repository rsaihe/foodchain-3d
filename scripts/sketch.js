// Main p5 functions

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
    background(0);

    rotateX(radians(-30));
    rotateY(radians(30));

    // Lighting
    ambientLight(80);
    directionalLight(255, -PI/4, -PI/4, 0);

    // Material
    ambientMaterial(255, 0, 0);

    noStroke();
    sphere(50);
}
