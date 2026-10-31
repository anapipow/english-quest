# English Quest ✦

Miniapp mobile-first para praticar inglês em situações reais: viagens, conversas cotidianas, entrevistas com cineastas, festivais de cinema e negócios internacionais.

## O que funciona

- Missões com leitura, compreensão e áudio por síntese de voz do aparelho (quando disponível).
- Conversação como etapa central: roteiro pronto para copiar e usar no modo de voz do ChatGPT, em outra aba ou aplicativo. Não há integração automática, gravação nem avaliação de fala no miniapp.
- Prática normal ou modo de 5 minutos (1 min de preparação, 3 de conversa e 1 de reflexão). Os tempos são sugestões, sem cronômetro ou penalidade.
- XP, níveis, conquistas, últimos sete dias e histórico. Cada tema concede XP uma vez por dia em cada modalidade; continuar praticando é sempre permitido.
- Reflexão opcional e progresso local. Nada é enviado a um servidor. Os dados não são sincronizados entre aparelhos e são apagados ao limpar o armazenamento do navegador. O conteúdo enviado ao ChatGPT segue as condições desse serviço.

Sem cadastro, banco de dados, chaves de API, fontes externas ou serviços pagos necessários para o miniapp. O modo de voz depende da disponibilidade e dos limites da sua conta ChatGPT.

## Desenvolver e visualizar

Requer Node.js 20.19+ ou 22.12+ (validado aqui com Node 24) e npm.

```sh
cd /workspace/english-quest
npm ci
npm run dev
```

Abra a porta 5173 pela função de preview/encaminhamento de portas do seu editor, caso disponível. O endereço de loopback da máquina na nuvem não é acessível diretamente pelo seu celular. Para usar pelo celular sem depender dessa função, publique o site como descrito abaixo.

No seu computador, abra o endereço exibido pelo Vite; para testar com um celular na mesma rede, use o IP de rede do computador e a porta 5173. Não exponha o servidor de desenvolvimento publicamente como hospedagem definitiva.

```sh
npm test          # Regras de XP, datas, níveis e recuperação do armazenamento
npm run test:e2e  # Fluxo real de conversação, navegação e persistência em Chromium
npm run build    # Site estático na pasta dist/
npm run preview  # Conferir o build na porta 4173
```

Os testes de navegador usam Chromium instalado em `/usr/bin/chromium`, se disponível; em outras máquinas, execute `npx playwright install chromium` antes. A configuração cobre viewport de celular e desktop. Voz real e troca para o aplicativo ChatGPT precisam de conferência manual no aparelho.

## Enviar as alterações ao GitHub

A implementação não foi enviada automaticamente. Revise as alterações no painel de arquivos do seu editor/Codex e use sua opção de commit e envio ou criação de PR, se disponível. Em um terminal com permissão de escrita no repositório:

```sh
cd /workspace/english-quest
git switch -c feat/english-quest-mvp
git add .gitignore README.md index.html package.json package-lock.json playwright.config.js src tests .github
git commit -m "Build English Quest mobile-first MVP"
git push -u origin feat/english-quest-mvp
```

Abra um pull request no GitHub e faça o merge para `main`. A autenticação de leitura do ambiente não garante permissão de push. Nunca coloque tokens nos arquivos.

## Publicar o aplicativo pelo celular com GitHub Pages

1. Depois do merge, abra `github.com/anapipow/english-quest` no navegador do celular. Se necessário, use “Versão para computador”.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
3. Em **Actions → Deploy English Quest → Run workflow**, selecione `main` e execute. Futuras alterações em `main` também iniciam a publicação.
4. Ao concluir, o job `deploy` mostrará o endereço publicado; ele também aparece em **Settings → Pages**. Normalmente será `https://anapipow.github.io/english-quest/`.
5. Abra esse endereço no celular e use **Adicionar à tela de início**, se disponível no navegador. Esta versão precisa de conexão para abrir o site; não oferece instalação/offline por service worker.

O plano e a visibilidade do repositório precisam permitir GitHub Pages. Como alternativa, qualquer hospedagem estática pode servir o conteúdo de `dist/`.

## Conferência manual no celular

- Abrir uma missão, ouvir o texto e conferir se existe uma voz em inglês no aparelho.
- Copiar o roteiro (em HTTPS), abrir o ChatGPT, enviar o texto e iniciar a conversa por voz.
- Voltar ao miniapp, confirmar a prática e concluir; recarregar e conferir o progresso.
- Testar orientação horizontal, tamanho de texto do sistema e navegação com leitor de tela.

Arquitetura: JavaScript modular + CSS, Vite para desenvolvimento/build e Playwright para testes. Conteúdo em `src/content.js`, regras em `src/progress.js` e interface em `src/main.js`.
