# Copyright 2016-2017 LasLabs Inc.
# Copyright 2017-2018 Tecnativa - Jairo Llopis
# Copyright 2018-2019 Tecnativa - Alexandre Díaz
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl.html).

{
    "name": "Web Responsive",
    "summary": "Responsive web client, community-supported",
    "version": "14.0.1.0.2",
    "category": "Website",
    "website": "https://github.com/OCA/web",
    "author": "LasLabs, Tecnativa, " "Odoo Community Association (OCA)",
    "license": "LGPL-3",
    "installable": True,
    "depends": ["web", "mail"],
    "development_status": "Production/Stable",
    "maintainers": ["Yajo", "Tardo"],
    "data": ["views/res_users.xml", "views/web.xml"],
    "qweb": [
        "static/src/xml/form_buttons.xml",
        "static/src/xml/menu.xml",
        "static/src/xml/navbar.xml",
        "static/src/xml/attachment_viewer.xml",
        "static/src/xml/discuss.xml",
        "static/src/xml/control_panel.xml",
        "static/src/xml/search_panel.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "/web_responsive/static/src/css/web_responsive.scss",
            "/web_responsive/static/src/js/web_responsive.js",
            "/web_responsive/static/src/css/kanban_view_mobile.scss",
            "/web_responsive/static/src/js/kanban_renderer_mobile.js",
            "/web_responsive/static/src/components/apps_menu.scss",
            "/web_responsive/static/src/components/apps_menu.js",
            "/web_responsive/static/src/components/main_navbar.scss",
            "/web_responsive/static/src/components/main_navbar.js",
            "/web_responsive/static/src/components/control_panel.scss",
            "/web_responsive/static/src/components/control_panel.js",
            "/web_responsive/static/src/components/search_panel.scss",
            "/web_responsive/static/src/components/search_panel.js",
            "/web_responsive/static/src/components/attachment_viewer.scss",
            "/web_responsive/static/src/components/attachment_viewer.js",
            "/web_responsive/static/src/components/hotkey.scss",
            "/web_responsive/static/src/components/hotkey.js",
        ],
        "web.assets_qweb": [
            "/web_responsive/static/src/xml/form_buttons.xml",
            "/web_responsive/static/src/components/apps_menu.xml",
            "/web_responsive/static/src/components/control_panel.xml",
            "/web_responsive/static/src/components/search_panel.xml",
            "/web_responsive/static/src/components/attachment_viewer.xml",
            "/web_responsive/static/src/components/hotkey.xml",
        ],
    },
    "sequence": 1,
}
