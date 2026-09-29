# Grupo Só Vendas — Arquitetura do Produto

Plataforma de intermediação em Angola (imóveis e viaturas), com consultor principal **Leonardo Jimi**. Objetivo comercial: gerar contactos qualificados e permitir gestão total dos anúncios sem tocar em código.

## 1. Modelo de negócio (resumo operacional)
- O Grupo Só Vendas não vende stock próprio: intermedeia bens de terceiros.
- O valor do site está em (a) mostrar oportunidades reais e atualizadas, (b) encurtar o caminho até à conversa no WhatsApp, (c) registar de onde veio cada contacto.
- Métrica central: nº de contactos por anúncio, não nº de visitas.

## 2. Mapa de páginas

**Área pública**
| Rota | Função comercial |
|---|---|
| `/` | Pesquisa em destaque + oportunidades recentes por tipo. A busca é o elemento principal, não um hero decorativo. |
| `/imoveis` | Listagem com filtros (tipo, província/município, preço, quartos, finalidade venda/arrendamento, estado). |
| `/imoveis/$slug` | Ficha do imóvel: galeria, preço, localização, características, consultor, ações de contacto. |
| `/viaturas` | Listagem com filtros (marca, modelo, ano, combustível, caixa, preço, estado). |
| `/viaturas/$slug` | Ficha da viatura. |
| `/consultor` | Página do Leonardo Jimi: área de atuação, como trabalha, contacto direto. |
| `/sobre` | Quem é o Grupo Só Vendas e como funciona a intermediação (comissões, processo, documentação). |
| `/contacto` | Formulário de contacto geral + pedido de procura específica ("procuro X em Y até Z Kz"). |
| WhatsApp flutuante | Presente em todas as páginas; nas fichas envia mensagem pré-preenchida com a referência do anúncio. |

**Painel administrativo** (`/admin`, protegido por login)
| Rota | Função |
|---|---|
| `/admin` | Resumo: anúncios publicados/rascunho, leads não lidas, anúncios com mais contactos. |
| `/admin/anuncios` | Lista única de todos os anúncios com filtros por tipo, estado e publicação. |
| `/admin/anuncios/novo` e `/editar/$id` | Formulário (imóvel ou viatura), fotos, preço, localização, descrição, estado. |
| `/admin/leads` | Contactos recebidos, com origem (anúncio, formulário geral, WhatsApp), estado de atendimento e notas. |
| `/admin/categorias-localizacoes` | Gestão de categorias e de províncias/municípios. |
| `/admin/definicoes` | Dados do consultor, número de WhatsApp, textos institucionais. |

## 3. Jornadas principais
1. **Comprador com intenção clara** — entra em `/`, pesquisa "apartamento, Luanda, até X Kz" → listagem filtrada → ficha → WhatsApp com referência. Lead registada automaticamente com o anúncio de origem.
2. **Visitante a explorar** — percorre `/imoveis` ou `/viaturas`, guarda/partilha a ficha (link direto partilhável no WhatsApp).
3. **Procura não satisfeita** — não encontra o que quer → formulário "diga-nos o que procura" → lead de procura no painel.
4. **Administrador** — login → novo anúncio → fotos + preço + localização → publica → acompanha leads e muda estado para Reservado/Vendido/Arrendado.

## 4. Entidades de dados

- **profiles** — utilizador autenticado (dados básicos).
- **user_roles** — papel (`admin`) em tabela separada, por segurança.
- **listings** — tabela central de anúncios: `id`, `slug`, `kind` (imovel | viatura), `title`, `description`, `purpose` (venda | arrendamento), `price`, `currency` (AOA por defeito), `price_on_request`, `status`, `published`, `featured`, `reference`, `location_id`, `category_id`, `views_count`, datas.
- **property_details** — 1:1 com listings do tipo imóvel: tipologia (apartamento, vivenda, terreno, espaço comercial), quartos, casas de banho, área m², piso, condomínio, estado de conservação.
- **vehicle_details** — 1:1 com listings do tipo viatura: marca, modelo, ano, quilometragem, combustível, caixa, cor, matrícula parcial.
- **listing_photos** — N:1 com listings: url, ordem, foto de capa.
- **categories** — categorias por tipo de bem, geridas pelo admin.
- **locations** — província e município (hierarquia simples, dados reais de Angola).
- **leads** — contactos: nome, telefone, email opcional, mensagem, `listing_id` (opcional), `source` (ficha, formulário geral, whatsapp, consultor), `status` (novo | em contacto | fechado | perdido), notas internas.
- **settings** — chave/valor para WhatsApp, dados do consultor e textos editáveis.

**Relações**
```text
listings ─1:1─ property_details | vehicle_details
listings ─1:N─ listing_photos
listings ─N:1─ categories, locations
listings ─1:N─ leads
profiles ─1:N─ user_roles
```

## 5. Estados do anúncio
- **Publicação**: rascunho / publicado (controla visibilidade pública).
- **Comercial**: disponível / reservado / vendido / arrendado.
- Regra: vendido, arrendado e reservado continuam visíveis com selo, se publicados; o admin pode despublicar a qualquer momento. Só "disponível" aparece nos destaques.

## 6. Regras de negócio
- Todo o conteúdo público vem da base de dados; nada fica escrito no código.
- Preço em Kwanzas (AOA); permitido "sob consulta".
- Cada anúncio tem uma referência curta (ex.: `IM-0142`, `VT-0037`) usada na mensagem de WhatsApp.
- Toda a ação de contacto a partir de uma ficha regista uma lead com a origem.
- Localizações limitadas a províncias e municípios reais de Angola.
- Sem dados fictícios: o catálogo arranca vazio e é preenchido pelo administrador.
- Só um utilizador com papel de administrador acede ao painel; leads e rascunhos nunca são públicos.
- Interface pensada primeiro para telemóvel (listagens, galeria e formulários).

## 7. Aspetos técnicos
- Backend com Lovable Cloud: base de dados, autenticação do administrador, armazenamento das fotografias.
- Leitura pública apenas de anúncios publicados; escrita e leads restritas a administradores.
- Papéis em tabela `user_roles` + função de verificação no servidor (nunca no navegador).
- Fotografias em storage, com redimensionamento no envio para carregar rápido em ligações móveis.

## 8. Etapas de construção (após validação)
1. Base de dados, autenticação e painel administrativo funcional (criar/editar/publicar anúncios, fotos, estados).
2. Área pública: listagens, filtros e fichas, com design próprio.
3. Leads, WhatsApp com mensagem pré-preenchida e resumo no painel.
4. Refinamento: destaques, página do consultor, SEO e partilha.

## Pontos a confirmar
- Número de WhatsApp e email do Leonardo Jimi.
- Existe logótipo/cores da marca ou desenho a definição livre?
- Além de imóveis e viaturas, entra já um terceiro tipo de bem ou fica para depois?
