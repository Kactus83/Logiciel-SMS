import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express'; 
import * as http from 'http'; 

let mainWindow: BrowserWindow | null;

// Initialisation d'Express
const server = express();
const port = 3000; // Port du serveur local

// Servir les fichiers Angular via Express
server.use(express.static(path.join(__dirname, 'fuse/browser')));

// Créer un serveur HTTP
const httpServer = http.createServer(server);

// Lancer le serveur avant qu'Electron charge la fenêtre
httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// Créer la fenêtre principale
const createMainWindow = (): void => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // Sécurité
            nodeIntegration: false, // Sécurité
        },
    });

    // Charger l'application Angular via le serveur local
    mainWindow.loadURL(`http://localhost:${port}`);

    // Facultatif : ouvrir les DevTools pour le développement
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

// Gestion d'Electron
app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        createMainWindow();
    }
});

// Gestion d'un fichier PDF
ipcMain.handle('select-pdf', async () => {
    const result = await dialog.showOpenDialog({
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
        properties: ['openFile'],
    });

    if (result.canceled || result.filePaths.length === 0) {
        return { success: false, message: 'No file selected' };
    }

    const filePath = result.filePaths[0];
    const fileData = fs.readFileSync(filePath);

    return {
        success: true,
        filePath,
        data: fileData.toString('base64'),
    };
});
