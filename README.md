# xbox-remote-control

An agent skill for operating an Xbox console from a computer: console settings and the menus of any game or app on it.

A retail Xbox exposes no LAN configuration API, so the skill uses Xbox Remote Play in a browser. The console streams its screen into a page, a small script presents a virtual gamepad to that page, and the agent reads screenshots to decide each press.

## What is in here

| Path | Purpose |
|---|---|
| `xbox-remote-control/SKILL.md` | The procedure: connect, take control, find settings, change, verify, hand back |
| `xbox-remote-control/scripts/vpad.js` | Virtual gamepad helper run inside the Remote Play page (`window.xb`) |
| `xbox-remote-control/references/any-game.md` | How to find and map settings in a game with no notes yet |
| `xbox-remote-control/references/games/` | One menu map per game already worked through |

## Requirements

- An Xbox with remote features enabled and Power mode set to Sleep.
- A Chromium-based browser tool the agent can drive: run page scripts, click, and take screenshots.
- The console owner signed in at xbox.com in that browser. The agent never handles the password.

## Install

Copy the `xbox-remote-control` folder into the skills directory your agent reads, for example:

```bash
cp -R xbox-remote-control ~/.claude/skills/
```

## Scope and limits

- Menus and settings only. No input during online or competitive play.
- No purchases, uninstalls, account or security changes.
- Every change is recorded before and after, and re-read after saving.

## Tested status

Run end to end on an Xbox Series console with Call of Duty: Warzone (November 2026). Other games use the same input path; their menus are discovered on first use with `references/any-game.md` and recorded under `references/games/`.
