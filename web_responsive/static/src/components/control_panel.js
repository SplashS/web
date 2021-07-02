/** @odoo-module **/

import ControlPanel from "web.ControlPanel";
import { useService } from "@web/core/service_hook";
import { patch } from "web.utils";

const { useState } = owl.hooks;

// Patch control panel to add states for mobile quick search
patch(ControlPanel.prototype, "web_responsive.ControlPanelMobile", {
    setup() {
        this._super();
        this.state = useState({
            mobileSearchMode: "",
        });
    }
});
