# Forward Education D-Pad Module — MakeCode Extension

MakeCode extension for the Forward Education Jacdac **D-Pad module** — four
momentary tactile switches in a cross (up / down / left / right).

## Usage

### Import the extension

In MakeCode for micro:bit (V2):

1. Open **Extensions** in the toolbox
2. Paste this repository's URL and search
3. Add the extension — a **fwdSensors** category appears in the toolbox

### Blocks

| Block | Returns |
|---|---|
| `dpad1 up is pressed` | boolean — true while held |
| `dpad1 any direction is pressed` | boolean |
| `dpad1 horizontal` | `-1` left, `0` none, `1` right |
| `dpad1 vertical` | `1` up, `0` none, `-1` down |
| `on dpad1 up pressed` | event |
| `on dpad1 up released` | event |
| `on dpad1 changed` | event, any direction |
| `dpad1 raw button bitmask` | advanced |

> **Note on `vertical`: up is positive.** This deliberately inverts the Jacdac
> Gamepad service, which reports y in screen coordinates (y grows downward, so raw
> up is `-1`). We flip it so `up` reads `+1`, because the common classroom use is
> driving a motor or sprite forward and "up gives a negative number" is a reliable
> source of confusion. `horizontal` needs no such flip — left is `-1`, right is
> `+1` either way. If you need the raw service value, the vendored client's `y()`
> is still there.

### Example

```blocks
fwdSensors.dpad1.fwdOnPressed(FwdDpadDirection.Up, function () {
    basic.showArrow(ArrowNames.North)
})
fwdSensors.dpad1.fwdOnReleased(FwdDpadDirection.Up, function () {
    basic.clearScreen()
})
```

## How it works

The module advertises a **single Jacdac Gamepad service** (`0x108f7456`) in
digital mode, not four separate Button services. That means **one role to bind**
(`dpad1`) instead of four, and simultaneous presses — diagonals — arrive together
in one bitmask rather than as separate racing events.

### Why the Gamepad client is vendored here

The upstream `jacdac-gamepad` extension declares
`"supportedTargets": ["arcade"]`, so MakeCode refuses to add it to a micro:bit
project — even though nothing in its client is actually arcade-specific.
`gamepad-constants.ts` and `gamepad-client.ts` are therefore near-verbatim copies
of pxt-jacdac v1.9.42, kept close to the originals so they stay easy to diff when
the pin is bumped. Put new behaviour in `fwd-dpad.ts`, not in those two files.

### Per-direction events

The Gamepad service only emits one "buttons changed" event carrying the whole
bitmask, so per-direction pressed/released edges are derived in `fwd-dpad.ts` by
diffing masks. Both the change event and a 50 ms background poll drive that diff —
the event for responsiveness, the poll to cover the race where the event arrives
before the reading register has refreshed. The diff only fires on a real edge, so
the two drivers cannot double-report.

## Related repositories

| Repo | Role |
|---|---|
| [hw-dpad](https://github.com/Forward-Education/hw-dpad) | KiCad hardware, BOM, fab package |
| `firmware` | on-module firmware, target `fwd-dpad` |
