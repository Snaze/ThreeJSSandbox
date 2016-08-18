define(["THREE"], function (THREE) {

    return {
        keyCodeForward: [38, 87], // UP ARROW and W
        keyCodeLeft: [37, 65], // LEFT ARROW and A
        keyCodeBack: [40, 83], // DOWN ARROW and S
        keyCodeRight: [39, 68], // RIGHT ARROW and D
        keyCodeJump: [32], // SPACE
        keyCodeShoot: [],
        keyCodeUse: [],
        keyCodeExitPointerLock: [27],

        leftClick: 'shoot',
        rightClick: 'use'
    };
});