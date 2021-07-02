/** @odoo-module **/

import { hotkeyService } from "@web/core/hotkeys/hotkey_service";
import { patch } from "web.utils";


patch(hotkeyService, "web_responsive.HotkeyServiceAltShiftOverlays", {
    isAlted(ev) {
        return this._super(ev) && ev.shiftKey;
    }
});

/**
 * Use ALT+SHIFT instead of ALT as hotkey triggerer.
 *
 * HACK https://github.com/odoo/odoo/issues/30068 - See it to know why.
 *
 * Cannot patch in `KeyboardNavigationMixin` directly because it's a mixin,
 * not a `Class`, and altering a mixin's `prototype` doesn't alter it where
 * it has already been used.
 *
 * Instead, we provide an additional mixin to be used wherever you need to
 * enable this behavior.
 */
var KeyboardNavigationShiftAltMixin = {
    /**
     * Alter the key event to require pressing Shift.
     *
     * This will produce a mocked event object where it will seem that
     * `Alt` is not pressed if `Shift` is not pressed.
     *
     * The reason for this is that original upstream code, found in
     * `KeyboardNavigationMixin` is very hardcoded against the `Alt` key,
     * so it is more maintainable to mock its input than to rewrite it
     * completely.
     *
     * @param {keyEvent} keyEvent
     * Original event object
     *
     * @returns {keyEvent}
     * Altered event object
     */
    _shiftPressed: function (keyEvent) {
        const alt = keyEvent.altKey || keyEvent.key === "Alt",
            newEvent = _.extend({}, keyEvent),
            shift = keyEvent.shiftKey || keyEvent.key === "Shift";
        // Mock event to make it seem like Alt is not pressed
        if (alt && !shift) {
            newEvent.altKey = false;
            if (newEvent.key === "Alt") {
                newEvent.key = "Shift";
            }
        }
        return newEvent;
    },

    _onKeyDown: function (keyDownEvent) {
        return this._super(this._shiftPressed(keyDownEvent));
    },

    _onKeyUp: function (keyUpEvent) {
        return this._super(this._shiftPressed(keyUpEvent));
    },
};

// Include the SHIFT+ALT mixin wherever
// `KeyboardNavigationMixin` is used upstream
//    AbstractWebClient.include(KeyboardNavigationShiftAltMixin);
