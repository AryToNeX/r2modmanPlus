# r2modman

[![Discord](https://img.shields.io/discord/727304496522461185?label=r2modman%20Discord&style=for-the-badge)](https://discord.gg/jE2zWHY)

[![GitHub](https://img.shields.io/github/license/ebkr/r2modmanPlus?color=orange&style=for-the-badge)](https://github.com/ebkr/r2modmanPlus)

| [Features](#features) | [What is a mod manager?](#what-is-a-mod-manager) | [Installing](#installing) | [Help](#help) | [Feedback and suggestions](#feedback-and-suggestions) | [Changelog](#changelog) | [Screenshots](#screenshots) |
|---|---|---|---|---|---|---|

## Features
- A clean user interface designed to make modding as simple as possible.
- Safer mod installs allowing you to play the game through Steam normally.
- Mod profiles to switch between different sets of mods quickly and easily.
- Export profiles to easily share both your mods and configs with friends.
- Download and install mods directly from the manager.
- View and update any outdated mods.
- Edit configs directly from the manager.
- Manager auto-updates.
- And more!

## What is a mod manager?
It's quite simple really, a mod manager is an application to make it easier to control which mods you have installed.

You can choose to update, enable/disable or even uninstall mods with a simple click, all whilst keeping it available on another profile.

## Installing

### First time installing
#### Windows
#### Do not install r2modman inside the Risk of Rain 2 folder.
1. Click "Manual Download" on [Thunderstore](https://thunderstore.io/package/ebkr/r2modman/).
2. Inside the downloaded **.zip** file, run the "r2modman Setup X.X.X.exe" (where X.X.X is the current version).
3. Follow the steps in the installer.

#### Linux

For the game to be able to launch modded, you need to set your launch options on Risk of Rain 2 as follows: `WINEDLLOVERRIDES="winhttp=n,b" %command%`
<!-- 
Eventual one-command installs go here:
Example as follows
#### Arch Linux
```bash
yay -S r2modmanager-bin
```

#### Manual installation
-->
1. Click "Manual Download" on [Thunderstore](https://thunderstore.io/package/ebkr/r2modman/).
2. Inside the downloaded **.zip** file, trun the "r2modman X.X.X.AppImage". It's a portable installation, keep it somewhere safe!

### Updating
On Windows, r2modman will automatically download any available updates whilst you use it.

On Linux, you might have to update it by hand if your package manager doesn't include a package for it.

If an update has been downloaded, it will be installed once you have closed the application.

## Help
### Manager errors:
1. Check the [wiki](https://github.com/ebkr/r2modmanPlus/wiki).
2. If you can't find the solution, join the [modding discord server](https://discord.gg/5MbXZvd) and ask for help in the **#tech-support** channel.

### Mod errors:
1. Join the [modding discord server](https://discord.gg/5MbXZvd) and ask for help in the **#tech-support** channel.

## Feedback and suggestions
Feedback can help r2modman become the best mod manager for Risk of Rain 2.
It's encouraged to provide as much feedback as you'd like, and fully open to criticism.

Suggestions are welcome and there are already some suggestions that have made it in to the manager!
From small features such as always-expanded cards, all the way to larger features such as code-based profile exports.

The only thing you have to consider when suggesting a feature is the impact it will have on users who don't have a lot of experience with computers.

## Changelog
### 3.0.36
- Fixed issue where data directory is incorrect on first launch.
- Upgraded Electron version.

### 3.0.35
- Fixed issue where launch errors would not display.

### 3.0.34
- You can now launch the game directly from the config editor.
- True and false config options no longer require manual typing.
- Added NSFW flag to categories filter. NSFW mods are hidden by default.
- Sorting options on the installed tab are persistent between launches.

## Screenshots

Installed mod view

![](https://i.imgur.com/XNVQBuQ.png)

Downloadable mods

![](https://i.imgur.com/Do6Awz0.png)

Dark theme

![](https://i.imgur.com/szsyGWB.png)

Config editor

![](https://i.imgur.com/U9av2H7.png)

Profiles

![](https://i.imgur.com/HtWQIWZ.png)



