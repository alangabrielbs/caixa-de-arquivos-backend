<h2 align="center">
<br>
  <img src="https://i.imgur.com/tuJpFR6.png" alt="GoBarber" width="150">
<br>
<br>
📦 Caixa de Arquivos - API
</h2>

<p align="center">📦 Caixa de Arquivos é um app clone do Dropbox e Google Drive, feito inteiramente com Node.js</p>

<hr />

## Features

- [x] Usuario
  - [x] Criar usuario
    - [x] Envio de email com link para verificar email
    - [x] Criar pasta root para o usuario
    - [x] Verificar se o email do usuario
  - [x] Update do usuario
  - [x] Update da senha do usuario
    - [x] Envio de email com link para mudar a senha
    - [x] Envio de email para avisar que a senha foi alterada
  - [x] Criar token para login
- [ ] Pastas
  - [x] Criar pasta
    - [x] Favoritar pasta
  - [x] Editar nome da pasta
  - [x] Compartilhar pasta com outro usuario
    - [x] Enviar email avisando o compartilhamento
  - [x] Remover compartilhamento de pasta
  - [ ] Mover pasta para lixeira
    - [ ] Mover arquivos dentro da pasta para a lixeira
  - [ ] Mover uma pasta
  - [x] Visualizar arquivos de uma pasta
  - [x] Visualizar subpasta de uma pasta
- [ ] Arquivos
  - [x] Upload de arquivos
    - [x] Upload de arquivos para uma pasta
  - [x] Editar nome do arquivo
  - [ ] Deletar um arquivo
  - [ ] Mover arquivo de pasta
- [ ] Lixeira
  - [ ] Mover arquivos deletados para a lixeira
  - [ ] Restaurar arquivos da lixeira
  - [ ] Deletar definitivamente arquivos da lixeira

## Dependências

- [Node.js](https://nodejs.org/en/) 8.0.0 ou >
- [Yarn](https://yarnpkg.com/pt-BR/docs/install)
- [Docker](https://www.docker.com/)

## Pré-requisitos

Para executar este servidor, você precisará de dois contêineres em execução na sua máquina.

Para fazer isso, você precisará executar os seguintes comandos:

- `docker run --name mongoCaixaDeArquivos -p 27017:27017 -d -t mongo`;
- `docker run --name redisCaixaDeArquivos -p 6379:6379 -d -t redis:alpine`;

_Lembre-se: Se você reiniciar sua máquina, será necessário iniciar novamente o servidor com `docker start <container_id>`._

## Iniciando o projeto

1. Clone este repositório usando `git@github.com:alangabrielbs/caixa-de-arquivos-backend.git`
2. Vá para o diretório apropriado: `cd caixa-de-arquivos-backend`.<br />
3. Execute `yarn` para instalar dependências.<br />
4. Copie o arquivo `.env.example` e renomeie-o para`.env`.<br/>
5. Adicione todos os valores para as variáveis de ambiente.<br/>
6. Execute `yarn start` e `yarn queue` para executar os servidores em `http://localhost:3333/v1`.
