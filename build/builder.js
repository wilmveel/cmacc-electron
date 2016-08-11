"use strict";
var electron_builder_1 = require('electron-builder');
//import * as builder from 'electron-builder'
electron_builder_1.build({
    targets: electron_builder_1.Platform.MAC.createTarget(),
    devMetadata: {
        build: {
            appId: "",
            "app-category-type": "",
            productName: "Common Accord Desktop",
            asar: false,
            dmg: {
                icon: "build/icon.icns",
                "icon-size": 128,
                background: "build/background.png"
            },
            files: ['web/*/**', 'index.html', 'main.js', 'src/*/**', 'assets/*/**', 'package.json', 'bower_components', 'node_modules', 'build/icon.icns'],
            //compression:null, //linux only
            icon: "build/icon.icns"
        }
    }
}).then(function () {
}).catch(function (error) {
    console.log(error);
});
