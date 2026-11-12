---
name: xbox-remote-control
description: "This skill should be used when the user asks to control, configure, or change settings on their Xbox console or in any game or app running on it from the Mac or another computer: 'configure my Xbox', 'change my controller settings', 'set my settings in <any game>', 'set my Warzone sensitivity', 'adjust sensitivity or deadzones', 'turn off vibration', 'change graphics, audio, or HUD options on the Xbox', 'open settings on my Xbox', 'launch <game> on my Xbox'. Works with any console game: Call of Duty, Warzone, Fortnite, Apex Legends, EA FC, Forza, Minecraft, Halo, Rocket League, and others. Drives the console through Xbox Remote Play in a browser with an injected virtual gamepad, reading the screen from screenshots. Menus and settings only."
category: automation
risk: caution
source: local
tags: "[xbox, remote-play, gamepad, game-settings, console-settings, controller-settings, browser-automation]"
date_added: "2026-11-12"
---

# xbox-remote-control

## Purpose

See and operate the user's Xbox from a computer: the console's own settings and the menus of any game or app on it. A retail Xbox has no LAN configuration API and no open Device Portal, so the working path is Xbox Remote Play in a browser. The console streams its screen into a page, and a virtual gamepad injected into that page sends button presses. Screenshots are the eyes; the helper script is the hands.

Nothing here is specific to one game. The method is: connect, take control, discover the menu by looking, change values, verify, hand back. Per-game notes in `references/games/` only save discovery time.

Tested status: the full flow was run end to end on an Xbox Series console with Call of Duty: Warzone on 2026-11-12. Other games use the same input path but have not been run; expect to discover their menus on first use and record them.

## Hard limits

- Menus and settings only. Never send input during online or competitive play: automated input in live matches risks an account ban.
- Never type the Microsoft password or any other credential. The user signs in themself.
- Never press A on anything that buys, uninstalls, deletes, resets all settings, disconnects, or starts matchmaking. If unsure what A does on the focused item, take a screenshot first.
- Never confirm a purchase, subscription, or store prompt.
- Record the current value of every setting before changing it, and report before and after values to the user.
- Changing gameplay feel (button layout, sensitivity, aim curve, difficulty) is the user's call. Apply such changes only when the user asked for them, and say plainly what will feel different.

## Prerequisites (user actions)

1. On the Xbox: Settings > Devices & connections > Remote features > tick "Enable remote features"; Power mode set to Sleep.
2. In the browser: sign in at xbox.com with the Microsoft account that is on the console.

## Workflow

### 1. Connect

1. Open `https://www.xbox.com/en-US/remoteplay` in a Chromium browser tool that can run page scripts and take screenshots.
2. If the page shows "Sign in to finish setting up", stop and ask the user to sign in.
3. Click Connect on the console tile and wait about 20 seconds for the dashboard or the running app to appear.
4. Look before acting. If a match or other live play is on screen, send nothing and tell the user.
5. If the overlay "Click or tap here to continue playing" ever appears, click it, then re-read the screen: inputs sent while paused were lost.

### 2. Install the virtual gamepad

The stream ignores keyboard input. Run the contents of `scripts/vpad.js` once in the page with the browser's page-script tool. It is idempotent and exposes `window.xb`:

- `await xb.press('down', 3)` presses a button N times. Names: a, b, x, y, lb, rb, lt, rt, view, menu, ls, rs, up, down, left, right, nexus.
- `await xb.seq(['down', 'down', 'a'])` presses different buttons in order.
- `await xb.flick('lx', -1, 4)` flicks a stick N times (axis lx/ly/rx/ry, direction -1 or +1).
- `xb.zoom(0, 0.8, 2)` magnifies part of the stream so small text is readable in a screenshot; `xb.zoom()` resets.
- `xb.status()` reports whether the pad and the video element are present.

The helper bumps the pad timestamp every few milliseconds. Without that, repeated presses were mostly dropped inside games. A full page navigation removes the helper; run it again after reconnecting.

### 3. Reach the target

- Console settings: `xb.press('nexus')` opens the guide; Settings is listed there, or under the profile tab.
- A game or app: open the guide, pick it from the recent list, or go to "My games & apps" and select it. Launching a game is a normal A press on its tile.
- A game that is already running stays bound to the physical controller that started it and ignores the virtual pad, while the Xbox system UI still obeys. To take over: open the guide, press Menu on the game's tile, choose Quit, then launch it again with A. Skip the quit when the game is sitting at a title screen ("Press A to start"): pressing A there binds the virtual pad directly.

Tell the user before quitting a running game. Afterwards the game is bound to the virtual pad until it is restarted from the physical controller; say that in the final report.

### 4. Find the settings in a game you have no notes for

Check `references/games/` for a notes file first. If there is none, follow `references/any-game.md`: it covers where games usually keep settings, how to map an unfamiliar menu safely, and how to read the on-screen button hints. In short:

1. Get to the main menu or a lobby, never into a match.
2. Read the button-hint bar. Try the Menu button, then look for a gear icon or an "Options" / "Settings" entry.
3. Map the page before changing anything: note the tabs, the row order, and which control each row uses.
4. After the session, write what was learned to `references/games/<game-name>.md`.

### 5. Navigate with a look-act-look loop

1. Take a screenshot (or a zoomed one) and identify the focused item.
2. Send a small batch of presses.
3. Take another screenshot and confirm where focus landed before the next action.

Rules that prevented mistakes:

- Menus often reopen on the tab used last, not the first one. Confirm the tab and the focused row before changing a value.
- An occasional press or flick is dropped. After every change, re-read the value and correct it.
- For readable text, set the viewport to 1600x900 and use `xb.zoom`. Reset both when finished.
- Confirm that focus is on the intended option before pressing A in any dropdown or dialog.
- The same button can mean different things on different screens of one game. Trust the hint bar on the current screen, not memory.

### 6. Change settings

Controls vary by game. Read the hint on the focused row, then try the usual patterns in this order:

- Toggle: A, or d-pad left/right.
- Dropdown or list: A to open, d-pad to the option, screenshot, A to select.
- Slider: d-pad left/right in most games; where that does nothing, `xb.flick('lx', -1)` lowers by one step and `+1` raises. Make one step, read the value, then continue.
- Tabs: LB/RB for top-level tabs; LT/RT or a second LB/RB row for sub-tabs.
- Expandable groups and "show more": often X or Y, shown in the hint.
- Apply or save: some games save on exit, others need an explicit Apply (often X, Y, or Menu) and show a confirm dialog. Read it before confirming.

If a notice or warning dialog appears, read it and relay any trade-off it states to the user before confirming.

### 7. Verify and hand back

1. Back out with B until the main menu, lobby, or dashboard shows. Accept a "save changes" prompt only for the changes that were intended.
2. Reopen the same pages and re-read every changed value. Report only what was re-read.
3. Reset the zoom and the viewport. Leave the game in a menu or lobby, never in a queue or match.
4. Report: a before and after table, what was not tested (nothing here is tested in live play), and that the game is bound to the virtual pad.

## Researching recommended settings

When the user asks for "best" or "recommended" settings for a game:

1. Search for guides for the exact game, mode, platform, and current season or patch; prefer pages with an explicit update date.
2. Collect values from at least three independent sources per setting. Use the value most sources agree on; where they split, take the middle of the main cluster and say so.
3. Flag thin evidence (one or two sources) and any setting where sources recommend opposite things.
4. Map guide names to the names on screen; menus are renamed between versions.
5. Stick-minimum deadzones depend on the physical controller's drift, which cannot be tested remotely. Choose a moderate value and give the user the drift check: stand still for 10 seconds; if the view or character creeps, raise that stick's minimum by 1 or 2.

## Bundled resources

- `scripts/vpad.js`: the virtual gamepad helper to run in the Remote Play page.
- `references/any-game.md`: how to find and map settings in a game with no notes, common menu conventions, and the notes template.
- `references/games/`: one notes file per game already mapped. `call-of-duty-warzone.md` is the first.

## What does not work

- LAN control: only the media-renderer port is open on a retail console; Device Portal needs Dev Mode, which cannot run retail games.
- Keyboard input to the stream.
- Sending many presses without the timestamp tick, or without re-checking the screen.
- Powering the console on from fully off; Sleep power mode is required for Remote Play to wake it.
