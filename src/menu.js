const electron = require('electron');
const {Menu, MenuItem} = electron;
const {dialog} = electron;
const {ipcMain} = require('electron')
var util = require('util')
const fs = require('fs')


const nodeDir = require('node-dir')

function recDirectorySearch(dircontent, dirname){
    for(var i = 0; i < dircontent.length; i++ ){
        var cdir =  dirname + '/' + dircontent[i]
        if(fs.lstatSync(cdir).isDirectory()){
            var res = fs.readdirSync(cdir)

                console.log(res)
                recDirectorySearch(res, cdir)

        }
    }
}

module.exports = function(win, emitter) {
    let daemon;
    emitter.on('daemon-ready', function(ipfs){
        daemon = ipfs;

    })

    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New',
                    accelerator: 'CmdOrCtrl+N',
                    click(item, focusedWindow){

                        win.webContents.send('new-document')
                    }
                },
                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click(item, focusedWindow) {
                        var openFile = dialog.showOpenDialog({properties: ['openFile', 'openDirectory']});
                        //console.log('IPC', util.inspect(ipcMain, null, true))
                        console.log(openFile[0])

                        if(fs.lstatSync(openFile[0]).isDirectory()){
                            nodeDir.paths(openFile[0], (err, path) => {


                                win.webContents.send('open-directory', {directory:openFile[0],files:path.files})
                            })



                        } else {

                            openFile = 'file://' + openFile;
                            console.log('opening', openFile)
                            win.webContents.send('open-document', openFile)
                        }
                    }
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click(item, focusedWindow) {
                        var saveFile = dialog.showSaveDialog({});
                        //console.log(saveFile)
                        win.webContents.send('save-document', saveFile);
                    }
                }
            ]
        },
        {
            label: 'IPFS',
            submenu: [
                {
                    label: 'Browse',
                    accelerator: 'CmdOrCtrl+B',
                    click(item, focusedWindow) {
                        daemon.id().then(function(id){
                            console.log('ipfs id', id)
                        })

                    }
                },
                {
                    label:'Publish',
                    accelerator: 'CmdOrCtrl+P',
                    click(item, focusedWindow) {

                        win.webContents.send('publish')
                    }
                },

            ]
        },
        {
            label: 'Authorization',
            submenu: [
                {
                    label: 'Sign',
                    click(item, focusedWindow){

                    }
                },
                {
                    label: 'Manage identity',
                    click(item, focusedWindow){

                    }
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
        const name = ''// require('electron').remote.app.getName();
        template.unshift({
            label: name,
            submenu: [
                {
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                },
            ]
        });

    }


    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}