﻿CREATE PROC FI_SP_IncCliente
	@CPF           VARCHAR (14),
    @NOME          VARCHAR (50) ,
    @SOBRENOME     VARCHAR (255),
    @NACIONALIDADE VARCHAR (50) ,
    @CEP           VARCHAR (9)  ,
    @ESTADO        VARCHAR (2)  ,
    @CIDADE        VARCHAR (50) ,
    @LOGRADOURO    VARCHAR (500),
    @EMAIL         VARCHAR (2079)
AS
BEGIN
	INSERT INTO CLIENTES (CPF) VALUES (@CPF)
END