const electron = require('electron');
const {Menu, MenuItem} = electron;
const {dialog} = electron;
const {ipcMain} = require('electron')
var util = require('util')
const fs = require('fs')
const path = require('path')
const request = require('request')

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

    ipcMain.on('common-accord-save', function(e){
        var saveFile = dialog.showSaveDialog({});

        e.sender.send('save-document', saveFile);
    })

    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New',
                    accelerator: 'CmdOrCtrl+N',
                    click(item, focusedWindow){
                        var newFile = dialog.showSaveDialog({})
                        if(newFile){
                            fs.writeFile(newFile, "", function(err){
                                var newDir = path.dirname(newFile)
                                nodeDir.paths(newDir, (err, path) => {
                                    console.log("NewDir",newDir)

                                    win.webContents.send('open-directory', {directory: newDir, files: path.files})
                                })
                            })
                        }

                    }
                },
                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click(item, focusedWindow) {
                        var openFile = dialog.showOpenDialog({properties: ['openFile', 'openDirectory']});
                        //console.log('IPC', util.inspect(ipcMain, null, true))

                        if(openFile) {

                            if (fs.lstatSync(openFile[0]).isDirectory()) {
                                nodeDir.paths(openFile[0], (err, path) => {


                                    win.webContents.send('open-directory', {directory: openFile[0], files: path.files})
                                })


                            } else {

                                openFile = openFile[0]
                                console.log('opening', openFile)
                                win.webContents.send('open-document', {
                                    directory: path.dirname(openFile),
                                    files: openFile
                                })
                            }
                        }
                    }
                },
                {
                    label:'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click(itme, focusedWindow){
                        win.webContents.send('save-current')
                    }
                },
                {
                    label: 'Save As',

                    click(item, focusedWindow) {
                        var saveFile = dialog.showSaveDialog({});
                        //console.log(saveFile)
                        if(saveFile) {
                            win.webContents.send('save-document', saveFile);
                        }
                    }
                }
            ]
        },
        {
            label:'Edit',
            submenu:[
                { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
            ]
        },
        {
            label: 'IPFS',
            submenu: [
                {
                    label: 'Browse',
                    accelerator: 'CmdOrCtrl+B',
                    click(item, focusedWindow) {
                        var options = {
                            method: "GET",
                            url: 'https://cmacc-api.herokuapp.com/api/library/geo'
                        }

                       request(options, function(err, response, body ){
                           console.log(err)


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
        },
        {
            label: 'Dev',
            submenu: [
                {
                    label: 'devTools',
                    click(item, focusedWindow){
                        win.webContents.openDevTools();
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