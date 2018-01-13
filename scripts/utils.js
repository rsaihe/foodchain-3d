// Returns an array of entities that match a name
function getByName(entities, names) {
    if (typeof names === 'string') names = [names];

    var results = [];
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        for (var j = 0; j < names.length; j++) {
            if (e.name === names[j]) results.push(e);
        }
    }
    
    return results;
}

// Check if point is inside sphere
function insideSphere(x, y, z, cx, cy, cz, r) {
    return sq(x - cx) + sq(y - cy) + sq(z - cz) < sq(r);
}
