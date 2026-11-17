# Spartan System — Arquitetura

## Objetivo

Construir um sistema próprio para a Academia Spartan, orientado aos processos reais da academia e com identidade visual própria. A especificação funcional aprovada está em **Especificacao_Completa_Spartan_System.pdf** (versão 1.0, 17/11/2026).

O sistema deve suportar uma unidade inicialmente e permitir múltiplas unidades sem duplicar aplicações ou misturar dados.

## Princípios não negociáveis

1. **Operação paralela:** o Next Fit continua sendo a fonte operacional oficial até que a migração seja formalmente aprovada.
2. **Isolamento:** desenvolvimento, homologação e produção são ambientes separados.
3. **Tenant/unidade:** todo registro operacional pertence a uma organização e, quando aplicável, a uma unidade.
4. **Autorização no servidor:** esconder menus não substitui políticas de autorização no backend e RLS.
5. **Auditoria:** alterações relevantes guardam ator, data, entidade, ação e justificativa quando aplicável.
6. **Histórico preservado:** contratos, pagamentos, estornos e eventos de acesso não são apagados fisicamente.
7. **Integração segura:** integrações externas usam adaptadores, segredos protegidos, logs sanitizados, idempotência e filas.
8. **Sem pressupor compatibilidade:** a integração com a Proveu Tupã CP2 só será habilitada após documentação/SDK autorizado e validação em ambiente seguro.
9. **Privacidade:** biometria e dados de saúde são sensíveis; preferir guardar somente referência/identificador do equipamento, quando tecnicamente possível e juridicamente adequado.
10. **Identidade Spartan:** interface original, com preto, laranja e prata, sem copiar código, marca ou ativos proprietários de terceiros.

## Arquitetura lógica

- **Painel administrativo:** aplicação web responsiva para proprietário, recepção, instrutores e financeiro.
- **Área do aluno:** PWA/mobile web com acesso restrito aos próprios dados.
- **API/backend:** regras de negócio, autorização, validações e integrações.
- **Banco:** Supabase PostgreSQL.
- **Autenticação:** Supabase Auth; MFA recomendado para perfis privilegiados.
- **Arquivos:** Supabase Storage com políticas privadas.
- **Agente de acesso Windows:** aplicação/serviço local independente, com adaptador de dispositivo separado da lógica de negócio.
- **Integrações:** gateway de pagamento, WhatsApp Business/provedor, parceiros e dispositivo de acesso, cada qual por adaptador.

## Modelo multiunidade

Entidades de organização:

- `gym_organizations`: organização/empresa cliente do sistema.
- `gym_units`: unidades físicas pertencentes à organização.
- `gym_user_memberships`: vínculo do usuário com organização/unidade e papel.
- `gym_roles` e permissões: autorização por módulo e ação.

Entidades operacionais devem carregar `organization_id` e, quando o dado for específico de uma unidade, `unit_id`. Antes de adicionar essas colunas às tabelas existentes, criar migração revisável e plano de backfill. Não executar migração destrutiva.

Regras:
- UUID como chave primária.
- Chaves estrangeiras compostas ou validações que impeçam vínculo entre organizações diferentes.
- RLS deve verificar organização e unidade autorizadas para o usuário autenticado.
- Não confiar em `organization_id` enviado pelo navegador sem validação do servidor.
- Usuários podem ter acesso a uma ou mais unidades, conforme papel.
- Relatórios consolidados entre unidades exigem permissão explícita.

## Domínios funcionais

1. Identidade, organização, unidades e permissões.
2. Pessoas/alunos e relacionamento.
3. Planos, matrículas e contratos.
4. Financeiro, caixa e cobranças.
5. Treinos e biblioteca de exercícios.
6. Avaliações físicas e evolução.
7. Frequência e acesso.
8. Agenda e aulas coletivas.
9. Funcionários, usuários e permissões.
10. CRM, interessados e vendas.
11. Comunicação e WhatsApp.
12. Área do aluno/PWA.
13. Produtos e estoque.
14. Relatórios e indicadores.
15. Convênios e parcerias.
16. Documentos e contratos digitais.
17. Configurações gerais.
18. Inteligência artificial assistiva.
19. Modelo de dados e relacionamentos.
20. Integrações e arquitetura técnica.
21. Segurança, privacidade e LGPD.
22. Migração e operação paralela.
23. Testes e critérios de aceite.
24. Implantação e governança.

## Spartan Access — separação de responsabilidades

O agente Windows não deve conter regras comerciais duplicadas. Ele deve:
- manter conexão e estado do dispositivo;
- receber/consultar eventos conforme protocolo autorizado;
- receber uma lista/regras de autorização assinadas ou autenticadas;
- enfileirar eventos localmente com identificadores idempotentes;
- sincronizar eventos com a API quando houver rede;
- mostrar estado do dispositivo, fila, última comunicação e erros.

A API central calcula elegibilidade usando contrato, vigência, bloqueio, unidade, horário e política de acesso. A decisão final e o mecanismo de acionamento dependem das capacidades confirmadas no SDK/protocolo do fabricante.

**Proibição de segurança:** não testar comandos de escrita/liberação na catraca atualmente operada pelo Next Fit, não alterar IP/porta/configurações e não reutilizar DLLs proprietárias sem autorização. O modo inicial do agente é simulador.

## Ambientes e publicação

- Desenvolvimento: dados fictícios e credenciais de desenvolvimento.
- Homologação: cópia/importação autorizada e isolada, sem comunicação com a catraca em produção.
- Produção: somente após checklist de segurança, backup, testes e aprovação do proprietário.

Nenhum deploy automático para produção. Mudanças são feitas em branch própria, revisadas em pull request e validadas antes de merge.

## Critérios gerais de pronto

- Fluxo feliz e erros comuns testados.
- Permissões verificadas no servidor e RLS.
- Auditoria para ações sensíveis.
- Estados de carregamento, vazio, sucesso e falha.
- Dados de outra organização/unidade inacessíveis.
- Sem segredos no frontend ou logs.
- Documentação de operação e recuperação atualizada.
