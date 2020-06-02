# CKBSudoku

A simple, elegant Sudoku app created with the intention of providing a clean, ad-free experience. No fancy graphics or over the top animations, just Sudoku. This was designed with my mom in mind to fit her needs, but I thought everyone else could use it too, after all, who doesn't want a clean version of a classic time waster?

## Features

- 7 different difficulty levels ranging from easy to the theoretical minimum required amount of tiles to solve
- Automatic saving and optional continuing of last played game
- Row and Column Highlighting (to better communicate what you're looking for)
- Highlighting every instance of a number when you hover over it

**Implementation in progress**
- Autofill if only one number is missing
- The ability to add "maybes" (Markers that can help keep track of possibilities in a square)

**Planned, not yet implemented**

- Daily Board with leaderboard of fastest times, how am I going to do this securely will pose an issue, don't want to be spammed with 0.00s wins after all
- Hints 
- UI Scaling, because people with vision impairment and 4k monitors deserve to play the game too*
- Different control options, so that you can play on a touchscreen or without a keyboard*

*More Important

## Install

*macOS 10.10+, Linux, and Windows 7+ are supported (64-bit only).*

**macOS**

[**Download**](https://github.com/coppyhop/ckbsudoku/releases/latest) the `.dmg` file.

**Linux**

[**Download**](https://github.com/coppyhop/ckbsudoku/releases/latest) the `.AppImage` or `.deb` file.

*The AppImage needs to be [made executable](http://discourse.appimage.org/t/how-to-make-an-appimage-executable/80) after download.*

**Windows**

[**Download**](https://github.com/coppyhop/ckbsudoku/releases/latest) the `.exe` file.


## Building

This is an app I built with [Electron](https://electronjs.org), this means you require a working [NodeJS](https://nodejs.org/en/) install on the machine you wish to build it on. NodeJS is available from your distros package manager, macports, homebrew, or just downloaded on the site.
To build this, clone the repositors and go into the directory you cloned to. Then do
```
$ npm install
$ npm run dist-[platformname]
```
e.g.
```
$ npm run dist-macos
```

Inside the "dist" directory you should be able to find a binary built for your specific OS. Note: Cross-Compilation is *not* recommended. If you can please compile it on the same platform you intend to run it on.

### Run

If you would like to run this as an npm app instead of as a indenpendent binary, simply clone the repository, go into the directory and run
```
$ npm install
$ npm start
```

### Mobile version?
Currently I do not have the funds to even get certs to sign windows and mac builds, I'd need to pay for android and ios certs to even release on the platforms. As someone with no job currently it probably isn't going to happen in the near future. If this gets popular enough, maybe.
But I doubt this will actually go anywhere to be honest.

### Special thanks
To my mom for giving me the idea of this project (something to do in these boring times), and to robatron, creator of [sudoku.js](https://github.com/robatron/sudoku.js/) whose work made it much easier to create the game.
