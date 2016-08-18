/*
 * @author Sann-Remy Chea / http://srchea.com/
 * Generate a random terrain using the diamond-square algorithm
 */

define(["jquery",
        "THREE",
        "PointerLockControls",
        "util/ArrayUtils",
        "util/config/ControlHelperConfig",
        "util/Document",
        "util/Console"],
    function ($,
              THREE,
              PointerLockControls,
              ArrayUtils,
              ControlHelperConfig,
              document,
              console) {
    "use strict";

    /**
     * This class will help out with button presses on the keyboard and mouse
     */
    var controlHelper = function (args) {
        if (!args) {
            args = {};
        }

        this.keyCodeForward = ArrayUtils.clone(args.keyCodeForward || ControlHelperConfig.keyCodeForward);
        this.keyCodeLeft = ArrayUtils.clone(args.keyCodeLeft || ControlHelperConfig.keyCodeLeft);
        this.keyCodeBack = ArrayUtils.clone(args.keyCodeBack || ControlHelperConfig.keyCodeBack);
        this.keyCodeRight = ArrayUtils.clone(args.keyCodeRight || ControlHelperConfig.keyCodeRight);
        this.keyCodeJump = ArrayUtils.clone(args.keyCodeJump || ControlHelperConfig.keyCodeJump);
        this.keyCodeShoot = ArrayUtils.clone(args.keyCodeShoot || ControlHelperConfig.keyCodeShoot);
        this.keyCodeUse = ArrayUtils.clone(args.keyCodeUse || ControlHelperConfig.keyCodeUse);
        this.keyCodeExitPointerLock = ArrayUtils.clone(args.keyCodeExitPointerLock || ControlHelperConfig.keyCodeExitPointerLock);
        this.leftClick = args.leftClick || ControlHelperConfig.leftClick;
        this.rightClick = args.rightClick || ControlHelperConfig.rightClick;

        console.assert($.inArray(this.leftClick, controlHelper.VALID_ACTIONS) >= 0);
        console.assert($.inArray(this.rightClick, controlHelper.VALID_ACTIONS) >= 0);

        this.state = {
            forward: false,
            left: false,
            back: false,
            right: false,
            jump: false,
            shoot: false,
            use: false,
            exitPointerLock: false,
            mouseDeltaX: 0.0,
            mouseDeltaY: 0.0,
        };

        this.havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
        if (!this.havePointerLock) {
            console.log("Your browser doesn't support pointer lock");
        }

        this.element = document.body;

        this.element.requestPointerLock = this.element.requestPointerLock ||
            this.element.mozRequestPointerLock ||
            this.element.webkitRequestPointerLock;

        document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock;
    };

    controlHelper.FORWARD = "forward";
    controlHelper.BACK = "back";
    controlHelper.STRAFE_LEFT = "left";
    controlHelper.STRAFE_RIGHT = "right";
    controlHelper.JUMP = "jump";
    controlHelper.SHOOT = "shoot";
    controlHelper.USE = "use";
    controlHelper.NONE = "none";
    controlHelper.EXIT_POINTER_LOCK = "exit";

    controlHelper.KEYCODE_ESCAPE = 27;

    controlHelper.MOUSE_BTN_LEFT = 1;
    controlHelper.MOUSE_BTN_MIDDLE = 2;
    controlHelper.MOUSE_BTN_RIGHT = 3;

    controlHelper.VALID_ACTIONS = [
        controlHelper.FORWARD,
        controlHelper.BACK,
        controlHelper.STRAFE_LEFT,
        controlHelper.STRAFE_RIGHT,
        controlHelper.JUMP,
        controlHelper.SHOOT,
        controlHelper.USE,
        controlHelper.EXIT_POINTER_LOCK,
        controlHelper.NONE
    ];

    controlHelper.prototype = {
        /**
         * This should disable the context menu.
         *
         * @param event
         * @returns {boolean}
         * @private
         */
        _contextMenu: function (event) {
            event.preventDefault();

            return false;
        },
        _keyDown: function (event) {
            event.preventDefault();

            if ($.inArray(event.which, this.keyCodeForward) >= 0) {
                this.state.forward = true;
            } else if ($.inArray(event.which, this.keyCodeBack) >= 0) {
                this.state.back = true;
            } else if ($.inArray(event.which, this.keyCodeLeft) >= 0) {
                this.state.left = true;
            } else if ($.inArray(event.which, this.keyCodeRight) >= 0) {
                this.state.right = true;
            } else if ($.inArray(event.which, this.keyCodeJump) >= 0) {
                this.state.jump = true;
            } else if ($.inArray(event.which, this.keyCodeShoot) >= 0) {
                this.state.shoot = true;
            } else if ($.inArray(event.which, this.keyCodeUse) >= 0) {
                this.state.use = true;
            } else if ($.inArray(event.which, this.keyCodeExitPointerLock) >= 0) {
                this.state.exitPointerLock = true;
            }


        },
        _keyUp: function (event) {
            event.preventDefault();

            if ($.inArray(event.which, this.keyCodeForward) >= 0) {
                this.state.forward = false;
            } else if ($.inArray(event.which, this.keyCodeBack) >= 0) {
                this.state.back = false;
            } else if ($.inArray(event.which, this.keyCodeLeft) >= 0) {
                this.state.left = false;
            } else if ($.inArray(event.which, this.keyCodeRight) >= 0) {
                this.state.right = false;
            } else if ($.inArray(event.which, this.keyCodeJump) >= 0) {
                this.state.jump = false;
            } else if ($.inArray(event.which, this.keyCodeShoot) >= 0) {
                this.state.shoot = false;
            } else if ($.inArray(event.which, this.keyCodeUse) >= 0) {
                this.state.use = false;
            } else if ($.inArray(event.which, this.keyCodeExitPointerLock) >= 0) {
                this.state.exitPointerLock = false;
            }

        },
        _mouseDown: function (event) {
            event.preventDefault();

            if (event.which === controlHelper.MOUSE_BTN_LEFT) { // LEFT
                if (this.leftClick !== controlHelper.NONE) {
                    this.state[this.leftClick] = true;
                }
            } else if (event.which === controlHelper.MOUSE_BTN_MIDDLE) { // MIDDLE
                // NOT USED
            } else if (event.which === controlHelper.MOUSE_BTN_RIGHT) { // RIGHT
                if (this.rightClick !== controlHelper.NONE) {
                    this.state[this.rightClick] = true;
                }
            }
        },
        _mouseUp: function (event) {
            event.preventDefault();

            if (event.which === controlHelper.MOUSE_BTN_LEFT) { // LEFT
                if (this.leftClick !== controlHelper.NONE) {
                    this.state[this.leftClick] = false;
                }
            } else if (event.which === controlHelper.MOUSE_BTN_MIDDLE) { // MIDDLE
                // NOT USED
            } else if (event.which === controlHelper.MOUSE_BTN_RIGHT) { // RIGHT
                if (this.rightClick !== controlHelper.NONE) {
                    this.state[this.rightClick] = false;
                }
            }
        },
        _mouseMove: function (event) {
            event.preventDefault();

            var movementX = event.movementX ||
                    event.mozMovementX      ||
                    event.webkitMovementX   ||
                    0;

            var movementY = event.movementY ||
                    event.mozMovementY      ||
                    event.webkitMovementY   ||
                    0;

            this.state.mouseDeltaX += event.originalEvent.movementX;
            this.state.mouseDeltaY += event.originalEvent.movementY;
        },
        _pointerLockChange: function (event) {
            if (document.pointerLockElement === this.element ||
                document.mozPointerLockElement === this.element ||
                document.webkitPointerLockElement === this.element) {
                // Pointer lock enabled
                console.log("Pointer Lock Enabled");
                // this.state.exitPointerLock = false;
            } else {
                // Pointer lock disabled
                console.log("Pointer Lock Disabled");
                this.unbindEvents();
                // this.state.exitPointerLock = false;
            }
        },
        _pointerLockError: function (event) {
            console.log("Pointer Lock Error");
            console.log(event);
        },
        bindEvents: function () {
            $(document).on("keydown", $.proxy(this._keyDown, this));
            $(document).on("keyup", $.proxy(this._keyUp, this));
            $(document).on("mousedown", $.proxy(this._mouseDown, this));
            $(document).on("mouseup", $.proxy(this._mouseUp, this));
            $(document).on("mousemove", $.proxy(this._mouseMove, this));
            $(document).on("pointerlockchange", $.proxy(this._pointerLockChange, this));
            $(document).on("pointerlockerror", $.proxy(this._pointerLockError, this));
            $(document).on("contextmenu", $.proxy(this._contextMenu, this));

            if (this.element.requestPointerLock) {
                this.element.requestPointerLock();
            } else {
                console.log("this.element.requestPointerLock does not exist.");
            }
        },
        unbindEvents: function () {
            $(document).off("keydown");
            $(document).off("keyup");
            $(document).off("mousedown");
            $(document).off("mouseup");
            $(document).off("mousemove");
            $(document).off("pointerlockchange");
            $(document).off("pointerlockerror");
            $(document).off("contextmenu");

            if (document.exitPointerLock) {
                document.exitPointerLock();
            } else {
                console.log("this.element.exitPointerLock does not exist.");
            }
        }
    };

    return controlHelper;
});
