using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoCliente
    {
        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public long Incluir(DML.Cliente cliente)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Incluir(cliente);
        }

        /// <summary>
        /// Inclui as dependencias de um cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public void IncluirDependencias(List<Beneficiario> ListaBeneficiarios, long IdCliente)
        {
            DAL.DaoBeneficiario DaoBeneficiario = new DAL.DaoBeneficiario();

            if (ListaBeneficiarios != null && ListaBeneficiarios.Count() > 0)
            {
                foreach (var item in ListaBeneficiarios.ToList())
                {
                    if (item.Id == -1)
                    {
                        item.IdCliente = IdCliente;
                        DaoBeneficiario.Incluir(item);
                    }
                }
            }
        }


        /// <summary>
        /// Altera um cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public void Alterar(DML.Cliente cliente)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Alterar(cliente);
        }

        /// <summary>
        /// Altera as dependencias de um cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public void AlterarDependencias(List<Beneficiario> ListaBeneficiarios, List<Beneficiario> ListaBeneficiariosExcluidos)
        {
            DAL.DaoBeneficiario DaoBeneficiario = new DAL.DaoBeneficiario();


            if (ListaBeneficiariosExcluidos != null && ListaBeneficiariosExcluidos.Count() > 0)
            {
                foreach (var item in ListaBeneficiariosExcluidos)
                {
                    DaoBeneficiario.Excluir(item.Id);
                }
            }

            if (ListaBeneficiarios != null && ListaBeneficiarios.Count() > 0)
            {
                foreach (var item in ListaBeneficiarios.Where(x => x.Id == -1 || x.RegistroAlterado == true).ToList())
                {
                    if (item.Id == -1)
                        DaoBeneficiario.Incluir(item);
                    else
                        DaoBeneficiario.Alterar(item);
                }
            }
        }

        /// <summary>
        /// Consulta o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public DML.Cliente Consultar(long id)
        {
            DAL.DaoCliente daocli = new DAL.DaoCliente();
            DML.Cliente cli = daocli.Consultar(id);

            //Carregar Dependências
            cli.ListBeneficiarios = new BoBeneficiario().GetListBeneficiariosByIDCliente(cli.Id);

            return cli;
        }

        /// <summary>
        /// Excluir o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public void Excluir(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Excluir(id);
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Listar()
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Listar();
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Pesquisa(iniciarEm,  quantidade, campoOrdenacao, crescente, out qtd);
        }

        /// <summary>
        /// VerificaExistencia
        /// </summary>
        /// <param name="CPF"></param>
        /// <returns></returns>
        public bool VerificarExistenciaCPF(string CPF)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.VerificarExistenciaCPF(CPF);
        }
    }
}
