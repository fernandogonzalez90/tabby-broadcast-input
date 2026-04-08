import { Injectable, NgModule } from '@angular/core'
import { AppService, SplitTabComponent } from 'tabby-core'
import { BaseTerminalTabComponent } from 'tabby-terminal'

const STYLE_ID = 'tabby-broadcast-input-style'
const BAR_ID = 'tabby-broadcast-input-bar'

@Injectable({ providedIn: 'root' })
class BroadcastInputService {
    private inputElement: HTMLInputElement | null = null

    constructor (private app: AppService) {
        this.app.ready$.subscribe(() => {
            this.installUI()
        })
    }

    private installUI (): void {
        if (document.getElementById(BAR_ID)) {
            return
        }

        this.installStyles()

        const bar = document.createElement('div')
        bar.id = BAR_ID

        const input = document.createElement('input')
        input.type = 'text'
        input.placeholder = 'Comando para enviar a todas las tabs (ej: sudo systemctl restart nginx)'

        const sendButton = document.createElement('button')
        sendButton.type = 'button'
        sendButton.textContent = 'Enviar'

        const send = () => this.broadcastCommand()
        sendButton.addEventListener('click', send)
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault()
                send()
            }
        })

        bar.appendChild(input)
        bar.appendChild(sendButton)
        document.body.appendChild(bar)
        document.body.classList.add('tabby-broadcast-input-enabled')
        this.inputElement = input
    }

    private installStyles (): void {
        if (document.getElementById(STYLE_ID)) {
            return
        }

        const style = document.createElement('style')
        style.id = STYLE_ID
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
        `

        document.head.appendChild(style)
    }

    private getAllTerminalTabs (): BaseTerminalTabComponent[] {
        const result: BaseTerminalTabComponent[] = []

        for (const tab of this.app.tabs) {
            if (tab instanceof BaseTerminalTabComponent) {
                result.push(tab)
                continue
            }

            if (tab instanceof SplitTabComponent) {
                for (const child of tab.getAllTabs()) {
                    if (child instanceof BaseTerminalTabComponent) {
                        result.push(child)
                    }
                }
            }
        }

        return result
    }

    private broadcastCommand (): void {
        const rawCommand = this.inputElement?.value.trim() ?? ''
        if (!rawCommand) {
            return
        }

        const payload = rawCommand.endsWith('\n') ? rawCommand : `${rawCommand}\n`

        for (const terminalTab of this.getAllTerminalTabs()) {
            terminalTab.sendInput(payload)
        }

        if (this.inputElement) {
            this.inputElement.select()
        }
    }
}

@NgModule({
    providers: [BroadcastInputService],
})
export default class BroadcastInputModule {
    constructor (_broadcastInput: BroadcastInputService) { }
}