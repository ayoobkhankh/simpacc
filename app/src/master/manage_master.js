$(document).ready(function () {

    // "use strict";

    // const { remote } = require('electron');
    // const path = require('path')

    const models = require("../../../models");

    var isDirty = false;

    async function AddOrUpdateMaster(data) {
        await models.master.upsert(data)
            .then(result => {
                if (result === false) {
                    data = { msg: "Master details updated!", action: "update" };
                } else if (result === true) {
                    data = { msg: "Master details updated!", action: "create" };
                } else data = { msg: "An error occured!", action: "error" };
            })
            .catch(err => {
                data = { msg: "An error occured!", action: "error" };
            });
        return data;
    }

    const ipc = require('electron').ipcRenderer

    // var fs = require("fs")
    // var path = require('path')

    // console.log($('#ledid').val())
    $('#acc_start_date').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        startDate: '01-01-1990',
    }).datepicker("setDate", new Date());

    // ('#ledid').

    //     $('#ledid').val();

    // ($('#ledid').val() == null) ? 0 : $('#ledid').val()

    // var B = (A === "red") ? "hot" : "cool";


    // $('#TaxClass option:selected').attr()



    $("#save_master").click(function () {

        // $("#loading").addClass("is-active");

        var acc_start_date = $("#acc_start_date").val()

        var IsoDate = moment(acc_start_date).format('YYYY-MM-DD');

        $('#save_master_form').parsley().validate();

        var data = {
            id: 1,
            bus_name: $('#bus_name').val(),
            adr_ln1: $('#adr_ln1').val(),
            adr_ln2: $('#adr_ln2').val(),
            bus_phone: $('#bus_phone').val(),
            bus_email: $('#bus_email').val(),
            acc_start_date: IsoDate
        }

        AddOrUpdateMaster(data).then(result => {

            if (result.action == 'error') {
                alert(result.msg)
                // $("#loading").removeClass("is-active");

            } else {
                alert(result.msg)
                // $("#loading").removeClass("is-active");
                // $('#led_name').val('')
                // $('#led_desc').val('')
                // $('#ledid').val('')
                // $("option:selected").removeAttr("selected");
                // $("#SelectAccGroup").prop("selected", false).trigger("change");
            }
        }
        );
    })


    GetMasterDetails().then(function (result) {


        if (result.length != 0) {

            var master = result[0];

            $('#bus_name').val(master.bus_name)
            $('#adr_ln1').val(master.adr_ln1)
            $('#adr_ln2').val(master.adr_ln2)
            $('#bus_phone').val(master.bus_phone)
            $('#bus_email').val(master.bus_email)
            var IsoDate = master.acc_start_date
            var acc_start_date = moment(IsoDate).format('DD-MM-YYYY');

            $('#acc_start_date').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                startDate: '01-01-1990',
            }).datepicker("setDate", acc_start_date);

        }
        // $('#acc_start_date').val(acc_start_date)

        // $("#SelectAccGroup").attr('acc_sub_group', line_item['acc_sub_group']).trigger("change");

        // $("#SelectAccGroup option[value='" + line_item['acc_sub_group'] + "']").attr("selected", "selected").trigger("change");

        // $("#SelectAccGroup option:selected").val(0).trigger("change");
        // $('#SelectAccGroup option:selected').prop().trigger("change")
    })

    // ipc.on('selected_led_id', (event, arg) => {

    //     GetLedgerDetails(arg).then(function (result) {

    //         var line_item = result[0];
    //         $("#ledid").val(line_item['id']);
    //         $("#led_name").val(line_item['led_name']);
    //         $("#led_desc").val(line_item['led_desc']);

    //         // $("#SelectAccGroup").attr('acc_sub_group', line_item['acc_sub_group']).trigger("change");

    //         $("#SelectAccGroup option[value='" + line_item['acc_sub_group'] + "']").attr("selected", "selected").trigger("change");

    //         // $("#SelectAccGroup option:selected").val(0).trigger("change");
    //         // $('#SelectAccGroup option:selected').prop().trigger("change")
    //     })

    // });


    async function GetMasterDetails() {

        var master = await models.master.findAll({
            where: {
                id: 1
            },
            raw: true,
        })

        return master

    }


    // $('#edit_radio').click(function () {

    //     clearAll()
    //     ipc.send('show_select_ledger', 'ManageLedgersWindow')
    //     $('#create_new_radio').prop('checked', false)

    //     // if ($(this).is(':checked')) {
    //     //     clearAll()
    //     //     ipc.send('show_select_ledger', 'ManageLedgersWindow')
    //     //     $('#create_new_radio').prop('checked', false)
    //     // }
    // });

    // $('#create_new_radio').click(function () {

    //     $('#edit_radio').prop('checked', false)
    //     clearAll()
    //     // if ($(this).is(':checked')) {
    //     //     // ipc.send('show_select_ledger', 'ping')

    //     // }
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
    //             $("option:selected").removeAttr("selected");
    //             $("#SelectAccGroup").prop("selected", false).trigger("change");
    //         }
    //     }

    // }

    // window.Parsley.on('field:error', function (fieldInstance) {
    //     fieldInstance.$element.popover({
    //         trigger: 'manual',
    //         container: 'body',
    //         placement: 'auto',
    //         html: true,
    //         // title: 'Error! <a href="#" class="close" data-dismiss="alert"><i class="fa fa-xs fa-times-circle" ></i></a>   ',
    //         content: function () {
    //             return fieldInstance.getErrorsMessages().join(';');
    //         }
    //     }).popover('show');

    // });

    // window.Parsley.on('field:success', function (fieldInstance) {
    //     fieldInstance.$element.popover('dispose');
    // });


    // // $(document).on("click", ".popover .close", function () {
    // //     $(this).parents(".popover").popover('hide');
    // // });

    // $(document).on('focus', ':not(.popover)', function () {
    //     $('.popover').click()
    // });


})
