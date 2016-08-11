"use strict"

import {Platform, build} from 'electron-builder'
//import * as builder from 'electron-builder'

build({
    targets:Platform.MAC.createTarget(),

    devMetadata:{

        build:{
            appId:"",
            "app-category-type":"",
            productName:"Common Accord Desktop",
            asar:false,
            dmg:{
                icon:"build/icon.icns",
                background:"build/background.png"
            },
            files:["app/main.js","app/**/*"],
            //compression:null, //linux only
            icon:"build/icon.icns",
            //fileAssociations:{ext:"cmacc", name:"common accord"} //nsis only
        },
        directories:{
            app:"./app"
        }
    },

}).then(() => {

}).catch((error) => {
    console.log(error)
});

