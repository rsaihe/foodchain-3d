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

    act() {
        // Respond to relevant entities
        var visible = this.visible(entities);
        var names = this.avoid.concat(this.chase).concat(this.eat);
        var relevant = getByName(visible, names);
        relevant.length === 0 ? this.wander() : this.steer(relevant);

        // Update
        this.update();
        this.bounceOffEdges();
        this.hunger();

        // Draw
        this.draw();
    }

    applyForce(f) {
        this.acc.add(f);
    }

    // Update position and velocity if outside map
    bounceOffEdges() {
        var mult = -4;

        if (this.pos.x - this.radius < -mapX) {
            this.pos.x = -mapX + this.radius;
            this.vel.x *= mult;
        }

        if (this.pos.x + this.radius > mapX) {
            this.pos.x = mapX - this.radius;
            this.vel.x *= mult;
        }

        if (this.pos.y - this.radius < -mapY) {
            this.pos.y = -mapY + this.radius;
            this.vel.y *= mult;
        }

        if (this.pos.y + this.radius > mapY) {
            this.pos.y = mapY - this.radius;
            this.vel.y *= mult;
        }

        if (this.pos.z + this.radius < mapZ) {
            this.pos.z = mapZ + this.radius;
            this.vel.z *= mult;
        }

        if (this.pos.z - this.radius > 0) {
            this.pos.z = -this.radius;
            this.vel.z *= mult;
        }
    }

    // Check if point is inside entity
    contains(x, y, z) {
        return insideSphere(createVector(x, y, z), this.pos, this.radius);
    }

    draw() {
        push();

        // Draw transparent sphere of perception radius around entity
        noStroke();
        translate(this.pos.x, this.pos.y, this.pos.z);
        if (showPerception) {
            ambientMaterial(this.color[0], this.color[1], this.color[2], 31);
            sphere(this.perception);
        }

        // Decrease opacity as nutrition level goes down
        var alpha;
        if (showNutrition) {
            alpha = 255 * this.nutrition / this.maxNutrition;
        } else {
            alpha = 255;
        }
        ambientMaterial(this.color[0], this.color[1], this.color[2], alpha);
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

    // Applies steering vector
    steer(entities) {}

    // Returns steering vector towards specific entity
    target(e) {
        return p5.Vector.sub(e.pos, this.pos).normalize().mult(this.accAmt);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.topSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    
    // Return an array of all entities within perception range
    visible(entities) {
        var visible = [];
        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            if (e === this) continue;
            if (insideSphere(e.pos, this.pos, this.perception)) {
                visible.push(e);
            }
        }
        
        return visible;
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
