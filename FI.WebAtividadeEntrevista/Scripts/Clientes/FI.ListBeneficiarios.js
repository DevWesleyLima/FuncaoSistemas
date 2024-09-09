let IDAlterarBeneficiario = -1;
let CPFAlterarBeneficiarioCarregado = "";
function GerarListaBeneficionarios() {
    $('#gridBeneficiarios').jtable({
        paging: false, //Enable paging
        pageSize: 5, //Set page size (default: 10)
        sorting: true, //Enable sorting
        defaultSorting: 'Nome ASC', //Set default sorting
        actions: {
            listAction: urlBeneficiarioList
        },
        fields: {
            CPF: {
                title: 'CPF',
                width: '34%'
            },
            Nome: {
                title: 'Nome',
                width: '41%'
            },
            Alterar: {
                title: 'Ações',
                width: '25%',
                display: function (data) {
                    return '<div style="display: flex; justify-content: center; gap: 10px;">' +
                        '<button onclick="CarregarAlterarBeneficiario(' + data.record.Id + ', \'' + data.record.CPF + '\', \'' + data.record.Nome + '\')" class="btn btn-primary btn-sm">Alterar</button>' +
                        '<button onclick="ExcluirBeneficiario(' + data.record.Id + ')" class="btn btn-primary btn-sm">Excluir</button>' +
                        '</div>';                  
                }
            }
        },
        recordsLoaded: function () {         
            AjustarLayoutGridBeneficiarios();
        }
    });

    $('#gridBeneficiarios').jtable('load');
    $('footer').hide();
}

function IncluirBeneficiario(IdCliente) {    
    $.ajax({
        url: urlIncluirBeneficiarioList,
        method: "POST",
        data: {
            "Id": -1,
            "Nome": $("#NomeBeneficiario").val(),
            "Cpf": $("#CPFBeneficiario").val(),
            "IdCliente": IdCliente,
        },
        error:
            function (r) {                
                if (r.status == 400)
                    ModalDialog(Msg_Error, r.responseJSON);
                else if (r.status == 500)
                    ModalDialog(Msg_Error, "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                if (r.Result === "ERROR")
                    ModalDialog(Msg_Error, r.Message);
                else {
                    $("#CPFBeneficiario").val("");
                    $("#NomeBeneficiario").val("");

                    $('#gridBeneficiarios').jtable('load');
                    $('footer').hide();
                }
            }
    });
}

function CarregarAlterarBeneficiario(id, cpf, nome) {
    IDAlterarBeneficiario = id;
    CPFAlterarBeneficiarioCarregado = cpf.replace(/\D/g, '');
    ConfigurarJanelaBeneficiario(true, cpf, nome);
}

function ConfigurarJanelaBeneficiario(Alterar, cpf, nome) {
    if (Alterar) {
        $("#BtnIncluirBeneficiario").hide();
        $("#BtnAlterarBeneficiario").show();
        $("#BtnCancelarAlterarBeneficiario").show();
        $("#CPFBeneficiario").val(cpf);
        $("#NomeBeneficiario").val(nome);
    }
    else {
        $("#BtnIncluirBeneficiario").show();
        $("#BtnAlterarBeneficiario").hide();
        $("#BtnCancelarAlterarBeneficiario").hide();
        $("#CPFBeneficiario").val("");
        $("#NomeBeneficiario").val("");
    }
}

function AlterarBeneficiario() {
    $.ajax({
        url: urlAlterarBeneficiarioList,
        method: "POST",
        data: {
            "Id": IDAlterarBeneficiario,
            "CPF": $('#CPFBeneficiario').val(),
            "Nome": $('#NomeBeneficiario').val()
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog(Msg_Error, r.responseJSON);
                else if (r.status == 500)
                    ModalDialog(Msg_Error, "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                if (r.Result === "ERROR")
                    ModalDialog(Msg_Error, r.Message);
                else {                   
                    ConfigurarJanelaBeneficiario(false);

                    $('#gridBeneficiarios').jtable('load');
                    $('footer').hide();
                }
            }
    });

}

function ExcluirBeneficiario(id) {
    $.ajax({
        url: urlExcluirBeneficiarioList,
        method: "POST",
        data: {
            "Id": id,
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog(Msg_Error, r.responseJSON);
                else if (r.status == 500)
                    ModalDialog(Msg_Error, "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                if (r.Result === "ERROR")
                    ModalDialog(Msg_Error, r.Message);
                else {
                    ModalDialog(Msg_Sucess, "Beneficiário excluido com sucesso! Não se esqueça finalizar o cadastro clicando no botão Salvar.");
                    $("#CPFBeneficiario").val("");
                    $("#NomeBeneficiario").val("");

                    $('#gridBeneficiarios').jtable('load');
                    $('footer').hide();
                }
            }
    });
}

function RemoverListaBeneficionarios() {
    $('#gridBeneficiarios').jtable('destroy');
}

function AjustarLayoutGridBeneficiarios() {
    $('#gridBeneficiarios .jtable thead th').css({
        "background-color": "#ffffff",
        "color": "#333333",
        "padding": "0px",
        "text-align": "left",
        "font-weight": "bold",
        "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif",
        "font-size": "14px"
    });

    $('#gridBeneficiarios .jtable td').css({
        "background-color": "#fff"
    });

    $('.table thead > tr > th, .table tbody > tr > th, .table tfoot > tr > th,' +
        '.table thead > tr > td, .table tbody > tr > td, .table tfoot > tr > td').css({
            "vertical-align": "middle",
            "font-family": "Helvetica Neue, Helvetica, Arial, sans-serif",
            "font-size": "14px"
    });

    $('#gridBeneficiarios .jtable,' +
        '#gridBeneficiarios .jtable td').css('border', 'none');

    $('.jtable-column-selection-container').remove();
}
