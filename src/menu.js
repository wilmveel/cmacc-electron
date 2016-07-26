const electron = require('electron');
const {Menu, MenuItem} = electron;
const {dialog} = electron;

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click(item, focusedWindow) {
                    var openFile = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
                    console.log(openFile)
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