class Entity {
    constructor(x, y, z) {
        // AI
        this.avoid = [];
        this.chase = [];
        this.eat = [];
        this.avoidPriority = 1;
        this.chasePriority = 1;
        this.perception = 0;

        // Display
        this.color = [255, 255, 255];
        this.radius = 10;

        // Misc
        this.alive = true;
        this.name = 'entity';

        // Nutrition
        this.nutrition = 50;
        
        // Physics
        this.pos = createVector(x, y, z);
        this.vel = createVector();
        this.acc = createVector();
        this.accAmt = 0.1;
        this.topSpeed = 0;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    // Check if point is inside entity
    contains(x, y, z) {
        return insideSphere(
            x, y, z, this.pos.x, this.pos.y, this.pos.z, this.radius
        );
    }

    draw() {
        push();

        noStroke();

        // Decrease opacity as nutrition level goes down
        var alpha;
        if (showNutrition) {
            alpha = 255 * this.nutrition / this.maxNutrition;
        } else {
            alpha = 255;
        }
        ambientMaterial(this.color, alpha);

        translate(this.pos.x, this.pos.y, this.pos.z);
        sphere(this.radius);

        pop();
    }

    // Reduces nutrition level, kills if nutrition is 0
    hunger() {
        this.nutrition > 0 ? this.nutrition-- : this.kill();
    }

    kill() {
        this.alive = false;
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.topSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    // Accelerate in random direction
    wander() {
        this.applyForce(p5.Vector.random3D().mult(this.accAmt));
    }


    // Events

    onCreate() {
        if (typeof this.maxNutrition === 'undefined') {
            this.maxNutrition = this.nutrition;
        }
    }
}
