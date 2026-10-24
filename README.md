# Oddspedia Hockey League Filter

A Tampermonkey userscript that filters the game list on
[Oddspedia Ice Hockey](https://oddspedia.com/ice-hockey).

It automatically expands the full game list, keeps selected competitions, and
hides every other competition header and its games.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open `oddspedia-hockey-league-filter.user.js`.
3. Copy its contents into a new Tampermonkey script.
4. Save the script and reload Oddspedia's ice-hockey page.

## Included competitions

- NHL
- AHL
- KHL
- SHL
- Liiga
- DEL
- Czech Extraliga
- Swiss NLA / National League
- Champions Hockey League
- IIHF World Championship
- Poland Ekstraliga
- NCAA

The allowlist is `ALLOWED_HEADERS` in the userscript. Matches use the complete
Oddspedia card header, so similarly named competitions such as DEL 2 and Liiga
Women remain hidden.
