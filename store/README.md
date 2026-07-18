# Chrome Web Store assets

Upload these from the [Developer Dashboard](https://chrome.google.com/webstore/devconsole) listing tab. They are **not** included in the extension zip (`pnpm zip`).

## Required sizes

| Asset | Path | Size |
|-------|------|------|
| Screenshot (min. 1) | `screenshots/*.png` | **1280×800** |
| Small promo tile | `promo/small-tile-440x280.png` | **440×280** |
| Store icon | `icon/128.png` | **128×128** |

Optional (not prepared): marquee promo **1400×560**, YouTube video.

## Screenshots (upload order)

1. `01-select-and-add.png` — select word + blue **+** button
2. `02-word-added.png` — success checkmark after add
3. `03-popup-signed-in.png` — signed-in popup
4. `04-extension-connected.png` — extension connected confirmation
5. `05-popup-sign-in.png` — sign-in prompt

## Notes

- Sources were 1024×640 (same 1.6 aspect); saved as exact **1280×800** for the Dashboard.
- Prefer production UI (`conozco.net`) when available; connect flow may still be from local until Store publish.
- Square corners, no fake device frames.
- Privacy policy for the listing: https://conozco.net/privacy-policy
