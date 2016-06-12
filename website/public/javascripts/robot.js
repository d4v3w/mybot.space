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
        plugin = this,
        $element = $(element),
        socket = undefined,

        log = function (msg, debug) {
            if (!debug) {
                console.log(msg);
            }
        },

        running = false,

        doRobot = function (command) {
            var that = this,
                json = {};
            
            log('Do robot: ' + command);

            socket.emit(command, {
                timestamp: $.now()
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
        };
        plugin.settings = {};

        // public methods
        plugin.init = function () {
            log('plugin init...', false);
            plugin.settings = $.extend({}, defaults, options);

            setupSocket();
            setupSocketListeners();
            setupInterfaceListeners();
        };

        plugin.start = function () {
            log('Started... Press <<PRESS ENTER>> to stop');
            doRobot('start');
        };

        plugin.right = function () {
            log('Right...');
            doRobot('right');
        };

        plugin.left = function () {
            log('Left...');
            doRobot('left', true);
        };

        plugin.forward = function () {
            log('Fwd...');
            doRobot('forward');
        };

        plugin.reverse = function () {
            log('Reverse...');
            doRobot('back');
        };

        plugin.stop = function () {
            log('Stopped... Press <<PRESS ENTER>> to start again');
            doRobot('stop');
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
