# lp-nova-era

Site da Nova Era Diagnósticos, publicado em https://novaeradiagnosticos.com.br.

## Estrutura

- `site-nova-era/` é a pasta publicada. A página principal é `site-nova-era/index.html`.

## Deploy

Hospedado na Cloudflare Pages. Todo push na `main` vai para produção automaticamente.

- Build command: vazio (HTML estático)
- Build output directory: `site-nova-era`

Para atualizar o site, edite `site-nova-era/index.html` (mantenha esse nome) e dê push na `main`.
Novos arquivos (imagens, CSS, outras páginas) devem ficar dentro de `site-nova-era/`.
