$(document).ready(function () {

    // "use strict";

    // const { remote } = require('electron');
    // const path = require('path')

    const models = require("../../../models");
    var sequelize = require('sequelize')



    $(function () {
        $('[data-toggle="popover"]').popover()
    })

    var isDirty = false;

    var debit_total = 0
    var credit_total = 0

    var line_item

    var entry = []


    // async function AddOrUpdateLedger(data) {
    //     await models.ledger
    //         .upsert(data)
    //         .then(result => {
    //             if (result === false) {
    //                 data = "Ledger updated!";
    //             } else if (result === true) {
    //                 data = "Ledger saved!";
    //             } else data = "An error occured!";
    //         })
    //         .catch(err => {
    //             data = "An error occured";
    //         });
    //     return data;
    // }

    const ipc = require('electron').ipcRenderer

    // var fs = require("fs")
    // var path = require('path')

    // console.log($('#ledid').val())

    // var accgroups = require('../../../assets/accgroups.json')

    // var acclist = '<option></option>';
    // for (var i = 0; i < accgroups.length; i++) {
    //     acclist += '<option acc_group_code="' + accgroups[i].GroupID + '" acc_sub_group_code="' + accgroups[i].SubgroupID + '"  acc_group="' + accgroups[i].GroupName + '"  acc_sub_group="' + accgroups[i].SubgroupName + '">' + accgroups[i].SubgroupName + '</option>';
    // }
    // $('#SelectAccGroup').html(acclist);

    // $('#SelectState').on('change', function (e) {
    //     SelectedStateCode = $('#SelectState').val();
    //     $('#statecode').val(SelectedStateCode);
    // });

    // $('#SelectAccGroup').select2({
    //     placeholder: "Select an Account Group"
    // });

    // ('#ledid').

    //     $('#ledid').val();

    // ($('#ledid').val() == null) ? 0 : $('#ledid').val()

    // var B = (A === "red") ? "hot" : "cool";


    // $('#TaxClass option:selected').attr()

    // $("#save_ledger").click(function () {

    //     var data = {
    //         id: ($('#ledid').val() == null) ? 0 : $('#ledid').val(),
    //         led_name: $('#led_name').val(),
    //         led_desc: $('#led_desc').val(),
    //         acc_group: $('#SelectAccGroup option:selected').attr('acc_group'),
    //         acc_group_code: $('#SelectAccGroup option:selected').attr('acc_group_code'),
    //         acc_sub_group: $('#SelectAccGroup option:selected').attr('acc_sub_group'),
    //         acc_sub_group_code: $('#SelectAccGroup option:selected').attr('acc_sub_group_code'),
    //     }

    //     AddOrUpdateLedger(data).then(result => alert(result));
    // })
    function findTotals() {
        var drtot = 0
        var crtot = 0

        for (var i = 0; i < entry.length; i++) {
            if (entry[i].led_treat == "Dr") {
                drtot += parseFloat(entry[i].vou_amt)
                crtot = crtot + 0
            } else {
                crtot += parseFloat(entry[i].vou_amt)
                drtot = drtot + 0
            }

        }

        // debit_total = drtot
        // credit_total = crtot

        $('#debit_total').val(Number(drtot).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        $('#credit_total').val(Number(crtot).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))



        if (drtot == crtot) {
            $('#eq_check').html("=")
            $('#eq_check').addClass('equal_sign_match');
            $('#eq_check').removeClass('equal_sign_unmatch');
        } else {
            $('#eq_check').html("&#8800;")
            $('#eq_check').addClass('equal_sign_unmatch');
            $('#eq_check').removeClass('equal_sign_match');
        }

    }

    $('#add_line_item').click(function () {
        if (line_item != null) {
            line_item.led_treat = $('#led_treat option:selected').val()
            line_item.vou_amt = $('#vou_amt').val()
            entry.push(line_item)


            // var entry_table_content = '<thead><tr><th>ID</th><th>Ledger Name</th><th> Dr / Cr</th><th>Amount</th></tr></thead><tbody>';
            $('#entry_table').dataTable().fnClearTable()


            for (var i = 0; i < entry.length; i++) {

                $('#entry_table').dataTable().fnAddData([
                    i + 1,
                    entry[i].led_name,
                    entry[i].led_treat,
                    Number(entry[i].vou_amt).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    '<a class="edit_line_link" href="#" id="' + i + '"><i class="fas fa-edit"></i></a>&nbsp;&nbsp;<a class="del_line_link" href="#" id="' + i + '"><i class="fas fa-trash-alt"></i></a>'
                ]);

            }

            // entry_table_content += '</tbody>'

            // $('#entry_table').html(entry_table_content)
            // table.clear().draw();
            line_item = null
            $("#led_name").val('')
            // $('#led_treat option:selected').val('Dr').trigger("change")
            $('#vou_amt').val('')
            findTotals()

            $(".del_line_link").click(function () {

                entry.splice(entry.indexOf(this.id, 1))

                table.row($(this).parents('tr')).remove().draw();

                findTotals()

            });

            // console.log(entry)
        }

    });

    var table = $('#entry_table').DataTable({
        "searching": false,
        "paging": false,
        "ordering": true,
        deferRender: true,
        "bInfo": false,
        "dom": '<"top"i>rt<"bottom"><"clear">',
        columnDefs: [
            {
                targets: 0,
                className: 'dt-body-center dt-head-center',
                "width": "10%",
            },
            {
                targets: 1,
                className: 'dt-body-left dt-head-center',
                "width": "50%",
            },
            {
                targets: 2,
                className: 'dt-body-center dt-head-center',
                "width": "15%",
            },
            {
                targets: 3,
                className: 'dt-body-right dt-head-center',
                "width": "15%",
            },
            {
                targets: 4,
                className: 'dt-body-center dt-head-center',
                "width": "10%",
            },

        ]
    })

    ipc.on('selected_led_id', (event, arg) => {

        GetLedgerDetails(arg).then(function (result) {

            line_item = result[0];
            $("#led_name").val(line_item['led_name']);
        })

    });


    async function GetLedgerDetails(id) {

        var ledger = await models.ledger.findAll({
            where: {
                id: id
            },
            raw: true,
        })

        return ledger

    }

    $('#choose_ledger').click(function () {

        ipc.send('show_select_ledger', 'ManageVouchersWindow')

    });


    GetMaxVoucherId()
    findTotals()

    async function GetMaxVoucherId() {

        var MaxVoucherId = await models.voucher.findAll({
            attributes: [[sequelize.fn('max', sequelize.col('vou_no')), 'MaxVoucherId']],
            raw: true,
        })
        // console.log(MaxVoucherId[0]['MaxVoucherId'])
        return MaxVoucherId[0]['MaxVoucherId']

    }

    async function GetAccStartDate() {

        var acc_start_date = await models.master.findAll({
            attributes: ['acc_start_date'],
            where: {
                id: 1
            },
            raw: true,
        })

        return acc_start_date

    }

    GetAccStartDate().then(function (result) {

        if (result.length != 0) {

            var acc_start_date = moment(result[0].acc_start_date).format('DD/MM/YYYY');

            $('#vou_date').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                startDate: acc_start_date,
            }).datepicker("setDate", new Date());
        }
        else {
            $('#vou_date').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                startDate: new Date(),
            }).datepicker("setDate", new Date());

        }
    })


    $('#save_voucher').click(function () {

        var NextVoucherId

        // var vou_date = $("#vou_date").val()

        var IsoDate = moment($('#vou_date').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

        GetMaxVoucherId().then(function (result) {

            // console.log(result)
            result == null ? NextVoucherId = 1 : NextVoucherId = result + 1

            var data = []

            for (var i = 0; i < entry.length; i++) {

                data_row = {
                    vou_date: IsoDate,
                    vou_no: $("#vou_no").val() == '' ? NextVoucherId : $("#vou_no").val(),
                    led_id: entry[i].id,
                    led_treat: entry[i].led_treat,
                    vou_amt: entry[i].vou_amt,
                    vou_desc: $("#vou_desc").val()
                }
                data.push(data_row);
            }


            SaveVoucher(data).then(function (result) {
                alert(result)

            })

            // console.log(data);
            // console.log(NextVoucherId)
            // line_item = result[0];
            // $("#led_name").val(line_item['led_name']);
        })

    });

    async function SaveVoucher(data) {
        await models.voucher
            .bulkCreate(data)
            .then(result => {
                data = "Sales details Created";
            })
            .catch(err => {
                data = "An error occured";
            });
        return data;
    }

    $('#edit_radio').click(function () {

        ipc.send('show_day_book', 'ManageVouchersWindow')
        $('#create_new_radio').prop('checked', false)
        // if ($(this).is(':checked')) {
        //     // clearAll()

        // }
    });

    $('#create_new_radio').click(function () {

        $('#edit_radio').prop('checked', false)
        // if ($(this).is(':checked')) {
        //     // ipc.send('show_select_ledger', 'ping')

        //     // clearAll()
        // }
    });

    ipc.on('selected_vou_id', (event, arg) => {

        GetVoucherDetails(arg).then(function (result) {

            entry = result;

            var vou_date = moment(entry[0].vou_date).format('DD/MM/YYYY');

            $("#vou_date").val(vou_date)

            $("#vou_no").val(entry[0].vou_no)

            $("#vou_desc").val(entry[0].vou_desc)

            $('#entry_table').dataTable().fnClearTable()

            for (var i = 0; i < entry.length; i++) {

                $('#entry_table').dataTable().fnAddData([
                    i + 1,
                    entry[i].led_name,
                    entry[i].led_treat,
                    Number(entry[i].vou_amt).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    '<a class="edit_line_link" href="#" id="' + i + '"><i class="fas fa-edit"></i></a>&nbsp;&nbsp;<a class="del_line_link" href="#" id="' + i + '"><i class="fas fa-trash-alt"></i></a>'
                ]);

            }

            findTotals()
            // $('#entry_table').dataTable().fnClearTable()

            // $('#QViewHeader').html("Voucher# " + result[0].vou_no + " dated " + moment(result[0].vou_date).format('DD MMM YYYY'));


            // for (var i = 0; i < result.length; i++) {

            //     $('#entry_table').dataTable().fnAddData([
            //         result[i].led_name,
            //         result[i].led_treat,
            //         Number(result[i].vou_amt).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            //     ]);

            //     // vouchersoptlist += '<tr><td>' + voucherslist[i].vou_date + '</td><td>' + voucherslist[i].vou_no + '</td><td><a class="vou_id_link" href="#" id="' + voucherslist[i].vou_no + '">' + voucherslist[i].vou_desc + '</a></td><td>' + voucherslist[i].drtotal + '</td><td><a class="vou_del_link" href="#" id="' + voucherslist[i].vou_no + '"><i class="fas fa-trash-alt"></i></a></td></tr>'

            // }

            // $('#QViewFooter').html("( " + result[0].vou_desc + " )");

            // var line_item = result[0];
            // $("#ledid").val(line_item['id']);
            // $("#led_name").val(line_item['led_name']);
            // $("#led_desc").val(line_item['led_desc']);

            // // $("#SelectAccGroup").attr('acc_sub_group', line_item['acc_sub_group']).trigger("change");

            // $("#SelectAccGroup option[value='" + line_item['acc_sub_group'] + "']").attr("selected", "selected").trigger("change");

            // // $("#SelectAccGroup option:selected").val(0).trigger("change");
            // // $('#SelectAccGroup option:selected').prop().trigger("change")


        })


        // GetLedgerDetails(arg).then(function (result) {

        //     var line_item = result[0];
        //     $("#ledid").val(line_item['id']);
        //     $("#led_name").val(line_item['led_name']);
        //     $("#led_desc").val(line_item['led_desc']);

        //     // $("#SelectAccGroup").attr('acc_sub_group', line_item['acc_sub_group']).trigger("change");

        //     $("#SelectAccGroup option[value='" + line_item['acc_sub_group'] + "']").attr("selected", "selected").trigger("change");

        //     // $("#SelectAccGroup option:selected").val(0).trigger("change");
        //     // $('#SelectAccGroup option:selected').prop().trigger("change")
        // })

    });

    async function GetVoucherDetails(id) {

        var voucher = await models.voucher.findAll({
            attributes: ['vou_no', 'vou_date', 'vou_desc', 'led_id', 'ledger.led_name', 'led_treat', 'vou_amt'],
            include: [{
                model: models.ledger,
                attributes: []
                //  required: false
            }],
            where: {
                vou_no: id
            },
            raw: true,
        })

        return voucher

    }

    async function DeleteVoucher(id) {

        var data = await models.voucher.destroy({
            where: {
                vou_no: id
            }
        })

        return data;
    }


    // $('#create_new_radio').change(function () {
    //     if ($(this).is(':checked')) {
    //         // ipc.send('show_select_ledger', 'ping')
    //         $('#edit_radio').prop('checked', false)
    //         clearAll()
    //     }
    // });

    // $("#clear_all").click(function () {
    //     clearAll()
    // })

    // function clearAll() {

    //     ($('#led_name').val() != '' || $('#led_desc').val() != '' || $('#ledid').val() != '') ? isDirty = true : isDirty = false;

    //     if (isDirty == true) {
    //         if (confirm('Ignore unsaved changes?')) {
    //             $('#led_name').val('')
    //             $('#led_desc').val('')
    //             $('#ledid').val('')
    //         }
    //     }

    // }
})