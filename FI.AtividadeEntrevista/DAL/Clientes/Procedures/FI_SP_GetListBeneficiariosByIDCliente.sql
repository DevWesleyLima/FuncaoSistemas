﻿CREATE PROC FI_SP_GetListBeneficiariosByIDCliente
	@IDCLIENTE BIGINT
AS
BEGIN
	SELECT ID, CPF, NOME, IDCLIENTE FROM BENEFICIARIOS WHERE IDCLIENTE = @IDCLIENTE
END