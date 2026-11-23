# Planilha de contatos (formulário antes do WhatsApp)

Todo botão de WhatsApp do site abre um formulário (nome, WhatsApp e atendimento).
Ao enviar, o contato é gravado na planilha e a pessoa segue para o WhatsApp com a
mensagem já preenchida (exame/especialidade, nome, protocolo e `ad_id`).

## Instalação (uma vez)

1. Crie uma planilha no Google Sheets (ex.: "Leads site Nova Era").
2. Na planilha: **Extensões → Apps Script**.
3. Apague o conteúdo de `Código.gs` e cole o conteúdo de `Code.gs` desta pasta.
4. Em **Configurações do projeto** (engrenagem), defina o fuso horário como `America/Sao_Paulo`.
5. **Implantar → Nova implantação → tipo "App da Web"**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Autorize o acesso e copie a URL que termina em `/exec`.
7. Em `site-nova-era/index.html`, cole a URL em `leadEndpoint` dentro de `window.NOVA_ERA_CONFIG`:

   ```js
   leadEndpoint: 'https://script.google.com/macros/s/XXXXXXXX/exec'
   ```

A aba `Leads` e o cabeçalho são criados no primeiro contato. A coluna **Status** fica livre
para a equipe marcar quem já foi atendido.

## Alterar o script depois

Edite o código e use **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão**.
Assim a URL continua a mesma. Criar uma "Nova implantação" gera outra URL, que precisaria ser
trocada no site.

## Teste

Abra a URL `/exec` no navegador: deve aparecer `{"status":"ok"}`. Depois, preencha o formulário
no site e confira a linha nova na planilha.

Sem `leadEndpoint` configurado, o formulário continua funcionando e abre o WhatsApp, mas não grava.
