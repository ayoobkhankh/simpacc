
$(document).ready(function () {

    var ledgersoptlist

    const models = require("../../../models");

    const ipc = require('electron').ipcRenderer

    $(function () {
        $('[data-toggle="popover"]').popover()
    })

    async function ListOfLedgers() {

        var ledgerslist = await models.ledger.findAll({ attributes: ["id", "led_name", "acc_group", "acc_sub_group"], raw: true, })

        $('#led_list_table').DataTable({
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
                    className: 'dt-body-left dt-head-center',
                    "width": "50%",
                },
                {
                    targets: 2,
                    className: 'dt-body-center dt-head-center',
                    "searchable": false,
                    "width": "20%",
                },
                {
                    targets: 3,
                    className: 'dt-body-center dt-head-center',
                    "searchable": false,
                    "width": "20%",
                },

            ]

        })

        for (var i = 0; i < ledgerslist.length; i++) {

            $('#led_list_table').dataTable().fnAddData([
                ledgerslist[i].id,
                '<a href="#" class="led_id_link" id="' + ledgerslist[i].id + '">' + ledgerslist[i].led_name + '</a>',
                ledgerslist[i].acc_sub_group,
                ledgerslist[i].acc_group
            ]);

        }



        $(".led_id_link").click(function () {
            ipc.send('send_selected_ledger_id', { id: $(this).attr("id") })
            window.close();
        });


        $('#search_ledger').on('keyup click', function () {
            $('#led_list_table').DataTable().search($('#search_crit').val()).draw();
        });

        // table.columns().every(function () {
        //     var that = this;

        //     $('input', this.header()).on('keyup change clear', function () {
        //         if (that.search() !== this.value) {
        //             that
        //                 .search(this.value)
        //                 .draw();
        //         }
        //     });
        // });
    }

    ListOfLedgers()


})


