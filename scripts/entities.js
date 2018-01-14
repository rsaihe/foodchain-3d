function createEntity(x, y, z, template) {
    var e = new Entity(x, y, z);

    // Fill in all keys
    template = typeof template === 'undefined' ? {} : template;
    var keys = Object.keys(template);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        e[key] = template[key];
    }

    e.onCreate();
    return e;
}


// Steering functions

function multiTarget(entities) {
    var f = createVector(0, 0);

    // Avoidance
    var toAvoid = getByName(entities, this.avoid);
    for (var i = 0; i < toAvoid.length; i++) {
        var e = toAvoid[i];
        if (e === this) continue;
        f.add(this.target(e).mult(-this.avoidPriority));
    }

    // Chasing
    var toChase = getByName(entities, this.chase);
    for (var i = 0; i < toChase.length; i++) {
        var e = toChase[i];
        if (e === this) continue;
        this.onChase(e);
        f.add(this.target(e).mult(this.chasePriority));
    }

    this.applyForce(f.limit(this.accAmt));
}

function nearestTarget(entities) {
    var f = createVector(0, 0);

    // Avoidance
    var toAvoid = getByName(entities, this.avoid);
    for (var i = 0; i < toAvoid.length; i++) {
        var e = toAvoid[i];
        if (e === this) continue;
        f.add(this.target(e).mult(-this.avoidPriority));
    }

    // Chasing
    var toChase = getByName(entities, this.chase);
    if (toChase.length > 0) {
        var e = this.nearest(toChase);
        if (e !== this) {
            this.onChase(e);
            f.add(this.target(e).mult(this.chasePriority));
        }
    }

    this.applyForce(f.limit(this.accAmt));
}


var entity = {};

entity.food = {
    // Display
    color: [135, 211, 124],
    // Misc
    name: 'food',
    // Physics
    accAmt: 0,
    topSpeed: 0,
    // Methods
    hunger: function() {}
};

entity.fungus = {
    // AI
    canEat: ['prey'],
    perception: 20,
    // Display
    color: [102, 51, 153],
    radius: 40,
    // Misc
    name: 'fungus',
    // Nutrition
    nutrition: 500,
    // Physics
    accAmt: 0,
    fricAmt: 0.4,
    topSpeed: 10,
    // Methods
    onCreate() {
        if (typeof this.maxNutrition === 'undefined') {
            this.maxNutrition = this.nutrition;
        }
        this.perception = this.radius;
    },
    onEat: function(e) {
        if (!this.eat(e)) return;

        if (random(3) < 1) {
            this.radius += 5;
        } else {
            var p = p5.Vector.random3D().mult(200).add(this.pos);
            p = this.pos;
            var e = createEntity(p.x, p.y, p.z, entity.fungus);
            e.vel = p5.Vector.random3D().mult(this.topSpeed);
            newEntities.push(e);
        }
        
        while (true) {
            if (random(9) < 5) {
                var r = this.radius + 10;
                var p = p5.Vector.random3D().mult(r).add(this.pos);
                newEntities.push(createEntity(p.x, p.y, p.z, entity.food));
            } else {
                break;
            }
        }
    }
};

entity.pred = {
    // AI
    avoid: ['pred', 'swarm'],
    canEat: ['prey'],
    chase: ['prey'],
    avoidPriority: 0.5,
    chasePriority: 4,
    perception: 200,
    steer: multiTarget,
    // Display
    color: [207, 0, 15],
    radius: 25,
    // Misc
    name: 'pred',
    // Nutrition
    nutrition: 250,
    // Physics
    accAmt: 0.6,
    topSpeed: 6,
    // Methods
    onDeath: function() {
        if (random(3) >= 2) return;
        var p = this.pos;
        newEntities.push(createEntity(p.x, p.y, p.x, entity.food));
    },
    onEatAttempt: function(e) {
        this.vel.mult(0);
        if (random(4) < 1) this.onEat(e);
    },
    onEat: function(e) {
        if (!this.eat(e)) return;
        if (random(3) >= 1) return;

        var p = p5.Vector.random3D().mult(20).add(this.pos);
        newEntities.push(createEntity(p.x, p.y, p.z, entity.pred));
    }
};

entity.prey = {
    // AI
    canEat: ['food'],
    chase: ['food'],
    perception: 100,
    steer: nearestTarget,
    // Display
    color: [82, 179, 217],
    radius: 15,
    // Misc
    name: 'prey',
    // Nutrition
    nutrition: 400,
    // Physics
    accAmt: 1,
    topSpeed: 5,
    // Methods
    onEat: function(e) {
        if (!this.eat(e)) return;

        var p = p5.Vector.random3D().mult(20).add(this.pos);
        newEntities.push(createEntity(p.x, p.y, p.z, entity.prey));
    }
};
