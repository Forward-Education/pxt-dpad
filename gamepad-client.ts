/**
 * Jacdac Gamepad service client.
 *
 * VENDORED from jacdac/pxt-jacdac/gamepad/client.ts @ v1.9.42, with two changes:
 *   1. the `gamepad1` fixedInstance export is dropped — pxt-dpad exposes its own
 *      `fwdSensors.dpad1` instead, so students don't see two competing blocks;
 *   2. block annotations are stripped from the raw accessors, because the
 *      student-facing blocks live in fwd-dpad.ts.
 *
 * See gamepad-constants.ts for why this is vendored rather than depended on.
 */
namespace modules {
    /**
     * A directional gamepad / D-pad.
     **/
    //% fixedInstances blockGap=8
    export class GamepadClient extends jacdac.SensorClient {
        private readonly _variant: jacdac.RegisterClient<
            [jacdac.GamepadVariant]
        >
        private readonly _buttonsAvailable: jacdac.RegisterClient<
            [jacdac.GamepadButtons]
        >

        constructor(role: string) {
            super(jacdac.SRV_GAMEPAD, role, "u32 i1.15 i1.15")

            this._variant = this.addRegister<[jacdac.GamepadVariant]>(
                jacdac.GamepadReg.Variant,
                jacdac.GamepadRegPack.Variant,
                jacdac.RegisterClientFlags.Optional |
                    jacdac.RegisterClientFlags.Const
            )
            this._buttonsAvailable = this.addRegister<[jacdac.GamepadButtons]>(
                jacdac.GamepadReg.ButtonsAvailable,
                jacdac.GamepadRegPack.ButtonsAvailable,
                jacdac.RegisterClientFlags.Const
            )
        }

        /**
         * Bitmask of the buttons currently held down.
         */
        //% callInDebugger
        buttons(): jacdac.GamepadButtons {
            this.setStreaming(true)
            const values = this._reading.pauseUntilValues() as any[]
            return values[0]
        }

        /**
         * Horizontal position, -100 (left) to 100 (right).
         */
        //% callInDebugger
        x(): number {
            this.setStreaming(true)
            const values = this._reading.pauseUntilValues() as any[]
            return values[1] * 100
        }

        /**
         * Vertical position, -100 (up) to 100 (down).
         */
        //% callInDebugger
        y(): number {
            this.setStreaming(true)
            const values = this._reading.pauseUntilValues() as any[]
            return values[2] * 100
        }

        /**
         * Indicates if the button (or combination of) is down.
         */
        //% callInDebugger
        isButtonDown(button: jacdac.GamepadButtons): boolean {
            const buttons = this.buttons()
            return (buttons & button) == button
        }

        /**
         * The type of physical gamepad.
         */
        //% callInDebugger
        variant(): jacdac.GamepadVariant {
            this.start()
            const values = this._variant.pauseUntilValues() as any[]
            return values[0]
        }

        /**
         * Bitmask of the buttons that are physically mounted.
         */
        //% callInDebugger
        buttonsAvailable(): jacdac.GamepadButtons {
            this.start()
            const values = this._buttonsAvailable.pauseUntilValues() as any[]
            return values[0]
        }

        /**
         * Register code to run when an event is raised.
         */
        onEvent(ev: jacdac.GamepadEvent, handler: () => void): void {
            this.registerEvent(ev, handler)
        }

        /**
         * Emitted whenever the state of buttons changes.
         */
        onButtonsChanged(handler: () => void): void {
            this.registerEvent(jacdac.GamepadEvent.ButtonsChanged, handler)
        }
    }
}
