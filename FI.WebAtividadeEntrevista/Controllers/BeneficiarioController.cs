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
    public class BeneficiarioController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public ActionResult AlterarBeneficiarioList(Beneficiario beneficiario)
        {
            try
            {
                Beneficiario beneficiarioAlterado = new Beneficiario();

                if (beneficiario.Id == -1)
                {
                    beneficiarioAlterado = ClienteController.ListBeneficiariosStatic
                                                                        .Where(b => b.CPF == beneficiario.CPF)
                                                                        .FirstOrDefault();
                }
                else
                {
                    beneficiarioAlterado = ClienteController.ListBeneficiariosStatic
                                                                         .Where(b => b.Id == beneficiario.Id)
                                                                         .FirstOrDefault();
                }

                if (beneficiarioAlterado != null)
                {
                    beneficiarioAlterado.CPF = beneficiario.CPF;
                    beneficiarioAlterado.Nome = beneficiario.Nome;
                    beneficiarioAlterado.RegistroAlterado = true;
                }                

                return Json(new { Result = "OK", Record = true });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult ExcluirBeneficiarioList(long id)
        {
            try
            {
                Beneficiario BeneficiarioExcluido = ClienteController.ListBeneficiariosStatic.FirstOrDefault(X => X.Id == id);
                ClienteController.ListBeneficiariosExcluidosStatic.Add(BeneficiarioExcluido);
                ClienteController.ListBeneficiariosStatic.Remove(BeneficiarioExcluido);
                return Json(new { Result = "OK", Record = true });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }


        [HttpPost]
        public ActionResult IncluirBeneficiarioList(Beneficiario beneficiario)
        {
            try
            {
                var PossuiCPFBeneficiarioExistente = ClienteController.ListBeneficiariosStatic.Any(X => X.CPF == beneficiario.CPF);

                if (!PossuiCPFBeneficiarioExistente)
                {
                    ClienteController.ListBeneficiariosStatic.Add(beneficiario);

                    return Json(new { Result = "OK", Record = true });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = "Já existe um cadastro com o CPF informado, verifique." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult BeneficiarioList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                //Return result to jTable
                return Json(new { Result = "OK", Records = ClienteController.ListBeneficiariosStatic, TotalRecordCount = 0 });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult VerificarCPFBeneficiarioExistente(string cpf)
        {
            try
            {
                var PossuiCPFBeneficiarioExistente = ClienteController.ListBeneficiariosStatic.Any(X => X.CPF == cpf);

                return Json(new { Result = "OK", Record = PossuiCPFBeneficiarioExistente });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }      
    }
}