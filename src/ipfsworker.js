const {ipcMain} = require('electron')
const electron = require('electron');

const path = require('path')

const async = require('async')

const fs = require('fs')

const nodeDir = require('node-dir')

const {dialog} = electron;

const request = require('request')
const util = require('util')

let topAddress;
let daemon;

let hashArray= [];


function addToIPFS(file){

    var currentPath =path.basename(topAddress) + '/' + path.relative(topAddress, file)

    daemon.add(
        [
            {path:currentPath , content: fs.createReadStream(file)}
        ])
        .then((hash) => {console.log(hash)


            hashArray.push(hash)

        })
        .catch(err => {console.log(err)})
}


module.exports = function(win, emitter){


    emitter.on('daemon-ready', function(ipfs){
        daemon = ipfs;

    })

    ipcMain.on('ipfs-add',function(e, args) {
        const address = args//.substring(7)
        console.log(address)
        const buttons = ['cancel', 'publish']

        nodeDir.paths(address, (erro,path) =>{
            const nrFiles = path.files.length;

            const options= {
                type:'question',
                buttons: buttons,
                title:'publish',
                message:'publish ' + nrFiles + ' files to IPFS',
                noLink:true,
            }
            topAddress = address;
            dialog.showMessageBox(
                options, (res) => {
                if (res === 1) {
                    console.log('address', address)
                    nodeDir.paths(address, (err, paths) => {
                        console.log(paths)
                        console.log(err)
                        async.each(paths.files,addToIPFS,(err)=>{
                            console.log(err)
                            console.log("HEEEEEEEEEEEE")

                            let hashs = hashArray.pop()
                            console.log('HEEEEEE', hashs)
                                let hash = hashs.pop().Hash

                            var options = {
                                method:"POST",
                                url:'https://cmacc-api.herokuapp.com/api/library/geo',
                                body:hash,
                                json:true

                            }
                            request(options, (err) => {

                            })
                        })

                    })

                }
            })
        })


    })
}