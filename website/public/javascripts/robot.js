/* 
 * robot.js | jQuery Plugin
 * Name: robotUtil
 * Description: Client side controller utils for robots
 * 
 * Pins
 * 17: right {on: 'fwd'}
 * 18: right {on: 'back'}
 * 27: left {on: 'fwd'}
 * 22: left {on: 'back'}
 */

(function ($, console, io) {
    'use strict';
    $.robotUtil = function (element, options) {
        var defaults = {
            keys : {
                left : 37,
                right : 39,
                forward : 38,
                reverse : 40,
                stop : 13
            },
            url : '',
            script : '',
            getStatus : function () {
                return 'Status';
            }
        },

        plugin = this, $element = $(element), socket = undefined,

        INSTANCE_ID = 'robot',

        log = function (msg, debug) {
            if ( !debug) {
                console.log(msg);
            }
        },

        getKey = function (value, reverse) {
            var returnValue = '';
            if (value && reverse) {
                returnValue = value.split(':')[1] || value;
            } else {
                if (value) {
                    returnValue = INSTANCE_ID + ':' + value;
                } else {
                    returnValue = INSTANCE_ID;
                }
            }
            return returnValue;
        },

        trigger = function (eventType, eventMsg) {
            if (eventType) {
                log('trigger: ' + getKey(eventType));
                $element.trigger({
                    type : getKey(eventType),
                    message : eventMsg || 'OK',
                    time : new Date()
                });
            } else {
                log('Triggered event without type! '.eventMsg);
                return;
            }
        },

        running = false,

        doTheRobot = function (command) {
            var that = this, json = {};
            log('Do robot: ' + command);
            // Send to socket
            socket.emit(getKey(command, true), {
                timestamp : $.now()
            });
        },

        setupSocket = function () {
            var connectionUrl = plugin.settings.url + plugin.settings.script;
            log('setupSocket: ' + connectionUrl);

            socket = io.connect(connectionUrl);
        },

        setupSocketListeners = function () {
            log('setupSocketListeners...', true);
            socket.on('requestRecieved', function (data) {
                log('requestRecieved: ' + data["event"]);
            });
        },

        setupInterfaceListeners = function () {
            log('setupInterfaceListeners...', true);
            $element.keypress(function (event) {
                log('Key press: ' + event.which, true);
                if (event.which === plugin.settings.keys.stop) {
                    event.preventDefault();
                    if (running) {
                        running = false;
                        plugin.stop();
                    } else {
                        running = true;
                        plugin.start();
                    }
                }
            });
            $element.keydown(function (event) {
                if (running) {
                    log('Key down: ' + event.which, true);
                    if (event.which === plugin.settings.keys.forward) {
                        event.preventDefault();
                        plugin.forward();
                    } else if (event.which === plugin.settings.keys.left) {
                        event.preventDefault();
                        plugin.left();
                    } else if (event.which === plugin.settings.keys.right) {
                        event.preventDefault();
                        plugin.right();
                    } else if (event.which === plugin.settings.keys.reverse) {
                        event.preventDefault();
                        plugin.reverse();
                    }
                } else {
                    log('Key down ignored. Robot not started! <<PRESS ENTER>>');
                }
            });
            // Listen for movement events
            $element.on('robot:initRobot', function (event) {
                log('listened: ' + event.type);
                // Get everything ready
                setupSocket();
                setupSocketListeners();

                trigger('ready', 'Robot initilised.');
            });
            // Listen for movement events
            $element.on('robot:forward robot:reverse robot:left robot:right', function (event) {
                doTheRobot(event.type);
            });
        };
        plugin.settings = {};

        /*
         * public methods Note: These only trigger events the prototype is
         * listening for
         */
        plugin.init = function () {
            log('plugin init...', false);
            plugin.settings = $.extend({}, defaults, options);

            setupInterfaceListeners();
            trigger('initRobot');
        };

        plugin.start = function () {
            trigger('start');
            log('Started... Press <<PRESS ENTER>> to stop');
        };

        plugin.right = function () {
            log('Right...');
            trigger('right');
        };

        plugin.left = function () {
            log('Left...');
            trigger('left');
        };

        plugin.forward = function () {
            log('Fwd...');
            trigger('forward');
        };

        plugin.reverse = function () {
            log('Reverse...');
            trigger('reverse');
        };

        plugin.stop = function () {
            trigger('stop');
            log('Stopped... Press <<PRESS ENTER>> to start again');
        };

        plugin.init();
    };

    $.fn.robotUtil = function (options) {
        return this.each(function () {
            if (undefined === $(this).data('robotUtil')) {
                var plugin = new $.robotUtil(this, options);
                $(this).data('robotUtil', plugin);
            }
        });
    };
}(jQuery, console, io));
