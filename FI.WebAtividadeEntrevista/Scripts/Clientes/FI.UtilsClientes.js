const Msg_Alert = "Atenção";
const Msg_Error = "Ocorreu um erro";
const Msg_Sucess = "Sucesso!"

const Msg_CPFIncompleto = "CPF incompleto, verifique.";
const Msg_CPFInvalido = "CPF inválido, verifique.";
const Msg_CPFExistente = "Já existe um cadastro com o CPF informado, verifique."

function AtribuirValorCampoCPF(cpf) {
    $('#CPF').val(cpf);
}

function AtribuirValorCampoCPFBeneficiario(cpf) {
    $('#CPFBeneficiario').val(cpf);
}

function FormatarCPF(cpf) {
    var cpfFormatado = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d)/, '$1.$2');
    cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpfFormatado;
}

function FormatarEValidarCPF(cpfdigitado, validacpfexistente) {
    let cpfSomenteNumeros = cpfdigitado.replace(/\D/g, '');
    let cpfFormatado = FormatarCPF(cpfSomenteNumeros);

    AtribuirValorCampoCPF(cpfFormatado);

    if (cpfSomenteNumeros.length < 11) {
        ModalDialog(Msg_Alert, Msg_CPFIncompleto);
        return;
    }

    if (!ValidarCPFSomenteNumeros(cpfSomenteNumeros)) {
        ModalDialog(Msg_Alert, Msg_CPFInvalido);
        return;
    }

    if (validacpfexistente) {
        ValidarCPFExistente(cpfFormatado);
    }
}

function FormatarEValidarCPFBeneficiario(cpfdigitado, validacpfbeneficiarioexistente) {
    let cpfSomenteNumeros = cpfdigitado.replace(/\D/g, '');
    let cpfFormatado = FormatarCPF(cpfSomenteNumeros);

    AtribuirValorCampoCPFBeneficiario(cpfFormatado);

    if (cpfSomenteNumeros.length < 11) {
        ModalDialog(Msg_Alert, Msg_CPFIncompleto);
        return;
    }

    if (!ValidarCPFSomenteNumeros(cpfSomenteNumeros)) {
        ModalDialog(Msg_Alert, Msg_CPFInvalido);
        return;
    }

    if (validacpfbeneficiarioexistente) {
        ValidarCPFBeneficiarioExistente(cpfFormatado);
    }
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function ValidarCPFBeneficiarioExistente(cpfFormatado) {
    $.ajax({
        url: urlVerificarCPFBeneficiarioExistente,
        method: "POST",
        data: { cpf: cpfFormatado },
        error:
            function (r) {
                AtribuirValorCampoCPFBeneficiario("");

                if (r.status == 400)
                    ModalDialog(Msg_Error, r.responseJSON);
                else if (r.status == 500)
                    ModalDialog(Msg_Error, "Ocorreu um erro interno no servidor.");
            },
        success:
            function (r) {
                if (r.Result === "ERROR") {
                    AtribuirValorCampoCPFBeneficiario("");
                    ModalDialog(Msg_Error, r.Message);
                }
                else {
                    if (r.Result === "ERROR") {
                        AtribuirValorCampoCPFBeneficiario("");
                        ModalDialog(Msg_Error, r.Message);
                    }

                    if (r.Record == true) {
                        AtribuirValorCampoCPFBeneficiario("");
                        ModalDialog(Msg_Alert, Msg_CPFExistente);
                    }
                }
            }
    });
}

function ValidarCPFExistente(cpf) {
    $.ajax({
        url: urlVerificarCPFExistente,
        method: "POST",
        data: { cpf: cpf },
        error:
            function (r) {
                AtribuirValorCampoCPF("");

                if (r.status == 400)
                    ModalDialog(Msg_Error, r.responseJSON);
                else if (r.status == 500)
                    ModalDialog(Msg_Error, "Ocorreu um erro interno no servidor.");

            },
        success:
            function (r) {
                if (r.Result === "ERROR") {
                    AtribuirValorCampoCPF("");
                    ModalDialog(Msg_Error, r.Message);
                }

                if (r.Record == true) {
                    AtribuirValorCampoCPF("");
                    ModalDialog(Msg_Alert, Msg_CPFExistente);
                }
            }
    });
}

function ValidarCPFSalvar(cpfdigitado) {
    let cpfSomenteNumeros = cpfdigitado.replace(/\D/g, '');
    let cpfFormatado = FormatarCPF(cpfSomenteNumeros);

    AtribuirValorCampoCPF(cpfFormatado);

    if (cpfSomenteNumeros.length < 11) {
        ModalDialog(Msg_Alert, Msg_CPFIncompleto);
        return false;
    }

    if (!ValidarCPFSomenteNumeros(cpfSomenteNumeros)) {
        ModalDialog(Msg_Alert, Msg_CPFInvalido);
        return false;
    }

    return true;
}

function ValidarCPFSomenteNumeros(cpf) {

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Valida o primeiro dígito verificador
    var soma = 0;
    for (var i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    var resto = soma % 11;
    var digito1 = (resto < 2) ? 0 : 11 - resto;

    if (parseInt(cpf.charAt(9)) !== digito1) return false;

    // Valida o segundo dígito verificador
    soma = 0;
    for (i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    var digito2 = (resto < 2) ? 0 : 11 - resto;

    return parseInt(cpf.charAt(10)) === digito2;
}

function VerificaValidarCPFExistente() {
    if (CPFCarregado !== "") {
        if (CPFCarregado === $('#CPF').val().replace(/\D/g, ''))
            return false;
    }

    return true;
}

function VerificaValidarCPFAlterarBeneficiarioExistente() {
    if (CPFAlterarBeneficiarioCarregado !== "") {
        if (CPFAlterarBeneficiarioCarregado === $('#CPFBeneficiario').val().replace(/\D/g, ''))
            return false;
    }

    return true;
}

