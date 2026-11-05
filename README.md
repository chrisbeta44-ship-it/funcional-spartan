# Funcional Spartan

Site institucional responsivo para o projeto Funcional Spartan, com identidade visual preta e laranja.

## Arquivos
- `index.html`: site público
- `styles.css`: identidade visual e layout responsivo
- `app.js`: comportamentos da página
- `admin/index.html`: estrutura inicial da área administrativa
- `assets/`: pasta reservada para logo e vídeo oficiais

## Publicação gratuita
Conecte este repositório ao Cloudflare Pages. Configure a raiz do projeto como diretório de saída. Como o site é estático, não é necessário comando de build.

## Próximas etapas técnicas
1. Enviar o logo oficial para `assets/funcional-spartan-logo.png`.
2. Enviar o vídeo MP4 para `assets/funcional-spartan-chibi.mp4`.
3. Ativar login real com Supabase Auth.
4. Conectar o painel às tabelas de alunos, planos, presença e pagamentos já existentes.
5. Garantir que as operações administrativas sejam protegidas por autenticação e RLS.

**Segurança:** não publicar senha de administrador, chave `service_role` ou credenciais privadas no frontend.