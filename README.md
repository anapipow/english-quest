# English Quest ✦

Miniapp mobile-first para praticar inglês A2–B1 em viagens, conversas cotidianas, entrevistas com cineastas, festivais de cinema e negócios internacionais. Sem login, backend, API paga ou dependências de produção.

## Uma prática puxa a próxima

- **Jornada:** três atividades sugeridas, sem obrigação de ordem ou sequência. A seleção é salva no navegador: recarregar não embaralha atividades pendentes. Cada conclusão substitui apenas o cartão correspondente, variando as modalidades. A trilha é renovada na troca de dia local, sem recarga (verificação a cada 15 segundos e ao voltar ao app), sem interromper uma atividade aberta. O modo de 5 minutos sugere 1 minuto de preparação, 3 de conversa e 1 de reflexão.
- **Praticar:** biblioteca de 35 atividades com filtros combináveis de modalidade, tema e duração (2–5, 5–10 e 10–15 minutos). Nos limites, 5 minutos pertencem à faixa curta e 10 à intermediária, evitando duplicar resultados entre faixas.
- **Conversação:** dez situações distintas e roteiros para usar no ChatGPT por voz, com expressões de apoio. O miniapp não acessa o microfone, integra o ChatGPT nem avalia sua fala. O roteiro precisa ser enviado em outra aba/aplicativo e o modo de voz depende da sua conta. Falar as respostas em voz alta também é uma alternativa.
- **Listening:** dez atividades de áudio sintetizado pelo dispositivo, com duas perguntas cada. É possível parar, ouvir novamente ou abrir a transcrição. O áudio não é uma gravação humana; sotaque e qualidade dependem da voz instalada.
- **Reading:** dez atividades com textos originais e perguntas de compreensão.
- **Desafios rápidos:** cinco situações com feedback objetivo sobre a expressão escolhida.
- **Progresso:** histórico completo, reflexões, dias de prática, XP, níveis e conquistas. “Continuar estudando” e “Mais uma atividade” iniciam uma prática nova, na primeira etapa, sem reaproveitar respostas, confirmação oral ou reflexão de rascunhos antigos. A seleção alterna modalidades e prioriza atividades inéditas. A trilha e as sugestões evitam exercícios realizados nos últimos três dias quando há alternativas; depois disso, priorizam as revisões mais antigas. O tema escolhido é um critério de preferência, não um bloqueio que obriga a repetir exercícios recentes. Com o catálogo esgotado, revisões são permitidas, sem repetir imediatamente a atividade anterior. Depois de concluir, escolha “Mais uma atividade”, “Escolher outra” ou apenas descanse.

Pode repetir qualquer atividade no mesmo dia. Cada nova prática recebe uma identificação única e concede XP ao concluir as perguntas ou confirmar a prática oral. Recarregar, retornar de outra aba ou clicar duas vezes não concede XP novamente à mesma prática. Durações são estimativas, sem cronômetro obrigatório. Não há punição por pausas.

## Preservação dos dados do MVP

A chave **`english-quest`** em `localStorage` permanece a mesma. Não há limpeza do armazenamento nem migração destrutiva. XP (incluindo os 40 XP iniciais de quem já estudou), histórico, reflexões, tema e campos desconhecidos são mantidos. Conquistas existentes continuam válidas: sessões antigas sem modalidade contam como conversação. O total antigo de XP não é recalculado a partir do histórico.

Novos registros acrescentam `activityId`, `mode`, `minutes` e uma identificação única de tentativa. `activeAttempt` guarda a prática atual para retomar depois de recarregar; `practiceDrafts` mantém práticas interrompidas quando você escolhe outra. Abrir diretamente uma atividade pela biblioteca ou tocar em “Retomar atividade” permite continuar seu rascunho. “Mais uma atividade” e “Continuar estudando” sempre criam uma tentativa limpa, mesmo se houver um rascunho antigo do exercício sugerido. Após concluir, abrir novamente começa uma nova prática. `dailyPlan` guarda a data local e os três cartões pendentes; sua atualização não altera XP, histórico, reflexões ou conquistas. Reflexões são exibidas como texto, nunca como HTML.

Cada gravação parte da versão mais recente do armazenamento. Web Locks serializa as atualizações entre abas em navegadores compatíveis (incluindo Chromium atual). Sem essa API, há releitura síncrona antes de gravar; prefira uma aba por vez nesses navegadores. Dados ilegíveis não são sobrescritos; falhas de armazenamento são informadas e não geram confirmação de conclusão salva.

Os dados continuam locais ao mesmo navegador e origem. Use o endereço habitual publicado: mudar de navegador, de domínio ou de perfil não transfere o progresso. Limpar os dados do navegador apaga o histórico; não é preciso fazer isso para atualizar o aplicativo. Esta versão não oferece sincronização entre aparelhos, backup automático ou funcionamento offline.

## Desenvolvimento e testes

Requer Node.js 20.19+ ou 22.12+ (validado com Node 24) e npm.

```sh
cd /workspace/english-quest
npm ci
npm run dev
```

Use o preview/encaminhamento de porta 5173 do editor, se disponível. Um endereço de loopback da máquina na nuvem não abre diretamente no celular. O servidor de desenvolvimento não é uma hospedagem pública definitiva.

```sh
npm test          # Testes de dados legados, XP, catálogo, filtros e trilha dinâmica
npm run test:e2e  # Fluxos no Chromium, mobile e desktop
npm run build    # Site estático em dist/, com assets relativos
npm run test:pages # Build já gerado, servido em /english-quest/
npm run preview  # Conferir o build na porta 4173
```

Para os testes de navegador, usa-se `/usr/bin/chromium` se disponível; em outras máquinas execute `npx playwright install chromium`. No CI, `npx playwright install --with-deps chromium` instala o navegador e as bibliotecas necessárias. Os testes usam dados fictícios isolados, nunca os dados do aparelho da usuária.

## Revisão e publicação pelo celular

Esta alteração deve ser revisada em um PR separado para `main`. O workflow executa testes e build nos PRs, mas o job de deploy só aceita `refs/heads/main`. Enviar a branch ou abrir o PR não publica o app.

**Não faça merge ou publique até autorizar a versão.** Após sua revisão e confirmação:

1. Faça o merge do PR na interface do GitHub.
2. O workflow de Pages existente será iniciado pelo push na `main`; não é necessário executar comandos no celular.
3. Confira o resultado em **Actions → Deploy English Quest**. Se Pages ainda não estiver configurado, escolha **Settings → Pages → Source → GitHub Actions**.
4. Use o endereço habitual, normalmente `https://anapipow.github.io/english-quest/`.

## Teste manual no Samsung Android

Use Samsung Internet ou Chrome atualizado, no mesmo navegador em que seu progresso já existe. Não limpe dados nem use aba anônima para conferir o histórico real.

1. Antes da atualização, anote o XP e os últimos registros. Após abrir a versão autorizada, confirme os mesmos totais, reflexões, dias e conquistas. Se precisar atualizar, recarregue a página normalmente.
2. Em **Progresso → Continuar estudando**, complete uma atividade. Toque em **Mais uma atividade** e conclua outra no mesmo dia. Feche/reabra o navegador e confira as duas no histórico e a soma do XP.
3. Em **Praticar**, combine modalidade, tema e duração; experimente uma combinação sem resultados e “Limpar filtros”. Repita uma atividade já concluída para conferir que uma nova prática é permitida.
4. Em **Listening**, toque em “Ouvir em inglês”, “Parar áudio” e ouça novamente. Caso não haja voz, abra a transcrição. Em **Configurações do aparelho → Gerenciamento geral → Leitura de texto/Saída de texto para voz** (o nome varia), verifique o mecanismo Samsung/Google e os dados de voz em inglês. Vozes podem carregar com atraso ou exigir download/rede; o sistema pode interromper o áudio ao trocar de aplicativo. A interface não comprova qualidade de pronúncia.
5. Em **Conversação**, copie o roteiro, abra o ChatGPT, cole/envie e ative voz se disponível. Sem permissão de copiar, selecione e copie o texto manualmente. Volte pelo seletor de abas/aplicativos, confirme que falou e conclua. O miniapp não sabe o que foi dito no ChatGPT.
6. Recarregue durante uma leitura ou reflexão; na Jornada, toque em **Retomar atividade**. As respostas e o texto digitado devem voltar, sem XP antecipado. Concluir a mesma tentativa em duas abas não deve duplicar o XP.
7. Confira retrato/paisagem, teclado aberto na reflexão, texto ampliado, TalkBack e navegação de foco. As larguras 320/390/768 px são cobertas por testes no Chromium, mas não substituem a verificação física de áudio e acessibilidade no Samsung.

## Organização

- `src/content.js`: temas e situações iniciais de conversação.
- `src/activities.js`: catálogo original, modalidades, filtros, trilha, sugestões e roteiros.
- `src/progress.js`: leitura/gravação retrocompatível, XP e datas locais.
- `src/views.js`: Jornada, biblioteca e progresso, com escape de dados pessoais.
- `src/main.js`: navegação, execução/retomada das atividades, áudio e persistência.
- `src/style.css`: estética original e layouts responsivos.

## Conferência das correções da trilha e continuação

- Na Jornada, conclua um cartão da trilha. Ao voltar, só esse cartão deve ter sido substituído; os outros dois permanecem. Recarregue e confira a mesma seleção pendente.
- Deixe a aba aberta até a troca de dia local, ou retorne ao navegador no dia seguinte. A trilha deve ser renovada automaticamente. Uma atividade já aberta e sua reflexão devem continuar intactas.
- Complete várias atividades usando “Mais uma atividade”: cada uma deve começar na primeira etapa, sem respostas selecionadas nem confirmação oral marcada. Antes de concluir, confira que o XP não mudou.
- Mesmo que um exercício já tenha um rascunho na etapa de registro, o botão de nova atividade não deve pular etapas. Retomar deliberadamente pela Jornada continua funcionando.
- Confira XP, registros anteriores e conquistas antes e depois dos testes. Não limpe o armazenamento. Os testes automatizados simulam a mudança de dia e rascunhos antigos com dados fictícios.
