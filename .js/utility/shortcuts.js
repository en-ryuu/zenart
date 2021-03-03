'use_strict';
//-----------------------------------------------------------------------------------
//      _            _           _      
//   __| |_  ___ _ _| |_ __ _  _| |_ ___
//  (_-< ' \/ _ \ '_|  _/ _| || |  _(_-<
//  /__/_||_\___/_|  \__\__|\_,_|\__/__/
//   Keyboard bindings using Javascript
//
//-----------------------------------------------------------------------------------
// VERSION 1.5
//-----------------------------------------------------------------------------------
//
// Enables keyboard shortcuts to be attached to an event listener
//
//-----------------------------------------------------------------------------------
// Author:   Rick Ellis
// URL:      https://github.com/rickellis/shortcuts
// License:  BSD
//
// For usage examples, see README
//-----------------------------------------------------------------------------------

var shortcuts = new function() {

    this.eventType = 'keydown'
    this.eventTracker = new Array()
    this.shortcutExists = new Array()

    // Lets you add a new shortcut
    this.add = function(shortcut, callback, el) {
        
        // Prevents multiple additions of the same shortcut
        if (this.shortcutExists[shortcut] === true) {
            return
        }
        
        var element = el || document
        var keyTracker = function(e) {

                var event    = e || window.event
                var keypress = (event.keyCode) ? event.keyCode : event.which
                var keyvalue = String.fromCharCode(keypress).toLowerCase()
                var keycodes = {
                                    'backspace'  : 8,
                                    'tab'        : 9,
                                    'return'     : 13,
                                    'esc'        : 27,
                                    'space'      : 32,
                                    'scroll'     : 145,
                                    'capslock'   : 20,
                                    'numlock'    : 144,
                                    'pause'      : 19,
                                    'break'      : 19,
                                    'insert'     : 45,
                                    'home'       : 36,
                                    'delete'     : 127,
                                    'end'        : 35,
                                    'pageup'     : 33,
                                    'pagedown'   : 34,
                                    'left'       : 37,
                                    'up'         : 38,
                                    'right'      : 39,
                                    'down'       : 40,
                                    'f1'         : 112,
                                    'f2'         : 113,
                                    'f3'         : 114,
                                    'f4'         : 115,
                                    'f5'         : 116,
                                    'f6'         : 117,
                                    'f7'         : 118,
                                    'f8'         : 119,
                                    'f9'         : 120,
                                    'f10'        : 121,
                                    'f11'        : 122,
                                    'f12'        : 123
                                 }
                var metaWanted = {
                                    'cmd'        : false,
                                    'ctrl'       : false,
                                    'shift'      : false,
                                    'alt'        : false
                                  }
                var metaPressed = {
                                    'cmd'        : event.metaKey,
                                    'ctrl'       : event.ctrlKey,
                                    'shift'      : event.shiftKey,
                                    'alt'        : event.altKey
                                  }

                var shortcuts = shortcut.split('+')
                var matches = 0
                for (var i = 0; i < shortcuts.length; i++) {

                    if (shortcuts[i] == 'cmd') {
                        metaWanted['cmd'] = true
                        matches++
                    }
                    else if (shortcuts[i] == 'ctrl') {
                        metaWanted['ctrl'] = true
                        matches++
                    }
                    else if (shortcuts[i] == 'shift') {
                        metaWanted['shift'] = true
                        matches++
                    }
                    else if (shortcuts[i] == 'alt') {
                        metaWanted['alt'] = true
                        matches++
                    }
                    else if (shortcuts[i].length > 1)  {
                        if (keycodes[shortcuts[i]] == keypress) {
                            matches++
                        }
                    }
                    else {
                        if (shortcuts[i] === keyvalue) {
                            matches++
                        }
                    }
                }

                // If we have matched the shortcut we issue the callback
                if (matches === shortcuts.length &&
                    metaWanted['cmd']   === metaPressed['cmd'] && 
                    metaWanted['ctrl']  === metaPressed['ctrl'] &&
                    metaWanted['shift'] === metaPressed['shift'] &&
                    metaWanted['alt']   === metaPressed['alt']) {
                    
                    callback()
                }
            }

            // Add the event listener
            element.addEventListener(this.eventType, keyTracker)

            // Cache the event data so it can be removed later
            this.eventTracker[shortcut] = {'element' : element, 'callback' : keyTracker}

            this.shortcutExists[shortcut] = true
    }

    // --------------------------------------------------------------

    // Remove an event listener
    this.remove = function(shortcut) {
        shortcut = shortcut.toLowerCase()

        if (this.eventTracker[shortcut]) {

            var element  = this.eventTracker[shortcut]['element']
            var callback = this.eventTracker[shortcut]['callback']

            element.removeEventListener(this.eventType, callback, false)

            delete(this.eventTracker[shortcut])
            this.shortcutExists[shortcut] = false
        }
    }

// End shortcuts
}()

