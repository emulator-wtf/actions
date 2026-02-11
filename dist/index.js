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
var WAIT_TIMEOUT = 60000;
function invoke() {
    return __awaiter(this, void 0, void 0, function () {
        var token, outputsDir, outputs, recordVideo, devices, maxTimeLimit, adbEnabled, adbBinary, proxyHost, proxyPort, proxyUser, proxyPass, dnsServers, dnsOverrides, egressTunnel, egressLocalhostFwdIp, args_1, ewCli, stdout, stderr, adbPorts, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    token = (0, core_1.getInput)('api-token');
                    outputsDir = (0, core_1.getInput)('outputs-dir');
                    outputs = (0, core_1.getInput)('outputs');
                    recordVideo = (0, core_1.getInput)('record-video') && (0, core_1.getBooleanInput)('record-video');
                    devices = (0, core_1.getMultilineInput)('devices').filter(function (x) { return x.length > 0; });
                    maxTimeLimit = (0, core_1.getInput)('max-time-limit');
                    adbEnabled = (0, core_1.getInput)('adb') && (0, core_1.getBooleanInput)('adb');
                    adbBinary = (0, core_1.getInput)('adb-binary');
                    proxyHost = (0, core_1.getInput)('proxy-host');
                    proxyPort = (0, core_1.getInput)('proxy-port');
                    proxyUser = (0, core_1.getInput)('proxy-user');
                    proxyPass = (0, core_1.getInput)('proxy-password');
                    dnsServers = (0, core_1.getMultilineInput)('dns-server').filter(function (x) { return x.length > 0; });
                    dnsOverrides = (0, core_1.getMultilineInput)('dns-override').filter(function (x) { return x.length > 0; });
                    egressTunnel = (0, core_1.getInput)('egress-tunnel') && (0, core_1.getBooleanInput)('egress-tunnel');
                    egressLocalhostFwdIp = (0, core_1.getInput)('egress-localhost-fwd-ip');
                    args_1 = ['start-session', '--json'];
                    if (token === '' && process.env['EW_API_TOKEN'] === undefined) {
                        (0, core_1.warning)('api-token or EW_API_TOKEN env var must be specified');
                        (0, core_1.setFailed)('api-token or EW_API_TOKEN env var must be specified');
                        return [2];
                    }
                    if (token !== '') {
                        args_1.push('--token', token);
                    }
                    if (outputsDir) {
                        args_1.push('--outputs-dir', outputsDir);
                    }
                    if (outputs) {
                        args_1.push('--outputs', outputs);
                    }
                    if (recordVideo) {
                        args_1.push('--record-video');
                    }
                    if (devices) {
                        devices.forEach(function (device) {
                            args_1.push('--device', device);
                        });
                    }
                    if (maxTimeLimit) {
                        args_1.push('--max-time-limit', maxTimeLimit);
                    }
                    if (!adbEnabled) {
                        args_1.push("--no-adb");
                    }
                    if (adbBinary) {
                        args_1.push('--adb-binary', adbBinary);
                    }
                    if (proxyHost) {
                        args_1.push('--proxy-host', proxyHost);
                    }
                    if (proxyPort) {
                        args_1.push('--proxy-port', proxyPort);
                    }
                    if (proxyUser) {
                        args_1.push('--proxy-user', proxyUser);
                    }
                    if (proxyPass) {
                        args_1.push('--proxy-password', proxyPass);
                    }
                    if (dnsServers.length > 0) {
                        dnsServers.forEach(function (server) {
                            args_1.push('--dns-server', server);
                        });
                    }
                    if (dnsOverrides.length > 0) {
                        dnsOverrides.forEach(function (override) {
                            args_1.push('--dns-override', override);
                        });
                    }
                    if (egressTunnel) {
                        args_1.push('--egress-tunnel');
                    }
                    if (egressLocalhostFwdIp) {
                        args_1.push('--egress-localhost-fwd-ip', egressLocalhostFwdIp);
                    }
                    (0, core_1.info)("Starting ew-cli");
                    ewCli = (0, node_child_process_1.spawn)('ew-cli', args_1);
                    stdout = ewCli.stdout;
                    stderr = ewCli.stderr;
                    stdout.on('data', function (data) {
                        (0, core_1.info)("".concat(data));
                    });
                    stderr.on('data', function (data) {
                        (0, core_1.info)("".concat(data));
                    });
                    return [4, waitForJson(stdout, adbEnabled, devices.length)];
                case 1:
                    adbPorts = _a.sent();
                    (0, core_1.info)("Finished waiting for adb");
                    setOutputs(adbPorts);
                    (0, core_1.saveState)("ew_cli_pid", ewCli.pid);
                    ewCli.unref();
                    process.exit(0);
                    return [3, 3];
                case 2:
                    e_1 = _a.sent();
                    (0, core_1.warning)("ew-cli invoke failed: ".concat(e_1));
                    (0, core_1.setFailed)(e_1);
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
}
function setOutputs(adbPorts) {
    if (adbPorts === null) {
        return;
    }
    (0, core_1.setOutput)('adb_attached', adbPorts.attachedEvents.map(function (v) { return v.port; }).join(','));
    (0, core_1.setOutput)('adb_attached_json', JSON.stringify(adbPorts.attachedEvents));
    (0, core_1.setOutput)('adb_port_forwarded', adbPorts.forwardedEvents.map(function (v) { return v.port; }).join(','));
    (0, core_1.setOutput)('adb_port_forwarded_json', JSON.stringify(adbPorts.forwardedEvents));
}
function waitForJson(stdout, adbEnabled, numberOfDevices) {
    return new Promise(function (resolve, _) {
        var attachedEvents = [];
        var forwardedEvents = [];
        stdout.on('data', function (data) {
            try {
                var ewCliEvent = JSON.parse(data);
                switch (ewCliEvent.type) {
                    case 'adb_attached':
                        attachedEvents.push(ewCliEvent);
                        break;
                    case 'adb_port_forwarded':
                        forwardedEvents.push(ewCliEvent);
                        break;
                }
                var size = adbEnabled ? attachedEvents.length : forwardedEvents.length;
                if (size >= numberOfDevices) {
                    resolve({ attachedEvents: attachedEvents, forwardedEvents: forwardedEvents });
                }
            }
            catch (e) {
                (0, core_1.warning)(e);
            }
        });
        setTimeout(function () { return resolve(null); }, WAIT_TIMEOUT);
    });
}
invoke();
//# sourceMappingURL=index.js.map