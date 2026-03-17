const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbPath = path.join(__dirname, '../../database/historial.db')
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error(err)
  else {
    db.run(`
      CREATE TABLE IF NOT EXISTS imc_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT,
        altura REAL,
        peso REAL,
        imc REAL,
        categoria TEXT
      )
    `)
  }
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  win.loadFile(path.join(__dirname, '../renderer/index.html'))
}

ipcMain.handle('save-imc', (event, data) => {
  return new Promise((resolve, reject) => {
    const { fecha, altura, peso, imc, categoria } = data
    db.run(
      'INSERT INTO imc_history (fecha, altura, peso, imc, categoria) VALUES (?, ?, ?, ?, ?)',
      [fecha, altura, peso, imc, categoria],
      function (err) {
        if (err) reject(err)
        else resolve({ id: this.lastID, ...data })
      }
    )
  })
})

ipcMain.handle('get-history', () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM imc_history ORDER BY id DESC', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
})

ipcMain.handle('clear-history', () => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM imc_history', [], function (err) {
      if (err) reject(err)
      else resolve(true)
    })
  })
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})