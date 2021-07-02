/** @odoo-module **/

import { AttachmentViewer } from '@mail/components/attachment_viewer/attachment_viewer';
import { patch } from "web.utils";

const { useState } = owl.hooks;

//    // TODO: use default odoo device context when it will be realized
//    const deviceContext = new Context({
//        isMobile: config.device.isMobile,
//        size_class: config.device.size_class,
//        SIZES: config.device.SIZES,
//    });
//    window.addEventListener(
//        "resize",
//        owl.utils.debounce(() => {
//            const state = deviceContext.state;
//            if (state.isMobile !== config.device.isMobile) {
//                state.isMobile = !state.isMobile;
//            }
//            if (state.size_class !== config.device.size_class) {
//                state.size_class = config.device.size_class;
//            }
//        }, 15)
//    );
// Patch attachment viewer to add min/max buttons capability
patch(AttachmentViewer.prototype, "web_responsive.AttachmentViewer", {
    setup() {
        this._super();
        this.state = useState({
            maximized: false,
        });
    },
    // Disable auto-close to allow to use form in edit mode.
    isCloseable() {
        return false;
    }
});
//    QWeb.components.AttachmentViewer = PatchableAttachmentViewer;
//
//    return {
//        deviceContext: deviceContext,
//    };