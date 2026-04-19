/**
 * fixtures/testData.ts
 * Dados centralizados para uso nos testes.
 *
 * ⚠️  ANTES DE RODAR:
 *   1. Acesse https://www.automationpratice.com.br/register
 *   2. Crie uma conta com os dados de USERS.valid abaixo
 *   3. Salve e rode os testes
 *
 * Para não cadastrar manualmente, use variáveis de ambiente:
 *   TEST_USER_EMAIL=seu@email.com TEST_USER_PASSWORD=SuaSenha npm test
 */

export const USERS = {
  valid: {
    name: 'Usuario Teste QA',
    email: process.env.TEST_USER_EMAIL    ?? 'qa.automation@teste.com',
    password: process.env.TEST_USER_PASSWORD ?? 'Teste@123',
  },
  invalid: {
    email: 'naoexiste_xyz_999@email.com',
    password: 'SenhaErrada123',
  },
  emptyPassword: {
    email: 'qa.automation@teste.com',
    password: '',
  },
  malformedEmail: {
    email: 'emailsemarroba',
    password: 'Teste@123',
  },
} as const;

export const PRODUCTS = {
  default: {
    name: 'Produto Teste',
    searchTerm: 'shirt',
  },
  searchTerms: {
    valid: 'shirt',
    noResults: 'xyzprodutonaoexiste999abc',
    partial: 'sho',
  },
} as const;

export const MESSAGES = {
  loginError:      'Usuário ou senha inválidos',
  requiredField:   'Campo obrigatório',
  invalidEmail:    'E-mail inválido',
  registerSuccess: 'Cadastro realizado',
  cartEmpty:       'carrinho',
} as const;

export const URLS = {
  base:     'https://www.automationpratice.com.br',
  login:    '/login',
  register: '/register',
  cart:     '/cart',
  shop:     '/shop',
} as const;

/** Gera e-mail único para evitar conflito em testes de cadastro */
export function generateUniqueEmail(): string {
  return `qa.auto.${Date.now()}@teste.com`;
}
