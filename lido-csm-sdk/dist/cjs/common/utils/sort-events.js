"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortEventsByBlockNumber = void 0;
const sortEventsByBlockNumber = (a, b) => Number(a.blockNumber - b.blockNumber);
exports.sortEventsByBlockNumber = sortEventsByBlockNumber;
//# sourceMappingURL=sort-events.js.map