/* Copyright 2018 Tecnativa - Jairo Llopis
 * Copyright 2018 Tecnativa - Sergey Shebanin
 * License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl). */

odoo.define("web_responsive", function (require) {
    "use strict";

    const config = require("web.config");
    const core = require("web.core");
    const FormRenderer = require("web.FormRenderer");
    const RelationalFields = require("web.relational_fields");
    const ListRenderer = require("web.ListRenderer");
    const CalendarRenderer = require("web.CalendarRenderer");

    RelationalFields.FieldStatus.include({
        /**
         * Fold all on mobiles.
         *
         * @override
         */
        _setState: function () {
            this._super.apply(this, arguments);
            if (config.device.isMobile) {
                _.map(this.status_information, (value) => {
                    value.fold = true;
                });
            }
        },
    });

    // Sticky Column Selector
    ListRenderer.include({
        _renderView: function () {
            const self = this;
            return this._super.apply(this, arguments).then(() => {
                const $col_selector = self.$el.find(
                    ".o_optional_columns_dropdown_toggle"
                );
                if ($col_selector.length !== 0) {
                    const $th = self.$el.find("thead>tr:first>th:last");
                    $col_selector.appendTo($th);
                }
            });
        },

        _onToggleOptionalColumnDropdown: function (ev) {
            // FIXME: For some strange reason the 'stopPropagation' call
            // in the main method don't work. Invoking here the same method
            // does the expected behavior... O_O!
            // This prevents the action of sorting the column from being
            // launched.
            ev.stopPropagation();
            this._super.apply(this, arguments);
        },
    });

    // Responsive view "action" buttons
    FormRenderer.include({
        /**
         * In mobiles, put all statusbar buttons in a dropdown.
         *
         * @override
         */
        _renderHeaderButtons: function () {
            const $buttons = this._super.apply(this, arguments);
            if (
                !config.device.isMobile ||
                $buttons.children("button:not(.o_invisible_modifier)").length <= 2
            ) {
                return $buttons;
            }

            // $buttons must be appended by JS because all events are bound
            const $dropdown = $(
                core.qweb.render("web_responsive.MenuStatusbarButtons")
            );
            $buttons.addClass("dropdown-menu").appendTo($dropdown);
            return $dropdown;
        },
    });

    CalendarRenderer.include({
        _getFullCalendarOptions: function () {
            var options = this._super.apply(this, arguments);
            if (config.device.isMobile) {
                options.views.dayGridMonth.columnHeaderFormat = "ddd";
            }
            return options;
        },
    });
});
