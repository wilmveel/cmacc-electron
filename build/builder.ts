import {Platform, build} from 'electron-builder'
import * as builder from 'electron-builder'

build({
    targets:Platform.MAC.createTarget(null,1),
    devMetadata:{
        build:{
            appId:"",
            "app-category-type":"",
            "app-bundle-id":"",
            productName:"",
            asar:false,
            dmg:{
                icon:"build/icon.icns",
                background:"build/background.png"
            },
            compression:null,
            icon:"build/icon.icns",
            fileAssociations:{ext:"cmacc", name:"common accord"}
        }
    },

}).then(() => {

}).catch((error) => {
    console.log(error)
})