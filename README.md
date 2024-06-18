## Projeto Casecobra

## Descrição do Projeto

O projeto Casecobra é uma loja online desenvolvida para permitir que os usuários personalizem e adquiram capas de celular exclusivas. Este projeto abrange desde a construção de uma página de loja moderna e atraente até a integração de funcionalidades avançadas como upload de arquivos via drag-and-drop, gerenciamento de pedidos por meio de um painel administrativo secreto e autenticação de usuários.

## Principais Funcionalidades

- **Loja Completa em Next.js 14:** Desenvolvimento de uma loja de e-commerce completa usando a última versão do Next.js.

- **Página Inicial Atraente:** Criação de uma página inicial visualmente agradável para atrair e engajar os visitantes.

- **Artes Customizadas:** Inclusão de artes personalizadas criadas por um ilustrador profissional para aumentar a atratividade do produto.

- **Dashboard Administrativo Secreto:** Dashboard exclusivo para gerenciamento de pedidos e operações internas da loja.

- **Upload de Arquivos com Drag-and-Drop:** Capacidade de fazer upload de arquivos arrastando e soltando para facilitar o processo de personalização.

- **Compra Direta pelo Cliente:** Funcionalidade que permite que os clientes realizem compras diretamente na loja.

- **UI Moderna com shadcn-ui:** Interface de usuário limpa e moderna utilizando a biblioteca shadcn-ui.

- **Configurador de Capas Personalizado:** Ferramenta que permite aos usuários configurar capas de celular de forma totalmente personalizada.

- **Autenticação via Kinde:** Sistema de autenticação seguro utilizando Kinde para gerenciamento de contas dos usuários.

- **E-mails de Agradecimento Personalizados:** Envio de e-mails de agradecimento bem formatados após cada compra.

- **Design Inspirado na Apple:** Design do configurador inspirado no estilo de produtos da Apple para uma experiência de usuário premium.

- **Código 100% em TypeScript:** Toda a aplicação foi desenvolvida utilizando TypeScript para maior robustez e manutenção.

## Dependências

O projeto utiliza diversas dependências para garantir seu funcionamento suave:

- `@headlessui/react`: ^2.0.4,
- `@kinde-oss/kinde-auth-nextjs`: ^2.2.13,
- `@prisma/client`: ^5.15.0,
- `@radix-ui/react-aspect-ratio`: ^1.0.3,
- `@radix-ui/react-dialog`: ^1.0.5,
- `@radix-ui/react-dropdown-menu`: ^2.0.6,
- `@radix-ui/react-icons`: ^1.3.0,
- `@radix-ui/react-label`: ^2.0.2,
- `@radix-ui/react-progress`: ^1.0.3,
- `@radix-ui/react-scroll-area`: ^1.0.5,
- `@radix-ui/react-slot`: ^1.0.2,
- `@radix-ui/react-toast`: ^1.1.5,
- `@react-email/components`: ^0.0.19,
- `@tanstack/react-query`: ^5.44.0,
- `@uploadthing/react`: ^6.6.0,
- `class-variance-authority`: ^0.7.0,
- `clsx`: ^2.1.1,
- `framer-motion`: ^11.2.10,
- `lucide-react`: ^0.383.0,
- `next`: 14.2.3,
- `prisma`: ^5.15.0,
- `react`: ^18,
- `react-dom`: ^18,
- `react-dom-confetti`: ^0.2.0,
- `react-dropzone`: ^14.2.3,
- `react-rnd`: ^10.4.11,
- `resend`: ^3.3.0,
- `sharp`: ^0.32.6,
- `stripe`: ^15.10.0,
- `tailwind-merge`: ^2.3.0,
- `tailwindcss-animate`: ^1.0.7,
- `uploadthing`: ^6.12.0,
- `zod`: ^3.23.8,
- `@types/node`: ^20,
- `@types/react`: ^18,
- `@types/react-dom`: ^18,
- `eslint`: ^8,
- `eslint-config-next`: 14.2.3,
- `postcss`: ^8,
- `tailwindcss`: ^3.4.1,
- `typescript`: ^5,

## Como Executar o Projeto

1. Clone este repositório em sua máquina local.
2. Certifique-se de ter o Node.js e o npm (ou yarn) instalados.
3. Instale as dependências do projeto utilizando o seguinte comando:

```bash
npm install
# ou
yarn install
```

4. Crie um arquivo `.env` na raiz do projeto com as seguintes chaves e seus respectivos valores:

```env
KINDE_CLIENT_ID=seu_valor_aqui
KINDE_CLIENT_SECRET=seu_valor_aqui
KINDE_ISSUER_URL=seu_valor_aqui
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/authentication
ADMIN_EMAIL=seu_valor_aqui
UPLOADTHING_SECRET=seu_valor_aqui
UPLOADTHING_APP_ID=seu_valor_aqui
DATABASE_URL=seu_valor_aqui
STRIPE_SECRET_KEY=seu_valor_aqui
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=seu_valor_aqui
RESEND_API_KEY=seu_valor_aqui
```

Certifique-se de substituir `seu_valor_aqui` pelos valores corretos de cada chave.

5. Para iniciar o servidor de desenvolvimento, utilize o seguinte comando:

```bash
npm run dev
# ou
yarn dev
```

6. O projeto estará disponível em `http://localhost:3000`.