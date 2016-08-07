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

        nodeDir.paths(address, (erro,pathz) =>{
            const nrFiles = pathz.files.length;

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
                        ipfsList = []
                        paths.files.forEach(function(file){
                            var currentPath = path.basename(topAddress) + '/' + path.relative(topAddress, file)
                            ipfsList.push({path:currentPath , content: fs.createReadStream(file)});
                        })

                        let rootHash;

                        daemon.add(ipfsList)
                            .then((hash) => {
                                console.log(hash)
                                rootHash= hash.pop()

                                console.log('root', rootHash)
                               var options = {
                                    method:"POST",
                                    url:'https://cmacc-api.herokuapp.com/api/library/geo',
                                    body:rootHash,
                                    json:true

                                }
                                request(options, (err) => {

                                })

                            })
                            .catch(err => {console.log(err)})




                    })

                }
            })
        })


    })
}