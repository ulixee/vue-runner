"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// @ts-ignore
const dynamicAppTemplate_1 = tslib_1.__importDefault(require("dynamicAppTemplate"));
const vue_1 = tslib_1.__importDefault(require("vue"));
vue_1.default.config.productionTip = false;
new vue_1.default({
    render(h) {
        return h(dynamicAppTemplate_1.default);
    },
}).$mount('#app');
//# sourceMappingURL=main.js.map