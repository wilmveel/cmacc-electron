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
                background: "build/background.png"
            },
            files: ["app/main.js", "app/**/*"],
            //compression:null, //linux only
            icon: "build/icon.icns"
        },
        directories: {
            app: "./app"
        }
    }
}).then(function () {
}).catch(function (error) {
    console.log(error);
});
