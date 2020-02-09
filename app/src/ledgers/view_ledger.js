
$(document).ready(function () {

    var led_id

    const models = require("../../../models");

    const Op = require('../../../models').Sequelize.Op;

    const ipc = require('electron').ipcRenderer


    $(function () {
        $('[data-toggle="popover"]').popover()
    })

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

        var date = new Date();

        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        if (result.length != 0) {

            var acc_start_date = moment(result[0].acc_start_date).format('DD/MM/YYYY');

            $('#date_from').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                startDate: acc_start_date,
            }).datepicker("setDate", firstDay);

            $('#date_to').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                startDate: acc_start_date,
            }).datepicker("setDate", lastDay);
        }
    })

    $('#choose_ledger').click(function () {

        ipc.send('show_select_ledger', 'ViewLedgerWindow')

    });


    var table = $('#vou_list_table').DataTable({
        "paging": false,
        "ordering": true,
        deferRender: true,
        "bInfo": false,
        "dom": '<"top"i>rt<"bottom"><"clear">',
        columnDefs: [
            {
                targets: 0,
                className: 'dt-body-center dt-head-center',
                "searchable": false,
                "width": "10%",
            },
            {
                targets: 1,
                className: 'dt-body-center dt-head-center',
                "width": "10%",
                "searchable": false,
            },
            {
                targets: 2,
                className: 'dt-body-left dt-head-center',
                "searchable": true,
                "width": "50%",
            },
            {
                targets: 3,
                className: 'dt-body-center dt-head-center',
                "searchable": false,
                "width": "10%",
            },
            {
                targets: 4,
                className: 'dt-body-right dt-head-center',
                "searchable": false,
                "width": "10%",
            },
            {
                targets: 4,
                className: 'dt-body-center dt-head-center',
                "searchable": false,
                "width": "10%",
            },
        ]

    })

    // $.fn.digits = function () {
    //     return this.each(function () {
    //         $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    //     })
    // }

    $('#show_ledger').click(function () {

        var startDate = moment($('#date_from').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var endDate = moment($('#date_to').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');


        GetVouchersList(led_id, startDate, endDate).then(function (voucherslist) {

            $('#vou_list_table').dataTable().fnClearTable()

            for (var i = 0; i < voucherslist.length; i++) {

                $('#vou_list_table').dataTable().fnAddData([
                    voucherslist[i].vou_no,
                    // '<a href="#" class="led_id_link" id="' + ledgerslist[i].id + '">' + ledgerslist[i].led_name + '</a>',
                    moment(voucherslist[i].vou_date).format('DD/MM/YYYY'),
                    voucherslist[i].vou_desc,
                    voucherslist[i].led_treat,
                    Number(voucherslist[i].vou_amt).toLocaleString("en", { minimumFractionDigits: 2 }),
                    '<a class="vou_q_view_link" data-toggle="modal" data-target="#exampleModalScrollable" href="#" id="' + voucherslist[i].vou_no + '"><i class="fas fa-eye"></i></a>&nbsp;&nbsp;<a class="vou_edit_link" href="#" id="' + voucherslist[i].vou_no + '"><i class="fas fa-edit"></i></a>&nbsp;&nbsp;<a class="vou_del_link" href="#" id="' + voucherslist[i].vou_no + '"><i class="fas fa-trash-alt"></i></a>'
                ]);
            }


            $(".vou_q_view_link").hover(function () {

                var $this = $(this);

                $this.popover({
                    trigger: 'manual',
                    container: 'body',
                    placement: 'bottom',
                    html: true,
                    content: "Quick View"
                }).popover('show');

                setTimeout(function () { $this.popover('hide') }, 500);

            })

            $(".vou_edit_link").hover(function () {

                var $this = $(this);

                $this.popover({
                    trigger: 'manual',
                    container: 'body',
                    placement: 'bottom',
                    html: true,
                    content: "Edit"
                }).popover('show');

                setTimeout(function () { $this.popover('hide') }, 500);

            })

            $(".vou_del_link").hover(function () {

                var $this = $(this);

                $this.popover({
                    trigger: 'manual',
                    container: 'body',
                    placement: 'bottom',
                    html: true,
                    content: "Delete"
                }).popover('show');

                setTimeout(function () { $this.popover('hide') }, 500);

            })

            $(".vou_q_view_link").click(function () {

                GetVoucherDetails($(this).attr("id")).then(function (result) {

                    $('#entry_table').dataTable().fnClearTable()

                    $('#QViewHeader').html("Voucher# " + result[0].vou_no + " dated " + moment(result[0].vou_date).format('DD MMM YYYY'));


                    for (var i = 0; i < result.length; i++) {

                        $('#entry_table').dataTable().fnAddData([
                            result[i].led_name,
                            result[i].led_treat,
                            Number(result[i].vou_amt).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        ]);

                    }

                    $('#QViewFooter').html("( " + result[0].vou_desc + " )");

                })

            });

            $(".vou_del_link").click(function () {

                if (confirm('Are you sure you want to delete this voucher?')) {

                    DeleteVoucher(this.id).then(result => {
                        if (result.action == 'error') {
                            alert(result.msg)
                        } else {
                            table.row($(this).parents('tr')).remove().draw();
                            alert(result.msg)
                        }
                    });
                }
            });

            $(".vou_edit_link").click(function () {
                ipc.send('send_selected_voucher_id', { id: $(this).attr("id") })
                window.close();
            });

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


    ipc.on('selected_led_id', (event, arg) => {

        led_id = arg

        GetLedgerDetails(arg).then(function (result) {
            var line_item = result[0];
            $("#led_name").val(line_item['led_name']);
        })

    });

    async function GetTransactions(led_id) {
        var voucherslist = await models.vouchers.findAll({
            attributes: ["id", "vou_no", "vou_date", "vou_desc", "led_treat", "vou_amt"], raw: true, where: {
                led_id: led_id
            }
        })

        return voucherslist

    }

    async function GetVouchersList(led_id, startDate, endDate) {

        var voucherslist = await models.voucher.findAll({
            attributes: ['vou_date', 'vou_no', 'vou_desc', "led_treat", 'vou_amt'],
            where:
            {
                'led_id': led_id,
                'vou_date': {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['vou_no'],
            raw: true,
        })

        return voucherslist;

    }

    async function DeleteVoucher(id) {
        var data

        await models.voucher.destroy({
            where: {
                vou_no: id
            }
        })
            .then(result => {

                if (result > 0) {
                    data = { msg: "Voucher Deleted!", action: "delete" };
                }
                else {
                    data = { msg: "An error occured!", action: "error" };
                }
            })
            .catch(err => {

                data = { msg: "An error occured!", action: "error" };
            });
        return data;
    }

    async function GetVoucherDetails(id) {

        var voucher = await models.voucher.findAll({
            attributes: ['vou_no', 'vou_date', 'vou_desc', 'ledger.led_name', 'led_treat', 'vou_amt'],
            include: [{
                model: models.ledger,
                attributes: []
            }],
            where: {
                vou_no: id,
            },
            raw: true,
        })

        return voucher

    }

    var table = $('#entry_table').DataTable({
        "searching": false,
        "paging": false,
        "ordering": true,
        deferRender: true,
        "bInfo": false,
        "dom": '<"top"i>rt<"bottom"><"clear">',
        "aaSorting": [[1, 'desc']],
        columnDefs: [
            {
                targets: 0,
                className: 'dt-body-left dt-head-center',
                "width": "70%",
            },
            {
                targets: 1,
                className: 'dt-body-center dt-head-center',
                "width": "10%",
            },
            {
                targets: 2,
                className: 'dt-body-right dt-head-center',
                "width": "20%",
            },
        ]
    })

})


