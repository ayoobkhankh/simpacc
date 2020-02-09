$(document).ready(function () {


    const ipc = require('electron').ipcRenderer

    $("#show_manage_ledgers").click(function () {

        ipc.send('show_manage_ledgers', 'ping')

    })

    $("#show_manage_vouchers").click(function () {

        ipc.send('show_manage_vouchers', 'ping')

    })

    show_view_ledger


    $("#show_view_ledger").click(function () {

        ipc.send('show_view_ledger', 'ping')

    })

    $("#show_manage_master").click(function () {

        ipc.send('show_manage_master', 'ping')

    })


    $('#show_day_book').click(function () {

        ipc.send('show_day_book', 'ManageVouchersWindow')
    });


})