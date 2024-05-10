## Gemini Container

>Projeto criado durante a imersão da Alura

### Funcionamento Prático
[Vídeo do YouTube](https://youtu.be/tmP_IyFb2WA)

<iframe width="560" height="315" src="https://youtu.be/tmP_IyFb2WA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Uso

- Necessário pegar a API_KEY do Google IA Studio [Aqui](https://aistudio.google.com/app/apikey)
- Necessário criar o arquivo .env na raiz do projeto e adicionar sua key (existe um .env.example que mostra o formato esperado)
- Necessário ter o node na versão 18 ou superior
- Necessário rodar um npm install
- Necessário ter o docker e o docker-compose instalados
- Necessário ter a aplicação fcontainer instalada
  - Essa aplicação é a responsável por criar os ambientes de desenvolvimento locais para uso com lojas de ecommerce Magento (Adobe Commerce)
  - Infelizmente essa aplicação ainda não esta disponível para o público, será disponibilizada como open source assim que eu achar que está estável o suficiente

### Rodando O Projeto
```bash
node index.js <pasta> [-s]
```
- sendo a pasta uma pasta de algum projeto que tenha o framework magento disponível
- -s (OPCIONAL) não executa o comando, apenas exibe o que seria executado no terminal
- a ordem dos parametros deve ser respeitada

> para simular, deixei um arquivo composer.json na pasta data/magento, aponte para ele e adicione o parametro -s

### Pontos de Atenção
- Como o retorno depende da IA do Goggle, nem sempre será correta, nesses casos nada acontece
  - o terminal vai exibir um ```false```
  - pode ser que a IA não tenha conseguido pegar nenhuma correspondência
  - pode ser que a IA não tenha conseguido pegar as versões corretas
- Muitas chamadas podem acabar com a cota de uso da API, então cuidado

### No Futuro
- Melhorar o prompt
- Adicionar suporte ao pandas (Danfo.js) para lidar somente com dados controlados
- Adicionar suporte a mais frameworks
- Adicionar suporte a criação dos ambientes de desenvolvimento de forma automática
