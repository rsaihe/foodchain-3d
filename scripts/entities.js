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

entity.prey = {
    // AI
    canEat: ['food'],
    chase: ['food'],
    perception: 100,
    steer: nearestTarget,
    // Display
    color: [82, 179, 217],
    radius: 15,
    // Nutrition
    nutrition: 400,
    // Physics
    accAmt: 0.5,
    topSpeed: 3,
    // Methods
    onEat: function(e) {
        if (!this.eat(e)) return;

        var p = p5.Vector.random3D().mult(20).add(this.pos);
        newEntities.push(createEntity(p.x, p.y, p.z, entity.prey));
    }
};
