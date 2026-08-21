// Manual smoke test for the Forward Education D-Pad extension.
// Shows an arrow while a direction is held, and clears it on release.

fwdSensors.dpad1.fwdOnPressed(FwdDpadDirection.Up, function () {
    basic.showArrow(ArrowNames.North)
})
fwdSensors.dpad1.fwdOnPressed(FwdDpadDirection.Down, function () {
    basic.showArrow(ArrowNames.South)
})
fwdSensors.dpad1.fwdOnPressed(FwdDpadDirection.Left, function () {
    basic.showArrow(ArrowNames.West)
})
fwdSensors.dpad1.fwdOnPressed(FwdDpadDirection.Right, function () {
    basic.showArrow(ArrowNames.East)
})

fwdSensors.dpad1.fwdOnReleased(FwdDpadDirection.Up, function () {
    basic.clearScreen()
})
fwdSensors.dpad1.fwdOnReleased(FwdDpadDirection.Down, function () {
    basic.clearScreen()
})
fwdSensors.dpad1.fwdOnReleased(FwdDpadDirection.Left, function () {
    basic.clearScreen()
})
fwdSensors.dpad1.fwdOnReleased(FwdDpadDirection.Right, function () {
    basic.clearScreen()
})

// Polled style: plot a dot that the pad steers around the LED matrix.
// NOTE: this fights the event handlers above for the display — comment out one
// section or the other when running this by hand.
let px = 2
let py = 2
basic.forever(function () {
    px = Math.max(0, Math.min(4, px + fwdSensors.dpad1.fwdHorizontal()))
    // SUBTRACT: fwdVertical() returns +1 for up, but led.plot()'s y grows
    // downward, so adding it would move the dot the wrong way.
    py = Math.max(0, Math.min(4, py - fwdSensors.dpad1.fwdVertical()))
    basic.clearScreen()
    led.plot(px, py)
    basic.pause(150)
})
