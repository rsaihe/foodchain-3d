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

    kill() {
        this.alive = false;
    }

    onCreate() {
        if (typeof this.maxNutrition === 'undefined') {
            this.maxNutrition = this.nutrition;
        }
    }
}
