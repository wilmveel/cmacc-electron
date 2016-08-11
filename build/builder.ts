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
                "icon-size":128,
                background:"build/background.png"
            },
            files:['web/*/**','index.html','main.js','src/*/**','assets/*/**','package.json','bower_components','node_modules'],
            //compression:null, //linux only
            icon:"build/icon.icns",
            //fileAssociations:{ext:"cmacc", name:"common accord"} //nsis only
        },

    },

}).then(() => {

}).catch((error) => {
    console.log(error)
});

