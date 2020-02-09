$(document).ready(function () {

    // "use strict";

    // const { remote } = require('electron');
    // const path = require('path')

    const models = require("../../../models");

    $(function () {
        $('[data-toggle="popover"]').popover()
    })

    $('#led_ob').val(0);
    $("#led_ob_type").val("Dr").trigger("change");

    var isDirty = false;

    async function AddOrUpdateLedger(data) {
        await models.ledger
            .upsert(data)
            .then(result => {
                if (result === false) {
                    data = { msg: "Ledger updated!", action: "update" };
                } else if (result === true) {
                    data = { msg: "Ledger created!", action: "create" };
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

    var accgroups = require('../../../assets/accgroups.json')

    var acclist = '<option></option>';
    for (var i = 0; i < accgroups.length; i++) {
        acclist += '<option acc_group_code="' + accgroups[i].GroupID + '" acc_sub_group_code="' + accgroups[i].SubgroupID + '"  acc_group="' + accgroups[i].GroupName + '"  acc_sub_group="' + accgroups[i].SubgroupName + '" value="' + accgroups[i].SubgroupName + '">' + accgroups[i].SubgroupName + '</option>';
    }
    $('#SelectAccGroup').html(acclist);

    $('#SelectAccGroup').on('change', function (e) {

        var acc_group_code = $('#SelectAccGroup option:selected').attr('acc_group_code')

        if (acc_group_code == 1 || acc_group_code == 2 || acc_group_code == 3) {

            $('#led_ob').val(0);
            $("#led_ob_type").val("Dr").trigger("change");
            $('#led_ob').prop("disabled", false);
            $('#led_ob_type').prop("disabled", false);
        }
        else {
            $('#led_ob').val(0);
            $("#led_ob_type").val("Dr").trigger("change");
            $('#led_ob').prop("disabled", true);
            $('#led_ob_type').prop("disabled", true);
        }

    });

    $('#SelectAccGroup').select2({
        placeholder: "Select an Account Group"
    });

    // ('#ledid').

    //     $('#ledid').val();

    // ($('#ledid').val() == null) ? 0 : $('#ledid').val()

    // var B = (A === "red") ? "hot" : "cool";


    // $('#TaxClass option:selected').attr()

    $("#save_ledger").click(function () {

        var data = {
            id: ($('#ledid').val() == null) ? 0 : $('#ledid').val(),
            led_name: $('#led_name').val(),
            led_desc: $('#led_desc').val(),
            acc_group: $('#SelectAccGroup option:selected').attr('acc_group'),
            acc_group_code: $('#SelectAccGroup option:selected').attr('acc_group_code'),
            acc_sub_group: $('#SelectAccGroup option:selected').attr('acc_sub_group'),
            acc_sub_group_code: $('#SelectAccGroup option:selected').attr('acc_sub_group_code'),
            led_ob: $('#led_ob').val(),
            led_ob_type: $("#led_ob_type").val()
        }

        AddOrUpdateLedger(data).then(result => {
            if (result.action == 'error') {
                alert(result.msg)
            } else {
                alert(result.msg)
                $('#led_name').val('')
                $('#led_desc').val('')
                $('#ledid').val('')
                $("option:selected").removeAttr("selected");
                $("#SelectAccGroup").prop("selected", false).trigger("change");
                $('#led_ob').val(0);
                $("#led_ob_type").val("Dr").trigger("change");
                $('#led_ob').prop("disabled", false);
                $('#led_ob_type').prop("disabled", false);

            }
        }
        );
    })

    ipc.on('selected_led_id', (event, arg) => {

        GetLedgerDetails(arg).then(function (result) {

            var line_item = result[0];
            $("#ledid").val(line_item['id']);
            $("#led_name").val(line_item['led_name']);
            $("#led_desc").val(line_item['led_desc']);

            // $("#SelectAccGroup").attr('acc_sub_group', line_item['acc_sub_group']).trigger("change");

            $("#SelectAccGroup option[value='" + line_item['acc_sub_group'] + "']").attr("selected", "selected").trigger("change");

            // $("#SelectAccGroup option:selected").val(0).trigger("change");
            // $('#SelectAccGroup option:selected').prop().trigger("change")
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


    $('#edit_radio').click(function () {

        clearAll()
        ipc.send('show_select_ledger', 'ManageLedgersWindow')
        $('#create_new_radio').prop('checked', false)

        // if ($(this).is(':checked')) {
        //     clearAll()
        //     ipc.send('show_select_ledger', 'ManageLedgersWindow')
        //     $('#create_new_radio').prop('checked', false)
        // }
    });

    $('#create_new_radio').click(function () {

        $('#edit_radio').prop('checked', false)
        clearAll()
        // if ($(this).is(':checked')) {
        //     // ipc.send('show_select_ledger', 'ping')

        // }
    });

    $("#clear_all").click(function () {
        clearAll()
    })

    function clearAll() {

        ($('#led_name').val() != '' || $('#led_desc').val() != '' || $('#ledid').val() != '') ? isDirty = true : isDirty = false;

        if (isDirty == true) {
            if (confirm('Ignore unsaved changes?')) {
                $('#led_name').val('')
                $('#led_desc').val('')
                $('#ledid').val('')
                $("option:selected").removeAttr("selected");
                $("#SelectAccGroup").prop("selected", false).trigger("change");
            }
        }

    }
})