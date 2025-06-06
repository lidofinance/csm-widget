"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_CODE = exports.ROLES = void 0;
var ROLES;
(function (ROLES) {
    ROLES["MANAGER"] = "MANAGER";
    ROLES["REWARDS"] = "REWARDS";
})(ROLES || (exports.ROLES = ROLES = {}));
var ROLE_CODE;
(function (ROLE_CODE) {
    ROLE_CODE[ROLE_CODE["NONE"] = 0] = "NONE";
    ROLE_CODE[ROLE_CODE["REWARDS"] = 1] = "REWARDS";
    ROLE_CODE[ROLE_CODE["MANAGER"] = 2] = "MANAGER";
    ROLE_CODE[ROLE_CODE["REWARDS_AND_MANAGER"] = 3] = "REWARDS_AND_MANAGER";
})(ROLE_CODE || (exports.ROLE_CODE = ROLE_CODE = {}));
//# sourceMappingURL=roles.js.map