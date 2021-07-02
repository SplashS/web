/** @odoo-module **/

import { Dropdown } from "@web/core/dropdown/dropdown";
import { NavBar } from "@web/webclient/navbar/navbar";
import { useAutofocus } from "@web/core/autofocus_hook";
import { useService } from "@web/core/service_hook";
import { useHotkey } from "@web/core/hotkey_hook";
import { scrollTo } from "@web/core/utils/scrolling";
import { debounce } from "@web/core/utils/timing";

const { Component } = owl;
const { useState, useRef } = owl.hooks;

/**
 * @extends Dropdown
 */
export class AppsMenu extends Dropdown {
    setup() {
        super.setup();
        this.env.bus.on("ACTION_MANAGER:UI-UPDATED", this, ev => this.close());
    }
};

/**
 * Reduce menu data to a searchable format understandable by fuzzy.js
 *
 * `menuService.getAll()` returns array in a format similar to this (only
 * relevant data is shown):
 *
 * ```js
 * [
 *   // This is a menu entry:
 *   {
 *     id: 1,
 *     actionID: 12,       // Or `false`
 *     children: [14, 15], // Or `undefined`
 *     name: "Actions",
 *   },
 *   ...
 * ]
 * ```
 *
 * This format is very hard to process to search matches, and it would
 * slow down the search algorithm, so we reduce it with this method to be
 * able to later implement a simpler search.
 *
 * @param {Object} memo
 * Reference to current result object, passed on recursive calls.
 *
 * @param {Object} menu
 * A menu entry, as described above.
 *
 * @returns {Object}
 * Reduced object, without entries that have no action, and with a
 * format like this:
 *
 * ```js
 * {
 *  "Discuss": {Menu entry Object},
 *  "Settings": {Menu entry Object},
 *  "Settings/Technical/Actions/Actions": {Menu entry Object},
 *  ...
 * }
 * ```
 */
function findNames(memo, menu) {
    if (menu.actionID) {
        memo[menu.name.trim()] = menu;
    }
    if (menu.childrenTree) {
        var innerMemo = _.reduce(menu.childrenTree, findNames, {});
        for (var innerKey in innerMemo) {
            memo[menu.name.trim() + ' / ' + innerKey] = innerMemo[innerKey];
        }
    }
    return memo;
}

/**
 * @extends Component
 */
export class AppsMenuSearchBar extends Component {
    setup() {
        super.setup();
        this.state = useState({
            results: [],
            offset: 0,
        });
        useAutofocus({ selector: "input" });
        this.searchBarInput = useRef("SearchBarInput");
        this._searchMenus = debounce(this._searchMenus, 100);
        // Store menu data in a format searchable by fuzzy.js
        this._searchableMenus = [];
        this.menuService = useService("menu");
        for (const menu of this.menuService.getApps()) {
            Object.assign(this._searchableMenus, _.reduce([this.menuService.getMenuAsTree(menu.id)], findNames, {}));
        }
        // Set up key navigation
        this._setupKeyNavigation();
    }

    willPatch() {
        // Allow looping on results
        if (this.state.offset < 0) {
            this.state.offset = this.state.results.length + this.state.offset;
        } else if (this.state.offset >= this.state.results.length) {
            this.state.offset -= this.state.results.length;
        }
    }

    patched() {
        if (this.state.results.length) {
            const listElement = this.el.querySelector('.search-results');
            const activeElement = this.el.querySelector('.highlight');
            if (activeElement) {
                scrollTo(activeElement, listElement);
            }
        }
    }

    /**
     * Search among available menu items, and render that search.
     */
    _searchMenus() {
        const query = this.searchBarInput.el.value;
        this.state.results = query === "" ? [] :
            fuzzy.filter(query, _.keys(this._searchableMenus), {
                pre: "<b>",
                post: "</b>",
            });
    }

    /**
     * Get menu object for a given key.
     * @param {String} key Full path to requested menu.
     * @returns {Object} Menu object.
     */
    _menuInfo(key) {
        return this._searchableMenus[key];
    }

    /**
     * Setup navigation among search results
     */
    _setupKeyNavigation() {
        const single = {
            altIsOptional: true,
        };
        const repeatable = {
            altIsOptional: true,
            allowRepeat: true,
        };
        useHotkey("ArrowDown", () => { this.state.offset++ }, repeatable);
        useHotkey("ArrowUp", () => { this.state.offset-- }, repeatable);
        useHotkey("Home", () => { this.state.offset = 0 }, single);
        useHotkey("End", () => { this.state.offset = this.state.results.length - 1 }, single);
        useHotkey("Enter", () => {
            if (this.state.results.length) {
                this.el.querySelector(".highlight").click();
            }
        }, single);
    }
}
AppsMenuSearchBar.template = "web_responsive.AppsMenuSearchResults";
Object.assign(NavBar.components, { AppsMenu, AppsMenuSearchBar });
