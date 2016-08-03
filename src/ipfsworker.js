const {ipcMain} = require('electron')
const electron = require('electron');

const path = require('path')

const {dialog} = electron;

const request = require('request')
const util = require('util')

module.exports = function(win, emitter){

    let daemon;
    emitter.on('daemon-ready', function(ipfs){
        daemon = ipfs;

    })

    ipcMain.on('ipfs-add',function(e, args) {
        const address = args.substring(7)
        console.log(address)
        const buttons = ['cancel', 'publish']

        const options= {
            type:'question',
            buttons: buttons,
            title:'publish',
            noLink:true,
        }

        dialog.showMessageBox(
            options, (res) => {
            if (res === 1) {
                console.log('address', address)
                daemon.add(address)
                    .then((hash) => {console.log(hash)
                        var options = {
                            method:"POST",
                            url:'https://cmacc-api.herokuapp.com/api/library/geo',
                            body:{hash:tophash},
                            json:true

                        }
                        request(options, (err) => {

                        })
                    })
                    .catch(err => {console.log(err)})

            }
        })



    })
}