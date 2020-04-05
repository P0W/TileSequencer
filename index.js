const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;
let mainWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        slashes: true,
        protocol: 'file:'
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
});


const mainMenuTemplate = [
    {
        label: 'Configure ...',
        submenu: [
            {
                label: 'Load Stock...'
            },
            {
                label: 'Predict for...'
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }

];

if (process.env.NODE_ENV !== 'production') {

    mainMenuTemplate.push({
        label: ' Developer Tools',
        click(e, focusWindow) {
            focusWindow.toggleDevTools();
        }
    });


}