# 🖥️ Mac Access Scheduler - Capacita Brasil

Uma aplicação web super simples (mas poderosa ⚡) criada para organizar o uso compartilhado de um Mac remoto entre os participantes do Capacita Brasil (IFCE), fornecido pela iRede.

> Feito com Next.js, SQLite, Prisma, e WebSocket para atualizações em tempo real entre os membros da equipe.

---

## 🚀 Funcionalidades

- 📅 **Agendamento Simples**: Selecione o integrante, data e horário de uso.
- 🔄 **Atualização em tempo real** com WebSocket (todos veem as mudanças instantaneamente).
- 👀 **Lista de agendamentos futuros** ordenada e filtrada automaticamente.
- 🗑️ **Remoção de agendamentos** com confirmação.
- 🔌 **Sem login, sem complicação**: totalmente aberto para os 7 integrantes.

---

## 🛠️ Tecnologias Usadas

- [Next.js 15](https://nextjs.org/) – Fullstack React Framework
- [Prisma ORM](https://www.prisma.io/) – ORM para SQLite
- [SQLite](https://www.sqlite.org/index.html) – Armazenamento local leve
- [Socket.IO](https://socket.io/) – Comunicação em tempo real
- [ShadCN UI](https://ui.shadcn.com/) – UI moderna com Tailwind CSS
- [TypeScript](https://www.typescriptlang.org/) – Segurança tipada
- [date-fns](https://date-fns.org/) – Manipulação de datas com classe

---

## 📦 Como rodar localmente

1. Clone o projeto:

```bash
git clone https://github.com/Juan-Severiano/mac-organizer.git
cd mac-organizer
```

2. Instale as dependências:

```bash
npm install
# ou
yarn
```

3. Configure o banco de dados SQLite com Prisma:

```bash
npx prisma migrate dev --name init
```

4. Rode o projeto:

```bash
npm run dev
```

---

## ⚙️ Estrutura do Projeto

```
📦 app
 ┣ 📂 api
 ┃ ┗ 📂 schedules → API Routes com Prisma (CRUD)
 ┣ 📂 socket → Configuração do servidor e cliente Socket.IO
 ┣ 📂 components → UI com ShadCN
 ┣ 📂 contexts → Context API para schedules e usuários
 ┗ 📜 page.tsx → Página principal
```

---

## 📌 Detalhes Técnicos

- **Armazenamento:** Um único banco SQLite com tabela de usuários e agendamentos.
- **Agendamento:** Cada registro contém `userId`, `date`, `startTime`, `endTime`.
- **Atualização Live:** Todos conectados recebem atualizações sem precisar recarregar.
- **Filtro:** Exibe apenas agendamentos futuros ou em andamento.

---

## 👥 Time

Essa aplicação foi criada por integrantes do Capacita Brasil – iOS Developer Track @ IFCE.

- 💡 Design & Lógica: [@juansoussev](https://github.com/Juan-Severiano)
- 🤝 Contribuições: [Equipe 12 iOS Capacita Brasil](https://github.com/ioscapacitabr-equipe12)

---

## 🧠 Ideias Futuras

- 📆 Visualização em formato de calendário
- 🕐 Validação de conflitos de horário
- 🔔 Notificações de agendamento ativo
- 🔒 Controle de bloqueio de agendamento simultâneo

---

## 📄 Licença

MIT License. Desenvolvido com amor e café ☕ para a comunidade iOS do IFCE 💙.
