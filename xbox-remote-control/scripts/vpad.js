// Virtual gamepad for the Xbox Remote Play page (xbox.com/play/consoles/...).
// Run this whole file once in the page with the browser's page-script tool. Idempotent.
// The stream only accepts gamepad input, so this presents a standard-mapping pad to the page.
(() => {
  if (window.xb) return 'xb already installed';

  const BUTTONS = {
    a: 0, b: 1, x: 2, y: 3, lb: 4, rb: 5, lt: 6, rt: 7,
    view: 8, menu: 9, ls: 10, rs: 11,
    up: 12, down: 13, left: 14, right: 15, nexus: 16,
  };
  const AXES = { lx: 0, ly: 1, rx: 2, ry: 3 };
  const idle = () => ({ pressed: false, touched: false, value: 0 });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const pad = {
    id: 'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
    index: 0,
    connected: true,
    mapping: 'standard',
    timestamp: performance.now(),
    axes: [0, 0, 0, 0],
    buttons: Array.from({ length: 17 }, idle),
    vibrationActuator: null,
    hapticActuators: [],
  };

  navigator.getGamepads = () => [pad, null, null, null];
  const connected = new Event('gamepadconnected');
  connected.gamepad = pad;
  window.dispatchEvent(connected);

  // Why: the stream client resends pad state when the timestamp changes. Without a steady tick,
  // a lost press or release packet left the button stuck and later presses were ignored in games.
  const tick = setInterval(() => { pad.timestamp = performance.now(); }, 8);

  const index = (name) => {
    const i = typeof name === 'number' ? name : BUTTONS[String(name).toLowerCase()];
    if (i === undefined) throw new Error('unknown button: ' + name);
    return i;
  };

  const xb = {
    pad,
    BUTTONS,
    // Press a button `times` times. 220 ms hold and 500 ms gap were reliable in game menus.
    async press(name, times = 1, holdMs = 220, gapMs = 500) {
      const i = index(name);
      for (let n = 0; n < times; n++) {
        pad.buttons[i] = { pressed: true, touched: true, value: 1 };
        await sleep(holdMs);
        pad.buttons[i] = idle();
        await sleep(gapMs);
      }
      return times;
    },
    // Press several different buttons in order, e.g. xb.seq(['down', 'down', 'a']).
    async seq(names, holdMs = 220, gapMs = 500) {
      for (const name of names) await xb.press(name, 1, holdMs, gapMs);
      return names.length;
    },
    // Flick a stick axis to -1 or +1 briefly. One flick moves a settings slider one step.
    async flick(axis = 'lx', dir = -1, times = 1, holdMs = 150, gapMs = 450) {
      const a = typeof axis === 'number' ? axis : AXES[axis];
      if (a === undefined) throw new Error('unknown axis: ' + axis);
      for (let n = 0; n < times; n++) {
        pad.axes[a] = dir;
        await sleep(holdMs);
        pad.axes[a] = 0;
        await sleep(gapMs);
      }
      return times;
    },
    // Magnify the stream for screenshots. ox/oy are 0..1 anchors; scale 1 (or no args) resets.
    zoom(ox = 0, oy = 0, scale = 1) {
      const v = document.querySelector('video');
      if (!v) return 'no video element';
      v.style.transformOrigin = ox * 100 + '% ' + oy * 100 + '%';
      v.style.transform = scale === 1 ? '' : 'scale(' + scale + ')';
      return 'zoom ' + scale;
    },
    status() {
      const v = document.querySelector('video');
      return {
        pad: navigator.getGamepads()[0] === pad,
        video: !!v,
        stream: v ? v.videoWidth + 'x' + v.videoHeight : null,
        path: location.pathname,
      };
    },
    // Stop the tick and release everything (the page keeps the pad until reload).
    stop() {
      clearInterval(tick);
      pad.buttons = Array.from({ length: 17 }, idle);
      pad.axes = [0, 0, 0, 0];
      return 'stopped';
    },
  };

  window.xb = xb;
  return 'xb installed';
})();
