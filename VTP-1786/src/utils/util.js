// get a random integer between range
export function rndInt(max, min) {

    if (!min) {
        min = 0;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sample(array) {

    return array[this.rndInt(array.length - 1, 0)];
}

export function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

// get a random color
export function rndRgba(alpha) {

    if (!alpha) {
        alpha = 1;
    }

    return 'rgba(' + this.rndInt(256) + ',' + this.rndInt(256) + ',' + this.rndInt(256) + ',' + alpha + ')';
}

// boolean screen orientation
export function isPortrait() {

    return window.innerHeight > window.innerWidth;
}


// boolean screen orientation
export function clone(obj) {

    return JSON.parse(JSON.stringify(obj));
}

export function remove(array, item) {

    var index = array.indexOf(item);

    if (index > -1) {
        array.splice(index, 1);
    }
}

// remove file extension from string
export function removeExtension(fileName) {

    // if no extension found just return the name
    if (fileName.lastIndexOf('.') === -1) {
        return fileName;
    }

    return fileName.substring(0, fileName.lastIndexOf('.'));
}

// vanilla js fade in functionality
export function fadeIn(el) {

    el.style.opacity = 0;

    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}

const g = 19.8;

export function calcQuadTime(h) {

    //todo: bugfixes
    //return PiecSettings.fallDuration;

    // based on free fall equation h = 0.5 * g * t^2 
    // (where h = height, g = gravoty on earth (9.8) and t = time)
    // equation re-arranged is t = (2h/g) ^ 0.5

    return Math.sqrt((2 * Math.abs(h)) / g) * 100;
}


export function uniq(a) {

    var prims = { "boolean": {}, "number": {}, "string": {} },
        objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if (type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}



export function getAnimation(name) {

    for (var i = 0; i < PiecSettings.animations.length; i++) {
        if (PiecSettings.animations[i].name === name) {
            return PiecSettings.animations[i];
        }
    }

    return null;
}


export function playAnimationForGroup(group, associatedSprite, animationName, alpha, rotateRandom) {

    var animation = this.getAnimation(animationName);

    if (!animation) {
        return;
    }

    var x = associatedSprite.parent.x + associatedSprite.x;
    var y = associatedSprite.parent.y + associatedSprite.y;

    var sprite = new Phaser.Sprite(group.game, x, y, animation.name);

    sprite.height = associatedSprite.height * animation.scale;
    sprite.width = associatedSprite.width * animation.scale;

    sprite.anchor.set(0.5, 0.5);

    sprite.alpha = animation.alpha || 1;


    if (typeof alpha !== 'undefined') {
        sprite.alpha = alpha;
    }

    if (rotateRandom === true) {
        sprite.angle = this.rndInt(360, 0);
    }

    sprite.animations.add(animation.name);

    var loop = animation.looped === true ? true : false;

    sprite.animations.play(animation.name, animation.frameRate, loop, true); //false stops loop

    if (animation.startFrame) {

        sprite.animations.currentAnim.setFrame(animation.startFrame, true);
    }

    group.add(sprite);
}

export function playAnimation(associatedSprite, animationName, alpha, rotateRandom) {

    var animation = this.getAnimation(animationName);

    if (!animation) {
        return;
    }

    var x = associatedSprite.parent.x + associatedSprite.x;
    var y = associatedSprite.parent.y + associatedSprite.y;

    var sprite = associatedSprite.game.add.sprite(x, y, animation.name);

    sprite.height = associatedSprite.height * animation.scale;
    sprite.width = associatedSprite.width * animation.scale;

    sprite.anchor.set(0.5, 0.5);

    sprite.alpha = animation.alpha || 1;

    if (typeof alpha !== 'undefined') {
        sprite.alpha = alpha;
    }

    if (rotateRandom === true) {
        sprite.angle = this.rndInt(360, 0);
    }

    sprite.animations.add(animation.name);

    var loop = animation.looped === true ? true : false;

    sprite.animations.play(animation.name, animation.frameRate, loop, true); //false stops loop

    if (animation.startFrame) {

        sprite.animations.currentAnim.setFrame(animation.startFrame, true);
    }
}

export function positionSpriteInDomElement(sprite, elId) {

    sprite.anchor.setTo(0.5, 0.5);

    var el = document.getElementById(elId);

    var scale = (el.offsetWidth * window.devicePixelRatio) / sprite.width;

    var height = sprite.height;

    sprite.scale.x = scale;
    sprite.scale.y = scale;

    if (sprite.height > (el.offsetHeight * window.devicePixelRatio)) {
        scale = (el.offsetHeight * window.devicePixelRatio) / height;
    }

    sprite.scale.x = scale;
    sprite.scale.y = scale;

    sprite.x = (el.offsetLeft - sprite.game.el.offsetLeft) * window.devicePixelRatio;
    sprite.y = (el.offsetTop - sprite.game.el.offsetTop) * window.devicePixelRatio;
}


export function positionSpriteInDomElement2(sprite, elId, xOffset, yOffset) {

    sprite.anchor.setTo(0.5, 0.5);

    var el = document.getElementById(elId);

    var scale = (el.offsetWidth * window.devicePixelRatio) / sprite.width;

    var height = sprite.height;

    sprite.scale.x = scale;
    sprite.scale.y = scale;

    if (sprite.height > (el.offsetHeight * window.devicePixelRatio)) {
        scale = (el.offsetHeight * window.devicePixelRatio) / height;
    }

    sprite.scale.x = scale;
    sprite.scale.y = scale;

    sprite.x = 
        (el.offsetLeft - sprite.game.el.offsetLeft) * window.devicePixelRatio + (el.offsetWidth * 0.5 * window.devicePixelRatio);
    sprite.y = 
        (el.offsetTop - sprite.game.el.offsetTop) * window.devicePixelRatio + (el.offsetHeight * 0.5 * window.devicePixelRatio);
}
