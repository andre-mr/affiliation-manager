# 🗒️ Gerenciador de Afiliação
Gerenciador de plataformas de marketing de afiliação.

<!-- SOBRE -->
## :page_with_curl: Sobre o projeto
Projeto privado, solicitado por um afiliado de marketing de e-commerce, com sua autorização para publicar o código-fonte.

O sistema é estruturado com uma API REST em Node.js com uma arquitetura de responsabilidade em camadas.
Usando MySQL para armazenar dados consumidos através de APIs de plataformas de afiliação.
Um frontend html/javascript simples, que consome a biblioteca Bootstrap e o gerador de tabelas Bootstrap Table com um estilo minimalista.
Tudo visando uma boa usabilidade, garantindo eficiência e simplicidade para hospedagem em servidores compartilhados de baixo custo.

### :construction: Feito com
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Javascript](https://developer.mozilla.org/en/JavaScript)
* [Bootstrap](https://getbootstrap.com)
* [Bootstrap Table](https://bootstrap-table.com/)
* [MySQL](https://www.mysql.com/)
* [Node.js](https://nodejs.org/)
#### Bibliotecas Node
* [Dotenv](https://www.npmjs.com/package/dotenv)
* [Express](https://www.npmjs.com/package/express)
* [Cors](https://www.npmjs.com/package/cors)
* [Node Fetch](https://www.npmjs.com/package/node-fetch)
* [Node MySQL 2](https://www.npmjs.com/package/mysql2)
* [Node Cron](https://www.npmjs.com/package/node-cron)


<!-- USO -->
## :desktop_computer: Uso básico
Informações básicas de uso:
* O usuário abre a URL e informa uma senha. Sem cadastro de usuários, apenas senha pois trata-se de um sistema de usuário único privado, por enquanto.
* A senha é salva no armazenamento da sessão do navegador e será utilizada sempre que uma solicitação for enviada por código.
* Uma lista de dados básicos é recebida com os dados da última atualização do servidor. Ao mesmo tempo, uma atualização do servidor é acionada, para que o usuário possa ler os dados enquanto a atualização estiver chegando.
* Todos os dias às 0h uma tarefa é executada para atualizar os dados das plataformas de afiliação, usando suas APIs. Os dados são preenchidos/atualizados no próprio banco de dados MySQL.
* O usuário pode trabalhar com dados do próprio banco de dados, com muitos filtros e opções de ordenação.

<!-- NOTAS PARA DESENVOLVEDORES -->
## ⌨️: Notas para desenvolvedores
#### :man_technologist: Node
O backend é servido pelo Node versão 16, estruturado em camadas, no momento servindo apenas requisições GET com o uso da biblioteca Express. A tarefa diária agendada para atualização do banco de dados é feita utilizando o pacote node-cron a fim de desvinculação da necessidade de agendamento externo via S.O.
#### :man_technologist: Bootstrap
O uso direto é mínimo, apenas porque a página é principalmente preenchida dinamicamente pelo Bootstrap Table com suas próprias opções de estilo.
#### :iphone: Responsividade
Destina-se a ser usado exclusivamente como uma tabela com um computador desktop, não compatível com dispositivos móveis. Apenas tolerante a alguns redimensionamentos.
#### :earth_americas: Idioma
A interface do usuário é toda em português brasileiro. Por outro lado, todo o código está em inglês.
#### 🔒: Dados confidenciais
Todos os dados confidenciais são armazenados apenas no servidor, principalmente como variáveis de ambiente, incluindo chave de API para todas as solicitações.

<!-- CONSIDERAÇÕES FINAIS -->
## Considerações finais
Este projeto está em desenvolvimento em abril/2022, com versão inicial trabalhando com dados de 1 plataforma. Outras plataformas estão sendo incluídas.
