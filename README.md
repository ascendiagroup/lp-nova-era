# lp-nova-era

Site da Nova Era Diagnósticos, publicado em https://novaeradiagnosticos.com.br.

## Estrutura

- `site-nova-era/` é a pasta publicada. A página principal é `site-nova-era/index.html`.

## Deploy

Hospedado na Cloudflare (Workers com static assets), configurado em `wrangler.jsonc`.
Todo push na `main` vai para produção automaticamente.

- Build command: vazio (HTML estático)
- Deploy command: `npx wrangler deploy`
- Pasta publicada: `site-nova-era` (definida em `wrangler.jsonc`)

Para atualizar o site, edite `site-nova-era/index.html` (mantenha esse nome) e dê push na `main`.
Novos arquivos (imagens, CSS, outras páginas) devem ficar dentro de `site-nova-era/`.
