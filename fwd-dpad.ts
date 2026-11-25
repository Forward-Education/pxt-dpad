/**
 * Forward Education D-Pad Module — MakeCode Extension
 *
 * Student-friendly blocks for the Forward Education Jacdac D-Pad module: four
 * momentary switches (up / down / left / right) exposed as a single Jacdac
 * Gamepad service (0x108f7456) in digital mode.
 *
 * The whole pad is ONE Jacdac service, so there is one role to bind in class
 * ("dpad1") rather than four separate button roles.
 *
 * Wraps the vendored Gamepad client in gamepad-client.ts.
 */

enum FwdDpadDirection {
    //% block="up"
    Up = 0x2,
    //% block="down"
    Down = 0x8,
    //% block="left"
    Left = 0x1,
    //% block="right"
    Right = 0x4,
}

// One registered press/release callback.
class FwdDpadSubscription {
    mask: number
    onPress: boolean
    handler: () => void

    constructor(mask: number, onPress: boolean, handler: () => void) {
        this.mask = mask
        this.onPress = onPress
        this.handler = handler
    }
}

// The D-pad's blocks are shown in the Buttons drawer, next to the rotary dial:
// each block carries blockNamespace="fwdButtons". The code name stays
// fwdSensors.dpad1 so programs written against v0.1.1 and earlier still work.
//
// This Buttons drawer declaration is copied verbatim from
// pxt-fwd-base/common/drawers.ts, so the drawer looks the same whether or not
// fwd-base is loaded too. Do not change it without changing fwd-base to match.
// (Up to v0.1.1 this file set its own colour, weight and groups on the shared
// Sensors drawer, which competed with fwd-base's settings in combined kits.)
//% block="Buttons"
//% color=#00A660
//% icon=""
//% weight=203
namespace fwdButtons {}

namespace fwdSensors {

    //% fixedInstances
    export class FwdDpadClient extends modules.GamepadClient {
        private subscriptions: FwdDpadSubscription[] = []
        private lastMask: number = 0
        private watching: boolean = false

        constructor(role: string) {
            super(role)
        }

        /**
         * Compares the current button mask against the last one seen and fires
         * any handler whose direction just changed state.
         *
         * Safe to call as often as we like: it only fires on an actual edge, so
         * the event hook and the polling backstop below can both drive it
         * without producing duplicate events.
         */
        private checkEdges(): void {
            const current = this.buttons()
            const previous = this.lastMask
            if (current == previous) return
            this.lastMask = current

            const pressed = current & ~previous
            const released = previous & ~current

            for (let i = 0; i < this.subscriptions.length; i++) {
                const sub = this.subscriptions[i]
                const changed = sub.onPress ? pressed : released
                if (changed & sub.mask) sub.handler()
            }
        }

        /**
         * The Gamepad service only reports "buttons changed" with the whole
         * bitmask, so per-direction pressed/released edges are derived here.
         *
         * Both a change event and a 50 ms poll drive checkEdges(): the event
         * gives a fast response, and the poll covers the race where the event
         * arrives before the reading register has been refreshed.
         */
        private startWatching(): void {
            if (this.watching) return
            this.watching = true

            this.setStreaming(true)
            this.lastMask = this.buttons()

            this.onButtonsChanged(() => this.checkEdges())

            control.inBackground(() => {
                while (true) {
                    this.checkEdges()
                    pause(50)
                }
            })
        }

        /**
         * True while the given direction is being held down.
         */
        //% blockId=fwd_dpad_is_pressed
        //% block="$this $direction is pressed"
        //% blockNamespace="fwdButtons" group="D-pad"
        //% weight=95
        fwdIsPressed(direction: FwdDpadDirection): boolean {
            // Pure numeric test rather than the inherited isButtonDown(), which
            // takes a jacdac.GamepadButtons-typed parameter — passing a plain
            // number into an enum-typed param is a compile risk in Static
            // TypeScript. Each FwdDpadDirection is a single bit, so != 0 is
            // equivalent to isButtonDown's (buttons & b) == b.
            return (this.buttons() & (direction as number)) != 0
        }

        /**
         * True while any of the four directions is being held down.
         */
        //% blockId=fwd_dpad_any_pressed
        //% block="$this any direction is pressed"
        //% blockNamespace="fwdButtons" group="D-pad"
        //% weight=90
        fwdAnyPressed(): boolean {
            return this.buttons() != 0
        }

        /**
         * Horizontal direction: -1 for left, 1 for right, 0 for neither.
         */
        //% blockId=fwd_dpad_x
        //% block="$this horizontal"
        //% blockNamespace="fwdButtons" group="D-pad"
        //% weight=85
        fwdHorizontal(): number {
            const mask = this.buttons()
            if (mask & FwdDpadDirection.Left) return -1
            if (mask & FwdDpadDirection.Right) return 1
            return 0
        }

        /**
         * Vertical direction: 1 for up, -1 for down, 0 for neither.
         *
         * NOTE: this deliberately INVERTS the Jacdac Gamepad service convention.
         * The service reports y in screen coordinates, where y grows downward, so
         * raw up is -1. We flip it so that **up is positive**, because the common
         * classroom use is driving a motor or sprite forward, and "up gives a
         * negative number" trips students up every time.
         *
         * Do not "fix" this back to match the service. If you need the raw
         * service value, use the inherited y() from the vendored Gamepad client.
         */
        //% blockId=fwd_dpad_y
        //% block="$this vertical"
        //% blockNamespace="fwdButtons" group="D-pad"
        //% weight=80
        fwdVertical(): number {
            const mask = this.buttons()
            if (mask & FwdDpadDirection.Up) return 1
            if (mask & FwdDpadDirection.Down) return -1
            return 0
        }

        /**
         * Run code when a direction is pressed down.
         */
        //% blockId=fwd_dpad_on_pressed
        //% block="on $this $direction pressed"
        //% blockNamespace="fwdButtons" group="D-pad"
        //% weight=110
        fwdOnPressed(direction: FwdDpadDirection, handler: () => void): void {
            this.subscriptions.push(
                new FwdDpadSubscription(direction as number, true, handler)
            )
            this.startWatching()
        }

        /**
         * Run code when a direction is released.
         */
        //% blockId=fwd_dpad_on_released
        //% block="on $this $direction released"
        //% blockNamespace="fwdButtons" group="D-pad"
        //% weight=105
        fwdOnReleased(direction: FwdDpadDirection, handler: () => void): void {
            this.subscriptions.push(
                new FwdDpadSubscription(direction as number, false, handler)
            )
            this.startWatching()
        }

        /**
         * Run code whenever any direction is pressed or released.
         */
        //% blockId=fwd_dpad_on_changed
        //% block="on $this changed"
        //% blockNamespace="fwdButtons" group="D-pad"
        //% weight=100
        fwdOnChanged(handler: () => void): void {
            this.onButtonsChanged(handler)
        }

        /**
         * The raw bitmask of held directions. Advanced: prefer the
         * "is pressed" block.
         */
        //% blockId=fwd_dpad_raw
        //% block="$this raw button bitmask"
        //% blockNamespace="fwdButtons" group="D-pad"
        //% weight=50
        fwdRawButtons(): number {
            return this.buttons()
        }
    }

    //% fixedInstance whenUsed weight=1 block="dpad1"
    export const dpad1 = new FwdDpadClient("dpad1")
}
