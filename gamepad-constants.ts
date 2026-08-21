/**
 * Jacdac Gamepad service constants.
 *
 * VENDORED from jacdac/pxt-jacdac/gamepad/constants.ts @ v1.9.42.
 *
 * Why vendored instead of depended on: the upstream `jacdac-gamepad` extension
 * declares `"supportedTargets": ["arcade"]`, so MakeCode refuses to add it to a
 * micro:bit project — even though nothing in it is actually arcade-specific.
 * Keep this file a verbatim copy so it stays easy to diff against upstream when
 * pxt-jacdac is bumped.
 */
namespace jacdac {
    // Service Gamepad constants
    export const SRV_GAMEPAD = 0x108f7456

    export const enum GamepadButtons { // uint32_t
        //% block="left"
        Left = 0x1,
        //% block="up"
        Up = 0x2,
        //% block="right"
        Right = 0x4,
        //% block="down"
        Down = 0x8,
        //% block="a"
        A = 0x10,
        //% block="b"
        B = 0x20,
        //% block="menu"
        Menu = 0x40,
        //% block="select"
        Select = 0x80,
        //% block="reset"
        Reset = 0x100,
        //% block="exit"
        Exit = 0x200,
        //% block="x"
        X = 0x400,
        //% block="y"
        Y = 0x800,
    }

    export const enum GamepadVariant { // uint8_t
        //% block="thumb"
        Thumb = 0x1,
        //% block="arcade ball"
        ArcadeBall = 0x2,
        //% block="arcade stick"
        ArcadeStick = 0x3,
        //% block="gamepad"
        Gamepad = 0x4,
    }

    export const enum GamepadReg {
        /**
         * If the gamepad is analog, the directional buttons should be "simulated",
         * based on gamepad position. If the gamepad is digital, then each direction
         * will read as either `-1`, `0`, or `1` (in fixed representation).
         */
        Direction = 0x101,

        /**
         * Constant Variant (uint8_t). The type of physical gamepad.
         */
        Variant = 0x107,

        /**
         * Constant Buttons (uint32_t). Bitmask of the buttons mounted on the gamepad.
         * If Left/Up/Right/Down are marked available, the gamepad is digital.
         */
        ButtonsAvailable = 0x180,
    }

    export namespace GamepadRegPack {
        export const Direction = "u32 i1.15 i1.15"
        export const Variant = "u8"
        export const ButtonsAvailable = "u32"
    }

    export const enum GamepadEvent {
        /**
         * Argument: buttons Buttons (uint32_t). Emitted whenever the state of
         * buttons changes.
         */
        //% block="buttons changed"
        ButtonsChanged = 0x3,
    }

    export namespace GamepadEventPack {
        export const ButtonsChanged = "u32"
    }
}
