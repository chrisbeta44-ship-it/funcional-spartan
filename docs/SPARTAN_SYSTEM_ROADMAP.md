# Spartan System — Roadmap de Entrega

Este roadmap transforma a especificação funcional versão 1.0 em entregas verificáveis. A ordem abaixo é de dependência técnica; os 24 módulos permanecem no escopo aprovado.

## Fase 0 — Descoberta e proteção da operação atual

- Inventariar o que já existe no repositório, banco e integrações.
- Manter o Next Fit como fonte oficial durante a construção.
- Separar ambientes e branches.
- Definir regras comerciais, papéis, unidades e políticas de acesso.
- Não executar mudanças no PC da recepção nem na catraca atual.

**Aceite:** inventário, arquitetura e plano de segurança revisados.

## Fase 1 — Fundação multiunidade

- Organizações e unidades.
- Usuários, papéis e permissões.
- Autenticação, sessão e recuperação.
- Auditoria e configurações.
- Migrações versionadas e RLS por organização/unidade.
- Layout Spartan System responsivo e navegação.

**Aceite:** usuário de uma organização não consegue ler ou alterar dados de outra; acesso por unidade é validado no servidor.

## Fase 2 — Operação central

- Dashboard e indicadores.
- Alunos e relacionamento.
- Planos, matrículas e contratos.
- Histórico do aluno.
- Importação de teste com prévia, validação e relatório de erros.

**Aceite:** cadastro, matrícula, renovação, cancelamento e histórico passam nos testes sem duplicidade.

## Fase 3 — Financeiro

- Contas a receber e pagar.
- Pagamentos parciais, alocação e estorno.
- Caixa, fechamento e conciliação.
- Cobrança, acordos e inadimplência.
- Integração com gateway em sandbox antes de produção.

**Aceite:** venda não equivale a recebimento; estornos preservam histórico; valores reconciliáveis.

## Fase 4 — Treinamento e evolução

- Biblioteca de exercícios.
- Editor e versões de treino.
- Execução do aluno.
- Avaliações, medidas, bioimpedância e relatórios.
- Controles de acesso a dados de saúde e fotos.

**Aceite:** histórico preservado, consentimentos registrados e permissões testadas.

## Fase 5 — Frequência e Spartan Access

- Painel de acessos.
- Política central de autorização.
- Agente Windows em modo simulador.
- Fila local e sincronização idempotente.
- Adaptador Proveu Tupã CP2 somente após SDK/protocolo oficial.
- Testes de eventos autorizados/negados, offline e reconexão em ambiente isolado.

**Aceite:** não há comando real de liberação até a validação formal do protocolo e plano de teste; nenhuma interferência no Next Fit.

## Fase 6 — Agenda, relacionamento e operação comercial

- Agenda, aulas, reservas e presenças.
- CRM e funil.
- Comunicação e WhatsApp por provedor autorizado.
- Produtos, estoque e vendas.
- Convênios/parcerias.

**Aceite:** capacidade, duplicidade, opt-out, estoque e conciliação testados.

## Fase 7 — Área do aluno e documentos

- PWA e login do aluno.
- Treinos, avaliações, agenda e pagamentos.
- Documentos, termos e assinaturas via provedor apropriado.
- Acesso por registro, com autorização no servidor.

**Aceite:** aluno não acessa dados de outro aluno alterando URL ou requisição.

## Fase 8 — Relatórios, IA e integrações

- Construtor e exportação de relatórios.
- Indicadores com fórmulas documentadas.
- Assistente gerencial somente leitura inicialmente.
- Ações sugeridas exigem revisão e confirmação humana.
- Integrações monitoradas, com logs sanitizados.

**Aceite:** relatórios reconciliáveis e IA não executa ações críticas autonomamente.

## Fase 9 — Migração e entrada em produção

- Exportação autorizada do Next Fit.
- Mapeamento, limpeza e importação em homologação.
- Conferência de alunos, contratos, vencimentos, pagamentos e saldos.
- Operação paralela e plano de retorno.
- Virada controlada somente após aprovação formal.

**Aceite:** totais conferidos, backups restauráveis, treinamento da equipe e plano de retorno aprovado.

## Regra de mudança

Toda nova funcionalidade deve ter: problema que resolve, usuário responsável, regras, permissões, dados afetados, critérios de aceite e plano de teste. Não implementar por mera paridade com outro produto.
