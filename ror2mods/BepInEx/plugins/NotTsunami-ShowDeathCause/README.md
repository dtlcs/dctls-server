# ShowDeathCause
This mod lets you know how your and your friends miserable lives ended. This is based on the original [ShowDeathCause](https://github.com/Storm312/ShowDeathCause) with some improvements.

## Features
The death notice is now accompanied by a message letting everyone know what killed you and how. This fork provides the following improvements over the old version:
- Works with the latest game version as of the anniversary update
- Prints the name of the person who died and the damage taken

## Installation
1. Install [BepInEx](https://thunderstore.io/package/bbepis/BepInExPack/) and [R2API](https://thunderstore.io/package/tristanmcpherson/R2API/).
2. Copy the included `ShowDeathCause.dll` into the resulting `C:\Program Files (x86)\Steam\steamapps\common\Risk of Rain 2\BepInEx\plugins` folder.
3. Launch the game and enjoy! To remove you simply need to delete the `ShowDeathCause.dll` file.

## Changelog
### Version 1.0.5
- Switched to local stripped libs instead of relying on game's installation
    - Fewer binaries are included as well now
- Updated for anniversary update

### Version 1.0.4
- Updated for Risk of Rain 2 version 1.0

### Version 1.0.3
- Catch case where there are no attackers

### Version 1.0.2
- Artifacts update!
- Removed enemy skill and capped float value to 2 decimal points

## Credits to the Original Authors
[MOV-MB](https://github.com/MOV-MB)
[MagnusMagnuson](https://thunderstore.io/package/MagnusMagnuson/)

[Skull icon](https://icons8.com/icons/set/skull) by [Icons8](https://icons8.com).
