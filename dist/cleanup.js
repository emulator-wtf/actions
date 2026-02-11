"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@actions/core");
var node_child_process_1 = require("node:child_process");
function invoke() {
    return __awaiter(this, void 0, void 0, function () {
        var pid, pids, counter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pid = (0, core_1.getState)("ew_cli_pid");
                    pids = getProcessTree(pid, 0);
                    (0, core_1.info)("Killing ".concat(pids.length, " processes"));
                    pids.reverse().forEach(function (p, index) {
                        var killProcess = (0, node_child_process_1.spawnSync)("kill", ["-2", "".concat(p)], { encoding: "ascii" });
                        (0, core_1.info)("kill ".concat(p, " returned ").concat(killProcess.status));
                    });
                    counter = 0;
                    _a.label = 1;
                case 1:
                    if (!((0, node_child_process_1.spawnSync)("ps", ["-p", "".concat(pid)]).status !== 1 && counter < 20)) return [3, 3];
                    counter += 1;
                    return [4, new Promise(function (resolve, _) { setTimeout(function () { return resolve(null); }, 100); })];
                case 2:
                    _a.sent();
                    return [3, 1];
                case 3:
                    (0, core_1.info)("ew-cli cleanup done");
                    return [2];
            }
        });
    });
}
function getProcessTree(pid, currentDepth) {
    var pids = [pid];
    if (currentDepth > 10) {
        return pids;
    }
    var child = (0, node_child_process_1.spawnSync)("pgrep", ["-P", "".concat(pid)], { encoding: "ascii" });
    if (child.status === 0) {
        child.stdout.split("\n").forEach(function (p, index) {
            if (p.trim().length > 0) {
                pids.push.apply(pids, getProcessTree(p, currentDepth + 1));
            }
        });
    }
    return pids;
}
invoke();
//# sourceMappingURL=cleanup.js.map