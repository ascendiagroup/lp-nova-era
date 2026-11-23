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

A aba `Leads` e o cabeçalho são criados no primeiro contato. A coluna `status` fica livre
para a equipe marcar quem já foi atendido.

## Colunas da planilha

Os nomes seguem os parâmetros padrão do Google (UTMs do GA4 e IDs de clique do Google Ads),
para facilitar a integração com outros sistemas e a importação de conversões offline.

| Coluna | Conteúdo |
|---|---|
| `created_at` | Data/hora do envio, `yyyy-MM-dd HH:mm:ss-03:00` (formato da importação de conversões do Google Ads) |
| `lead_id` | ID único do contato (UUID) |
| `name` | Nome informado |
| `phone` | Telefone em E.164 (`+5562999999999`) |
| `interest` / `interest_type` | Atendimento escolhido (ex.: `Raio-X` / `exame`, `Cardiologia` / `consulta`) |
| `cta` | Botão clicado (mesmo código do `Protocolo: NE-...` da mensagem) |
| `ad_id` | ID do anúncio, vindo do parâmetro `ad_id` do link |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_term`, `utm_content` | UTMs do link |
| `gclid`, `gbraid`, `wbraid` | IDs de clique do Google Ads (codificação automática) |
| `fbclid` | ID de clique do Meta |
| `landing_page`, `referrer` | Página de entrada e origem |
| `status` | Livre para a equipe |

## Configuração no Google Ads

1. **Codificação automática ativada** (Administrador → Configurações da conta). É ela que
   adiciona `gclid`/`gbraid`/`wbraid`, usados para importar conversões offline.
2. **Sufixo do URL final** (Configurações da conta → Opções de URL do anúncio), para todas as campanhas:

   ```
   utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}&ad_id={creative}
   ```

   O Google troca `{campaignid}`, `{keyword}` e `{creative}` pelos IDs reais no clique.
   Em Performance Max o `{creative}` pode vir vazio; nesses casos o `gclid` identifica o clique.


## Alterar o script depois

Edite o código e use **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão**.
Assim a URL continua a mesma. Criar uma "Nova implantação" gera outra URL, que precisaria ser
trocada no site.

## Teste

Abra a URL `/exec` no navegador: deve aparecer `{"status":"ok"}`. Depois, preencha o formulário
no site e confira a linha nova na planilha.

Sem `leadEndpoint` configurado, o formulário continua funcionando e abre o WhatsApp, mas não grava.
