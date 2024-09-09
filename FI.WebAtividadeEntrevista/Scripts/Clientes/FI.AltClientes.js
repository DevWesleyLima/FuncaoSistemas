var CPFCarregado = "";

$(document).ready(function () {

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);

        CPFCarregado = $('#CPF').val().replace(/\D/g, '');
    }

    $('#CPF').blur(function () {
        FormatarEValidarCPF($('#CPF').val(), VerificaValidarCPFExistente());
    });

    $('#CPFBeneficiario').blur(function () {
        FormatarEValidarCPFBeneficiario($('#CPFBeneficiario').val(), VerificaValidarCPFAlterarBeneficiarioExistente());
    });
            
    $('#BtnBeneficiariosModal').on("click", function () {
        GerarListaBeneficionarios();
    });

    $('#BtnCancelarAlterarBeneficiario').on("click", function () {
        ConfigurarJanelaBeneficiario(false);
        IDAlterarBeneficiario = -1;
    });

    $('#BtnCloseBeneficiarioModal').on("click", function () {
        RemoverListaBeneficionarios();
    });
    
    $('#BtnIncluirBeneficiario').on("click", function () {
        let IdCliente = -1;

        if ($("#CPFBeneficiario").val() === "" ||
            $("#CPFBeneficiario").val() === null ||
            $("#CPFBeneficiario").val().trim() === "") {
            ModalDialog(Msg_Alert, "Por favor, preencha o Campo CPF do Beneficiário.")
        }
        else if ($("#NomeBeneficiario").val() === "" ||
            $("#NomeBeneficiario").val() === null ||
            $("#NomeBeneficiario").val().trim() === "") {
            ModalDialog(Msg_Alert, "Por favor, preencha o Campo Nome do Beneficiário.")
        }
        else
        {
            if (obj.Id !== undefined && obj.Id !== null)
                IdCliente = obj.Id;

            IncluirBeneficiario(IdCliente);
        }
    });

    $('#BtnAlterarBeneficiario').on("click", function () {
        AlterarBeneficiario();
    });   

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        if (ValidarCPFSalvar($('#CPF').val())) {
            $.ajax({
                url: urlPost,
                method: "POST",
                data: {
                    "NOME": $(this).find("#Nome").val(),
                    "CEP": $(this).find("#CEP").val(),
                    "CPF": $(this).find("#CPF").val(),
                    "Email": $(this).find("#Email").val(),
                    "Sobrenome": $(this).find("#Sobrenome").val(),
                    "Nacionalidade": $(this).find("#Nacionalidade").val(),
                    "Estado": $(this).find("#Estado").val(),
                    "Cidade": $(this).find("#Cidade").val(),
                    "Logradouro": $(this).find("#Logradouro").val(),
                    "Telefone": $(this).find("#Telefone").val()
                },
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success:
                    function (r) {
                        ModalDialog("Sucesso!", r)
                        $("#formCadastro")[0].reset();
                        window.location.href = urlRetorno;
                    }
            });
        }
    });
})
