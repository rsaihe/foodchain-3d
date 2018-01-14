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
