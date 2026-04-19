# 🎭 QAZANDO Shop — Automação de Testes E2E com Playwright

<div align="center">

![Playwright](https://img.shields.io/badge/Playwright-1.44+-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![CI/CD](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088ff?style=for-the-badge&logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Projeto completo de automação E2E para o e-commerce [QAZANDO Shop](https://www.automationpratice.com.br),  
construído com Playwright + TypeScript seguindo o padrão Page Object Model (POM).**

[🚀 Como Rodar](#-como-rodar) • [📁 Estrutura](#-estrutura-do-projeto) • [📋 Suítes de Teste](#-suítes-de-teste) • [⚙️ CI/CD](#️-cicd) • [📊 Relatórios](#-relatórios)

</div>

---

## 📌 Sobre o Projeto

Projeto profissional de **QA Automation** desenvolvido para demonstrar boas práticas de automação de testes em um e-commerce real. Cobre todos os fluxos críticos da aplicação com diferentes níveis de teste.

### ✅ O que está coberto

| Área                   | Tipo de Teste          | Arquivo                    |
|------------------------|------------------------|----------------------------|
| Página Inicial         | Smoke + Regression     | `home.spec.ts`             |
| Autenticação           | Smoke + Regression     | `login.spec.ts`            |
| Cadastro de Usuário    | Smoke + Regression     | `register.spec.ts`         |
| Listagem de Produtos   | Smoke + Regression     | `products.spec.ts`         |
| Carrinho de Compras    | Smoke + Regression     | `cart.spec.ts`             |
| Jornadas E2E Completas | Smoke + Regression     | `flows.spec.ts`            |
| Acessibilidade (WCAG)  | Regression             | `accessibility.spec.ts`    |
| Performance & Rede     | Smoke + Regression     | `performance.spec.ts`      |
| Regressão Visual       | Regression             | `visual.spec.ts`           |
| Custom Fixtures        | Smoke + Regression     | `fixtures.spec.ts`         |

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| [Playwright](https://playwright.dev) | ^1.44 | Framework de automação E2E |
| [TypeScript](https://typescriptlang.org) | ^5.x | Tipagem estática |
| [Node.js](https://nodejs.org) | 20 LTS | Runtime |
| [GitHub Actions](https://github.com/features/actions) | — | Pipeline CI/CD |
| [@faker-js/faker](https://fakerjs.dev) | ^8.x | Geração de dados dinâmicos |

---

## 📁 Estrutura do Projeto

```
qazando-playwright/
│
├── 📁 .github/
│   └── workflows/
│       └── playwright.yml        # Pipeline CI/CD completo
│
├── 📁 pages/                     # Page Objects (POM)
│   ├── BasePage.ts               # Classe base com métodos comuns
│   ├── NavbarComponent.ts        # Componente de navegação reutilizável
│   ├── HomePage.ts               # Listagem de produtos (/shop)
│   ├── LoginPage.ts              # Autenticação (/login)
│   ├── RegisterPage.ts           # Cadastro de usuário (/register)
│   ├── ProductPage.ts            # Detalhes do produto
│   └── CartPage.ts               # Carrinho de compras (/cart)
│
├── 📁 tests/
│   └── e2e/
│       ├── home.spec.ts          # 11 testes — Página inicial
│       ├── login.spec.ts         │  7 testes — Login
│       ├── register.spec.ts      │  6 testes — Cadastro
│       ├── products.spec.ts      │  6 testes — Produtos
│       ├── cart.spec.ts          │  7 testes — Carrinho
│       ├── flows.spec.ts         │  5 testes — Jornadas E2E
│       ├── accessibility.spec.ts │  8 testes — Acessibilidade
│       ├── performance.spec.ts   │  8 testes — Performance
│       ├── visual.spec.ts        │  6 testes — Visual Regression
│       └── fixtures.spec.ts      │  9 testes — Custom Fixtures
│
├── 📁 fixtures/
│   ├── testData.ts               # Dados e constantes de teste
│   └── customFixtures.ts         # Fixtures customizados do Playwright
│
├── 📁 utils/
│   └── helpers.ts                # Funções utilitárias
│
├── playwright.config.ts          # Configuração (5 projetos de browser)
├── package.json                  # Scripts e dependências
├── .env.example                  # Template de variáveis de ambiente
├── .gitignore
└── README.md
```

---

## 🏗️ Arquitetura — Page Object Model

```
┌─────────────────────────────────────────────────────┐
│             TESTES (.spec.ts)                       │
│  Descrevem comportamento — sem detalhes de UI       │
└────────────────────┬────────────────────────────────┘
                     │ usa
┌────────────────────▼────────────────────────────────┐
│         CUSTOM FIXTURES (customFixtures.ts)         │
│  Injetam Page Objects e estado pré-configurado      │
└────────────────────┬────────────────────────────────┘
                     │ compõe
┌────────────────────▼────────────────────────────────┐
│              PAGE OBJECTS (pages/)                  │
│  Encapsulam locators e ações por página             │
│  Herdam de BasePage (métodos comuns)                │
└────────────────────┬────────────────────────────────┘
                     │ usa
┌────────────────────▼────────────────────────────────┐
│            FIXTURES & UTILS                         │
│  testData.ts → dados centralizados e env vars       │
│  helpers.ts  → funções utilitárias reutilizáveis    │
└─────────────────────────────────────────────────────┘
```

**Vantagens do POM aplicado aqui:**
- 🔁 **Reuso** — locators definidos uma vez, usados em vários testes
- 🛡️ **Manutenibilidade** — mudança de UI impacta apenas o Page Object
- 📖 **Legibilidade** — testes descrevem comportamento, não implementação
- 🧩 **Escalabilidade** — fácil adicionar novas páginas e cenários

---

## 🚀 Como Rodar

### Pré-requisitos
- [Node.js 20+](https://nodejs.org/)
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/qazando-playwright.git
cd qazando-playwright
```

### 2. Instale as dependências

```bash
npm install
npx playwright install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
TEST_USER_EMAIL=seu@email.com
TEST_USER_PASSWORD=SuaSenha@123
```

> ⚠️ **Importante:** crie uma conta em https://www.automationpratice.com.br/register  
> com esses dados antes de rodar os testes que dependem de login.

### 4. Execute os testes

```bash
# Todos os testes funcionais (headless)
npm test

# Com o browser visível
npm run test:headed

# Interface gráfica interativa ← ideal para demos e portfólio
npm run test:ui

# Modo debug (passo a passo)
npm run test:debug
```

### 5. Filtros por categoria ou browser

```bash
# Por tag
npm run test:smoke         # testes críticos rápidos
npm run test:regression    # cobertura completa

# Por browser
npm run test:chrome
npm run test:firefox
npm run test:webkit
npm run test:mobile        # Pixel 5 simulado

# Por suíte
npm run test:cart
npm run test:login
npm run test:flows
npm run test:a11y
npm run test:perf

# Visual Regression
npm run test:visual         # compara com snapshots de referência
npm run test:visual:update  # atualiza snapshots após mudanças de UI

# Tudo incluindo visual
npm run test:all
```

### 6. Ver relatório

```bash
npm run test:report
```

---

## 📋 Suítes de Teste

### 🏠 Home — `home.spec.ts`
| # | Cenário | Tag |
|---|---|---|
| 1 | Deve carregar a home corretamente | `@smoke` |
| 2 | Deve exibir navbar | `@smoke` |
| 3 | Deve exibir produtos | `@smoke` |
| 4 | Deve exibir link de login | `@smoke` |
| 5 | Deve exibir link de cadastro | `@smoke` |
| 6 | Deve navegar para login | `@smoke` |
| 7 | Deve navegar para cadastro | `@regression` |
| 8 | Deve navegar para carrinho | `@regression` |
| 9 | Card deve ter título e preço | `@regression` |
| 10 | Card deve ter botão de adicionar | `@regression` |
| 11 | Deve renderizar em mobile | `@regression` |

### 🔐 Login — `login.spec.ts`
| # | Cenário | Tag |
|---|---|---|
| 1 | Deve exibir a página de login | `@smoke` |
| 2 | Deve realizar login com sucesso | `@smoke` |
| 3 | Deve bloquear submit vazio | `@regression` |
| 4 | Deve exibir erro com senha errada | `@regression` |
| 5 | Deve exibir erro com usuário inexistente | `@regression` |
| 6 | Não deve logar com senha vazia | `@regression` |
| 7 | Deve ter link para cadastro | `@regression` |

### 📝 Cadastro — `register.spec.ts`
| # | Cenário | Tag |
|---|---|---|
| 1 | Deve exibir a página de cadastro | `@smoke` |
| 2 | Deve cadastrar usuário com sucesso | `@smoke` |
| 3 | Deve bloquear submit vazio | `@regression` |
| 4 | Deve exibir erro com e-mail duplicado | `@regression` |
| 5 | Deve exibir erro com senhas divergentes | `@regression` |
| 6 | Deve ter link para login | `@regression` |

### 🛍️ Produtos — `products.spec.ts`
| # | Cenário | Tag |
|---|---|---|
| 1 | Deve exibir produtos na home | `@smoke` |
| 2 | Cada produto deve ter título | `@regression` |
| 3 | Cada produto deve ter preço | `@regression` |
| 4 | Cada produto deve ter botão de compra | `@regression` |
| 5 | Deve adicionar produto ao carrinho | `@smoke` |
| 6 | Deve abrir detalhes do produto | `@smoke` |

### 🛒 Carrinho — `cart.spec.ts`
| # | Cenário | Tag |
|---|---|---|
| 1 | Carrinho vazio deve exibir mensagem | `@smoke` |
| 2 | Deve exibir item após adicionar produto | `@smoke` |
| 3 | Deve remover item do carrinho | `@regression` |
| 4 | Deve exibir total do carrinho | `@regression` |
| 5 | Deve exibir botão de checkout com itens | `@regression` |
| 6 | Checkout sem login deve redirecionar | `@regression` |
| 7 | Deve ter opção de continuar comprando | `@regression` |

### 🔄 Fluxos E2E — `flows.spec.ts`
| # | Cenário | Tag |
|---|---|---|
| 1 | Jornada completa: cadastro → login → carrinho | `@smoke` |
| 2 | Visitante pode adicionar ao carrinho | `@regression` |
| 3 | Adicionar múltiplos produtos | `@regression` |
| 4 | Login inválido → válido deve ter sucesso | `@regression` |
| 5 | Retornar à home a partir do carrinho | `@regression` |

### ♿ Acessibilidade — `accessibility.spec.ts`
- Navegação por teclado (Tab + Enter)
- Foco entre campos via Tab
- Atributo `alt` em imagens
- Texto/aria-label em botões
- `<title>` em todas as páginas
- Texto descritivo em links
- Identificação acessível em formulários
- Navbar funcional em mobile

### ⚡ Performance — `performance.spec.ts`
- Home carrega em < 10s
- Login carrega em < 8s
- Sem erros críticos no console
- Status 200 na home
- Sem respostas 5xx
- Produtos renderizados após carga
- Sem imagens quebradas (4xx)
- Renderização em 3 viewports (mobile, tablet, desktop)

### 👁️ Visual Regression — `visual.spec.ts`
Snapshots de comparação pixel a pixel:
- Card de produto (home)
- Formulário de login
- Formulário de cadastro
- Navbar desktop
- Navbar mobile
- Carrinho vazio

> Na **primeira execução** os snapshots de referência são criados automaticamente em `tests/snapshots/`.  
> Use `npm run test:visual:update` para atualizar após mudanças intencionais de UI.

---

## 🔖 Tags de Teste

| Tag | Descrição | Quando executar |
|---|---|---|
| `@smoke` | Testes críticos e rápidos | A cada build / deploy |
| `@regression` | Cobertura completa | Antes de releases |

---

## ⚙️ CI/CD

O pipeline (`.github/workflows/playwright.yml`) executa automaticamente:

| Evento | Quando |
|---|---|
| `push` | Em qualquer push para `main` ou `develop` |
| `pull_request` | Em PRs para `main` ou `develop` |
| `schedule` | Diariamente às 8h (horário de Brasília) |
| `workflow_dispatch` | Manualmente via GitHub Actions UI |

**Configuração dos Secrets no GitHub:**

Vá em **Settings → Secrets and variables → Actions** e adicione:

| Secret | Valor |
|---|---|
| `TEST_USER_EMAIL` | E-mail do usuário de teste |
| `TEST_USER_PASSWORD` | Senha do usuário de teste |

Os relatórios HTML são publicados automaticamente no **GitHub Pages** a cada push na `main`.

---

## 📊 Relatórios

Após executar os testes:

```bash
# Abre o relatório HTML interativo no browser
npm run test:report
```

Artefatos gerados em caso de falha:

```
test-results/
├── screenshots/   # screenshot do momento da falha
├── videos/        # gravação do teste
└── traces/        # trace para análise detalhada
```

Para inspecionar um trace:
```bash
npx playwright show-trace test-results/<pasta>/trace.zip
```

---

## 🤝 Como Contribuir

```bash
git checkout -b feature/novo-cenario
# implemente o teste
git commit -m "feat: adiciona cenário de busca por categoria"
git push origin feature/novo-cenario
# abra um Pull Request
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Desenvolvido com 💚 para portfólio de QA Automation

⭐ Se este projeto foi útil, deixe uma estrela no repositório!

**[🔗 LinkedIn](https://linkedin.com/in/seu-perfil)** • **[🐙 GitHub](https://github.com/seu-usuario)**

</div>
