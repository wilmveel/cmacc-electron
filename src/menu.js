const electron = require('electron');
const {Menu, MenuItem} = electron;
const {dialog} = electron;
const {ipcMain} = require('electron')
var util = require('util')



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
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click(item, focusedWindow) {
                        var openFile = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
                        console.log('IPC', util.inspect(ipcMain, null, true))
                        win.webContents.send('open-document', openFile)
                    }
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click(item, focusedWindow) {
                        var saveFile = dialog.showSaveDialog({});
                        console.log(saveFile)
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
                    label:'Upload',
                    accelerator: 'CmdOrCtrl+U',
                    click(itme, focusedWindow) {

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