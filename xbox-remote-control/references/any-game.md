# Any game: finding and mapping settings without notes

Use this when `references/games/` has no file for the game. The input path is identical for every game; only the menu layout differs. Discover it by looking, then write it down.

## 1. Get to a safe screen

- Launch from the guide (recent list) or "My games & apps".
- Get past the title screen with A. Close news, promo, or store pop-ups with B. Decline anything that offers a purchase.
- Stop at the main menu or a lobby. Do not press A on Play, Quick Match, Continue, or any playlist: those start live play.
- If the game drops straight into gameplay (single-player games often resume a save), press Menu to pause before anything else.

## 2. Find the settings entry

Try these in order, with a screenshot after each:

1. Read the button-hint bar along the bottom or top edge. It usually names the settings button.
2. Press Menu (the three-line button). Most games open a pause or options panel.
3. Press View (the two-squares button) if Menu did nothing useful.
4. Look for a gear icon or the words Options, Settings, or Controls in the main menu list, a corner of the screen, or a side panel.
5. In a panel with icon tabs, move across with LB/RB or the d-pad until the gear tab is focused.

Avoid: file or install management screens (anything showing sizes in GB with Uninstall), store tabs, and account-linking pages.

Controller options are usually under a tab named Controller, Controls, Input, or Gamepad. Related groups: Aim or Sensitivity, Movement, Accessibility, Audio, Video or Graphics, Interface or HUD, Network or Account.

## 3. Map before changing

1. Screenshot each tab and sub-tab. Use `xb.zoom` so values are legible.
2. Record for each row: its name, current value, and control type (toggle, dropdown, slider, sub-screen).
3. Expand collapsed groups ("Show More", "Advanced") to see what they hide.
4. Note the step size of sliders from the focused row's tooltip, or by moving one step and moving back.
5. Note how the game saves: on exit, or with an explicit Apply button and confirm dialog.
6. Note any row that is locked or greyed out and why (another option usually controls it).

## 4. Work out the controls

Test on a harmless row first, one input at a time, looking after each:

- Does the d-pad move focus? If not, try the left stick with `xb.flick('ly', 1)`.
- On a slider, try d-pad right, then `xb.flick('lx', 1)`. Use whichever changes the value, then step back to the original.
- On a toggle, try A, then d-pad right.
- Check the hint bar for Reset, Apply, and Default buttons so they are not pressed by accident. "Reset All" and "Restore Defaults" are never pressed without the user asking.

## 5. Common conventions by control scheme

These are tendencies, not guarantees. The screen is the authority.

| Element | Usual input |
|---|---|
| Move focus | D-pad; left stick in some menus |
| Select / confirm | A |
| Back / cancel | B |
| Top-level tabs | LB / RB |
| Sub-tabs | LT / RT, or a second LB / RB row once inside |
| Slider | D-pad left/right, or left stick |
| Dropdown | A to open, d-pad to choose, A to confirm |
| Expand group | X or Y, per hint |
| Apply changes | X, Y, or Menu, per hint; confirm dialog follows |
| Open game options | Menu |
| Open Xbox guide | Nexus |

Cursor-driven menus (a free-moving pointer instead of focus highlights): move the pointer with held stick input. `xb.flick` with a longer hold, for example `xb.flick('lx', 1, 1, 600)`, moves it further; approach the target in short moves and screenshot between them.

## 6. Console-level settings

The Xbox Settings app follows system UI conventions and obeys the virtual pad without any takeover step. Useful areas: General (network, power, TV and display, volume and audio), Devices & connections (accessories, remote features), Preferences, Accessibility. The Xbox Accessories app (controller remapping, per-controller vibration and stick settings) is under My games & apps > Apps.

Do not change sign-in, security, passkey, payment, family, or privacy settings; those are for the user to change in person.

## 7. Write the notes file

After the session, create `references/games/<game-name>.md` (lowercase, hyphens) with:

```markdown
# <Game> settings: menu map

Observed <date>, <game version or season>, Xbox <model if known>.

## Getting to the settings
<numbered steps from launch to the settings page>

## Traps
<buttons or screens that buy, uninstall, start matches, or reset>

## Page layout
<tabs, sub-tabs, row order, control type and step size per row>

## How it saves
<on exit / Apply button / confirm dialog>

## Values applied
<before and after table, with date>

## Sources
<guides used for recommended values, with dates>
```

Keep account names, console names, and network addresses out of notes files.
