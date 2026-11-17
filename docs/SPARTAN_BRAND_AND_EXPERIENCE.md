# Spartan System — Direção Visual e Experiência

## Direção aprovada

A identidade visual deve seguir as referências fornecidas pelo proprietário em 17/11/2026:
- Preto profundo como base.
- Laranja vivo/metálico como cor de ação e destaque.
- Prata/branco para tipografia e elementos de contraste.
- Iluminação quente, contornos e brilhos laranja usados com moderação.
- Logo oficial da Academia Spartan como marca principal.
- Personagens 3D recorrentes para comunicação, onboarding e áreas institucionais.
- Personagens com roupas esportivas pretas e aplicação da marca Spartan.
- Layouts desktop e mobile coerentes, com navegação adaptada por dispositivo.

As imagens fornecidas são referências/ativos do proprietário. Devem ser armazenadas em diretório de assets próprio após seleção e otimização. Não recriar a logo por texto nem usar imagens genéricas como substitutas definitivas.

## Princípios de interface

1. Visual premium, esportivo e forte, sem comprometer legibilidade.
2. Brilhos e efeitos 3D em áreas de marca, hero e chamadas; painéis operacionais devem priorizar clareza e velocidade.
3. Contraste acessível, foco visível, botões com estados hover/focus/disabled/loading.
4. Componentes e tokens compartilhados entre site, gestão e área do aluno.
5. Não usar personagens decorativos em tabelas, formulários ou fluxos financeiros.
6. Mobile-first na área do aluno; desktop-first no painel administrativo, com responsividade completa.
7. Não usar a mesma navegação para público, aluno e equipe administrativa.

## Tokens iniciais

- Background principal: #080808
- Superfície: #121212
- Superfície elevada: #1A1A1A
- Laranja principal: #F47721
- Laranja de destaque: #FF9A24
- Prata: #C7C7C7
- Texto principal: #F7F7F7
- Texto secundário: #A8A8A8
- Sucesso: #32B76A
- Alerta: #E8B34B
- Erro: #E45C4C

Tokens são ponto de partida; validar contraste e aparência com os arquivos oficiais da marca antes de congelar.

## Experiências do produto

### 1. Site institucional da Academia Spartan
Objetivo: apresentar a academia, converter visitantes em interessados/alunos e facilitar contato.
Estrutura prevista:
- Cabeçalho com logo e navegação.
- Hero com personagens/equipe, proposta de valor e CTA.
- Modalidades/serviços.
- Planos e condições comerciais.
- Estrutura/equipamentos e diferenciais.
- Horários e localização.
- Depoimentos/conteúdo institucional, quando fornecidos.
- Perguntas frequentes.
- Contato/WhatsApp e rodapé.
- CTA para cadastro e acesso do aluno.

Não publicar preços, horários, endereço, telefone ou promoções até confirmação do proprietário.

### 2. Painel administrativo
Objetivo: operação da academia.
- Navegação lateral com módulos e contexto da unidade.
- Barra superior com unidade ativa, busca, notificações e perfil.
- Dashboard com indicadores configuráveis.
- Listas com busca, filtros, paginação e ações em lote com confirmação.
- Formulários com validação e mensagens claras.
- Histórico/auditoria visível para ações relevantes.
- Layout denso, sóbrio e funcional; efeitos de brilho reduzidos.

### 3. Área do aluno / aplicativo PWA
Objetivo: autosserviço no celular.
- Início com status da matrícula e próximos compromissos.
- Treino atual e histórico.
- Agenda/reserva e confirmação de presença.
- Pagamentos e situação financeira.
- Avaliações e evolução, com acesso privado.
- Documentos e avisos.
- Perfil e suporte.
- Navegação inferior no celular e menu adaptável em telas maiores.

### 4. Spartan Access
Aplicativo Windows separado para comunicação com o dispositivo.
- Estado da conexão e identificação do equipamento.
- Eventos recentes e fila de sincronização.
- Estado do serviço e diagnóstico.
- Modo simulador claramente identificado.
- Adaptador Proveu desativado até SDK/protocolo autorizado e validado.
- Nenhum comando físico de liberação durante a fase de desenvolvimento.

## Personagens e ativos

Personagens 3D podem aparecer em:
- Hero institucional.
- Apresentação de modalidades.
- Onboarding e telas vazias amigáveis.
- Campanhas e avisos.

Não devem aparecer em excesso em áreas de administração. Uniformes devem ser pretos, com logo oficial em local coerente e proporções realistas. Não alterar nem redesenhar a marca original.

## Separação de produtos e preservação

O site Funcional Spartan já existente é um produto/experiência separado. A nova experiência institucional da Academia Spartan deve ser construída em rota, aplicação ou repositório isolado, após decisão de arquitetura, sem sobrescrever o site atual.

O Next Fit permanece operacional durante o desenvolvimento. Nenhuma integração real com catraca ou migração de dados ocorre sem documentação, ambiente seguro, backup e autorização explícita.

## Pendências que dependem do proprietário

- Nome comercial oficial exibido no site: Academia Spartan ou Funcional Spartan.
- Endereço, telefone, WhatsApp e redes sociais.
- Modalidades e serviços que devem aparecer publicamente.
- Planos, preços, taxas, regras e promoções atuais.
- Horários de funcionamento e grade de aulas.
- Fotos reais da academia, equipe e equipamentos.
- Política de matrícula, cancelamento e congelamento.
- Recursos desejados no app do aluno.
- Papéis e permissões da equipe.
- Regras de acesso à catraca e contingência.
