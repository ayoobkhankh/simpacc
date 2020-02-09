// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain;
const url = require('url')

var Sequelize = require('sequelize')
var db = require('./models/index')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {

  db.sequelize.sync();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    show: false

  })

  // and load the index.html of the app.
  mainWindow.loadFile('app/src/dashboard/dashboard.html')
  mainWindow.maximize()

  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.show()
  });


  mainWindow.on('close', (event) => {

    app.quit()
    //win = null
    // console.log(event);
    // event.preventDefault();
    // SelectLedgerWindow.hide();
  })


  // SelectLedgerWindow.webContents.session.clearCache(function () { });
  // SelectLedgerWindow.show()


  // const ses = mainWindow.webContents.session.clearCache(function () { });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.



  // mainWindow.on('closed', function () {
  //   // Dereference the window object, usually you would store windows
  //   // in an array if your app supports multi windows, this is the time
  //   // when you should delete the corresponding element.
  //   mainWindow = null
  // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

ipc.on('show_manage_ledgers', function (event, arg) {
  ManageLedgersWindow = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
  })

  // ManageLedgersWindow.setMenu(null)


  ManageLedgersWindow.loadFile('app/src/ledgers/manage_ledgers.html')

  ManageLedgersWindow.webContents.on('did-finish-load', function () {
    ManageLedgersWindow.show()
  });




  // and load the index.html of the app.
  // ManageLedgersWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'app/src/ledgers/manage_ledgers.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  // DashboardWindow.setMenu(null)
  // ManageLedgersWindow.webContents.openDevTools()
  // ManageLedgersWindow.webContents.on('did-finish-load', function () {
  //   // DashboardWindow.maximize()
  //   const ses = ManageLedgersWindow.webContents.session.clearCache(function () { });
  //   // ManageLedgersWindow.setMenu(null)
  //   // if (AdminLoginWindow.isVisible) {
  //   //   AdminLoginWindow.close();
  //   // }
  // });
})

var led_from_window
var vou_from_window

var SelectLedgerWindow

ipc.on('show_select_ledger', function (event, arg) {

  if (SelectLedgerWindow != null) {
    SelectLedgerWindow.show()
  } else {
    SelectLedgerWindow = new BrowserWindow({
      width: 800,
      height: 600,
      modal: true,
      webPreferences: {
        nodeIntegration: true,
      },
      show: false
      // resizable: false,
    })

    SelectLedgerWindow.loadFile('app/src/ledgers/select_ledger.html')


    SelectLedgerWindow.webContents.on('did-finish-load', function () {
      SelectLedgerWindow.show()
    });

  }

  SelectLedgerWindow = new BrowserWindow({
    width: 800,
    height: 600,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false
    // resizable: false,
  })

  SelectLedgerWindow.loadFile('app/src/ledgers/select_ledger.html')


  SelectLedgerWindow.webContents.on('did-finish-load', function () {
    SelectLedgerWindow.show()
  });


  SelectLedgerWindow.on('close', (event) => {
    //win = null
    console.log(event);
    event.preventDefault();
    SelectLedgerWindow.hide();
  })



  // SelectLedgerWindow.webContents.send('from_window', arg);

  led_from_window = arg


  // SelectLedgerWindow = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   modal: true,
  //   webPreferences: {
  //     nodeIntegration: true,
  //   },
  //   // resizable: false,
  // })

  // SelectLedgerWindow.loadFile('app/src/ledgers/select_ledger.html')
  // SelectLedgerWindow.webContents.session.clearCache(function () { });



})




ipc.on('show_view_ledger', function (event, arg) {


  ViewLedgerWindow = new BrowserWindow({
    width: 800,
    height: 600,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false
    // resizable: false,
  })

  ViewLedgerWindow.loadFile('app/src/ledgers/view_ledger.html')


  ViewLedgerWindow.webContents.on('did-finish-load', function () {
    ViewLedgerWindow.show()
  });

  // SelectLedgerWindow.webContents.send('from_window', arg);

})

ipc.on('show_day_book', function (event, arg) {


  DayBookWindow = new BrowserWindow({
    width: 800,
    height: 600,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false
    // resizable: false,
  })

  DayBookWindow.loadFile('app/src/vouchers/day_book.html')



  DayBookWindow.webContents.on('did-finish-load', function () {
    DayBookWindow.show()
  });

  // SelectLedgerWindow.webContents.send('from_window', arg);

  vou_from_window = arg


  // SelectLedgerWindow = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   modal: true,
  //   webPreferences: {
  //     nodeIntegration: true,
  //   },
  //   // resizable: false,
  // })

  // SelectLedgerWindow.loadFile('app/src/ledgers/select_ledger.html')
  // SelectLedgerWindow.webContents.session.clearCache(function () { });



})

ipc.on('show_manage_vouchers', function (event, arg) {
  ManageVouchersWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false
    // resizable: false,
  })


  ManageVouchersWindow.loadFile('app/src/vouchers/manage_vouchers.html')

  ManageVouchersWindow.maximize()

  ManageVouchersWindow.webContents.on('did-finish-load', function () {
    ManageVouchersWindow.show()
  });

})

ipc.on('show_manage_master', function (event, arg) {
  ManageMasterWindow = new BrowserWindow({
    width: 800,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
  })


  ManageMasterWindow.loadFile('app/src/master/manage_master.html')

  ManageMasterWindow.webContents.on('did-finish-load', function () {
    ManageMasterWindow.show()
  });


})

ipc.on('send_selected_ledger_id', function (event, arg) {

  switch (led_from_window) {
    case 'ManageVouchersWindow':
      ManageVouchersWindow.webContents.send('selected_led_id', arg.id);
      break;

    case 'ManageLedgersWindow':
      ManageLedgersWindow.webContents.send('selected_led_id', arg.id);
      break;

    case 'ViewLedgerWindow':
      ViewLedgerWindow.webContents.send('selected_led_id', arg.id);
      break;
  }

  // arg.window.webContents.send('selected_ledger_id', arg.id);

  // console.log(arg)
})

ipc.on('send_selected_voucher_id', function (event, arg) {

  switch (vou_from_window) {
    case 'ManageVouchersWindow':
      ManageVouchersWindow.webContents.send('selected_vou_id', arg.id);
      break;
  }

  // arg.window.webContents.send('selected_ledger_id', arg.id);

  // console.log(arg)
})
// ipc.on('GetLedgerId', function (event, arg) {
//   windowname = arg[0].window;
//   switch (windowname) {
//     case "POSWindow":
//       POSWindow.webContents.send('RecievedSalesId', arg[0].SalesId);
//       break;
//   }
//   SalesSearchWindow.close();
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
