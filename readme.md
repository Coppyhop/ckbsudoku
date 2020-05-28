# CKBSudoku

> A simple, elegant Sudoku app created with the intention of providing a clean, ad-free experience. No fancy graphics or over the top animations, just Sudoku. This was designed with my mom in mind to fit her needs, but I thought everyone else could use it too, after all, who doesn't want a clean version of a classic time waster?


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
$ npm run dist
```
Inside the "dist" directory you should be able to find a binary built for your specific OS.

### Run

If you would like to run this as an npm app instead of as a indenpendent binary, simply clone the repository, go into the directory and run
```
$ npm install
$ npm start
```
