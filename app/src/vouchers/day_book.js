
$(document).ready(function () {

    var vouchersoptlist

    const models = require("../../../models");

    const Op = require('../../../models').Sequelize.Op;

    var sequelize = require('sequelize')

    $(function () {
        $('[data-toggle="popover"]').popover()
    })

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
                "searchable": false,
                "width": "10%",
            },
            {
                targets: 2,
                className: 'dt-body-left dt-head-center',
                "searchable": true,
                "width": "50%",
            },
            {
                targets: 3,
                className: 'dt-body-right dt-head-center',
                "searchable": true,
                "width": "15%",
            },
            {
                targets: 4,
                className: 'dt-body-center dt-head-center',
                "searchable": false,
                "width": "15%",
            },
        ]
    })

    const ipc = require('electron').ipcRenderer

    $('#find_vouchers').click(function () {

        var startDate = moment($('#date_from').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var endDate = moment($('#date_to').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

        GetVouchersList(startDate, endDate).then(function (voucherslist) {

            console.log(voucherslist)

            $('#vou_list_table').dataTable().fnClearTable()

            for (var i = 0; i < voucherslist.length; i++) {

                $('#vou_list_table').dataTable().fnAddData([
                    moment(voucherslist[i].vou_date).format('DD/MM/YYYY'),
                    voucherslist[i].vou_no,
                    '<a href="#" class="vou_id_link" id="' + voucherslist[i].vou_no + '">' + voucherslist[i].vou_desc + '</a>',
                    Number(voucherslist[i].drtotal).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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
                    console.log(result)

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

    async function GetVouchersList(startDate, endDate) {

        var voucherslist = await models.voucher.findAll({
            attributes: ['vou_date', 'vou_no', 'vou_desc', [sequelize.fn('sum', sequelize.col('vou_amt')), 'drtotal']],
            where:
            {
                'led_treat': 'Dr',
                'vou_date': {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['vou_no'],
            raw: true,
        })

        return voucherslist;

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


