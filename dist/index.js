"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const tabby_core_1 = require("tabby-core");
const tabby_terminal_1 = require("tabby-terminal");
const STYLE_ID = 'tabby-broadcast-input-style';
const BAR_ID = 'tabby-broadcast-input-bar';
let BroadcastInputService = class BroadcastInputService {
    constructor(app) {
        this.app = app;
        this.inputElement = null;
        this.app.ready$.subscribe(() => {
            this.installUI();
        });
    }
    installUI() {
        if (document.getElementById(BAR_ID)) {
            return;
        }
        this.installStyles();
        const bar = document.createElement('div');
        bar.id = BAR_ID;
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Comando para enviar a todas las tabs (ej: sudo systemctl restart nginx)';
        const sendButton = document.createElement('button');
        sendButton.type = 'button';
        sendButton.textContent = 'Enviar';
        const send = () => this.broadcastCommand();
        sendButton.addEventListener('click', send);
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                send();
            }
        });
        bar.appendChild(input);
        bar.appendChild(sendButton);
        document.body.appendChild(bar);
        document.body.classList.add('tabby-broadcast-input-enabled');
        this.inputElement = input;
    }
    installStyles() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            body.tabby-broadcast-input-enabled {
                padding-bottom: 54px;
            }

            #${BAR_ID} {
                position: fixed;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 100000;
                display: flex;
                gap: 8px;
                align-items: center;
                padding: 8px;
                border-top: 1px solid rgba(255, 255, 255, 0.15);
                background: rgba(16, 18, 22, 0.96);
                backdrop-filter: blur(6px);
            }

            #${BAR_ID} input {
                flex: 1;
                min-width: 200px;
                padding: 8px 10px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.08);
                color: #ffffff;
                outline: none;
            }

            #${BAR_ID} input:focus {
                border-color: #4ea1ff;
                box-shadow: 0 0 0 2px rgba(78, 161, 255, 0.2);
            }

            #${BAR_ID} button {
                padding: 8px 14px;
                border: 1px solid #2f8cff;
                border-radius: 8px;
                background: #2f8cff;
                color: #ffffff;
                font-weight: 600;
                cursor: pointer;
            }

            #${BAR_ID} button:hover {
                background: #1e7ef7;
            }
        `;
        document.head.appendChild(style);
    }
    getAllTerminalTabs() {
        const result = [];
        for (const tab of this.app.tabs) {
            if (tab instanceof tabby_terminal_1.BaseTerminalTabComponent) {
                result.push(tab);
                continue;
            }
            if (tab instanceof tabby_core_1.SplitTabComponent) {
                for (const child of tab.getAllTabs()) {
                    if (child instanceof tabby_terminal_1.BaseTerminalTabComponent) {
                        result.push(child);
                    }
                }
            }
        }
        return result;
    }
    broadcastCommand() {
        var _a, _b;
        const rawCommand = (_b = (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.value.trim()) !== null && _b !== void 0 ? _b : '';
        if (!rawCommand) {
            return;
        }
        const payload = rawCommand.endsWith('\n') ? rawCommand : `${rawCommand}\n`;
        for (const terminalTab of this.getAllTerminalTabs()) {
            terminalTab.sendInput(payload);
        }
        if (this.inputElement) {
            this.inputElement.select();
        }
    }
};
BroadcastInputService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' }),
    __metadata("design:paramtypes", [tabby_core_1.AppService])
], BroadcastInputService);
let BroadcastInputModule = class BroadcastInputModule {
    constructor(_broadcastInput) { }
};
BroadcastInputModule = __decorate([
    (0, core_1.NgModule)({
        providers: [BroadcastInputService],
    }),
    __metadata("design:paramtypes", [BroadcastInputService])
], BroadcastInputModule);
exports.default = BroadcastInputModule;
