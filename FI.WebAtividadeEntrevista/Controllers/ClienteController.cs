using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public static List<Beneficiario> ListBeneficiariosStatic = new List<Beneficiario>();
        public static List<Beneficiario> ListBeneficiariosExcluidosStatic = new List<Beneficiario>();

        public ActionResult Index()
        {
            ListBeneficiariosStatic.Clear();
            ListBeneficiariosExcluidosStatic.Clear();

            return View();
        }

        public ActionResult Incluir()
        {
            ListBeneficiariosStatic.Clear();
            ListBeneficiariosExcluidosStatic.Clear();

            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            try
            {
                BoCliente bo = new BoCliente();

                if (!this.ModelState.IsValid)
                {
                    List<string> erros = (from item in ModelState.Values
                                          from error in item.Errors
                                          select error.ErrorMessage).ToList();

                    Response.StatusCode = 400;
                    return Json(string.Join(Environment.NewLine, erros));
                }
                else
                {
                    model.Id = bo.Incluir(new Cliente()
                    {
                        CEP = model.CEP,
                        CPF = model.CPF,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone
                    });

                    bo.IncluirDependencias(ClienteController.ListBeneficiariosStatic, model.Id);


                    return Json("Cadastro efetuado com sucesso");
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }              

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    CPF = model.CPF,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone
                });

                bo.AlterarDependencias(ClienteController.ListBeneficiariosStatic, ClienteController.ListBeneficiariosExcluidosStatic);

                ListBeneficiariosStatic.Clear();
                ListBeneficiariosExcluidosStatic.Clear();

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            ListBeneficiariosStatic.Clear();
            ListBeneficiariosExcluidosStatic.Clear();

            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);

            if(cliente != null && cliente.ListBeneficiarios != null && cliente.ListBeneficiarios.Count > 0)
                ListBeneficiariosStatic.AddRange(cliente.ListBeneficiarios);
            
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    CPF = cliente.CPF,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    ListBeneficiarios = cliente.ListBeneficiarios
                }; 
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }               

        [HttpPost]
        public ActionResult VerificarCPFExistente(string cpf)
        {
            try
            {
                return Json(new { Result = "OK", Record = new BoCliente().VerificarExistenciaCPF(cpf) });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}