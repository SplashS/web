/** @odoo-module **/

import { UserMenu } from "@web/webclient/user_menu/user_menu";
import { registry } from "@web/core/registry";

const systrayItem = {
    Component: UserMenu,
};
registry.category("systray").add("web.user_menu", systrayItem, { force: true, sequence: 0 });