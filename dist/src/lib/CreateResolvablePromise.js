"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CreateResolvablePromise(timeoutMillis, timeoutMessage) {
    const response = {
        isResolved: false,
    };
    const error = new Error(timeoutMessage || 'Timeout waiting for promise');
    response.promise = new Promise((resolve, reject) => {
        response.resolve = (...args) => {
            if (response.isResolved)
                return;
            response.isResolved = true;
            if (response.timeout)
                clearTimeout(response.timeout);
            resolve(...args);
        };
        response.reject = (err) => {
            if (response.isResolved)
                return;
            response.isResolved = true;
            if (response.timeout)
                clearTimeout(response.timeout);
            reject(err);
        };
        if (timeoutMillis) {
            response.timeout = setTimeout(() => response.reject(error), timeoutMillis);
        }
    });
    return response;
}
exports.default = CreateResolvablePromise;
//# sourceMappingURL=CreateResolvablePromise.js.map