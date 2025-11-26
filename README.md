# CRUD Python com Flask, PostgreSQL e Docker

Sistema de orçamento de esquadrias em alumínio com autenticação e CRUD completo.

## 🚀 Tecnologias

- **Backend**: Flask, SQLAlchemy, PostgreSQL, JWT
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Infraestrutura**: Docker, Docker Compose, Nginx

## 📋 Funcionalidades

- ✅ Autenticação com JWT
- ✅ Cadastro e login de usuários
- ✅ CRUD de usuários
- ✅ CRUD de orçamentos
- ✅ Histórico de orçamentos por usuário
- ✅ Cálculo automático de valores

## 🐳 Como Executar

### Pré-requisitos
- Docker
- Docker Compose

### Passos

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd crudPython
```

2. **Inicie os containers**
```bash
docker-compose up -d
```

3. **Acesse a aplicação**
- Aplicação completa: http://localhost:5001
- Backend API: http://localhost:5001/api
- Banco de dados: localhost:5432

### Usuário padrão
- **Email**: admin@gmail.com
- **Senha**: 123

## 📁 Estrutura do Projeto

```
crudPython/
├── backend/
│   ├── app.py              # API Flask principal
│   ├── init_db.py          # Script de inicialização do banco
│   ├── requirements.txt    # Dependências Python
│   └── Dockerfile
├── login/                   # Tela de login/cadastro
├── home/                    # Tela principal (orçamentos)
├── historico/              # Histórico de orçamentos
├── Imagens/                # Recursos de imagem
├── docker-compose.yml      # Configuração dos containers
└── nginx.conf             # Configuração do Nginx
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/register` - Cadastrar usuário
- `POST /api/login` - Fazer login

### Usuários (requer autenticação)
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Obter usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Orçamentos (requer autenticação)
- `POST /api/orcamentos` - Criar orçamento
- `GET /api/orcamentos` - Listar orçamentos do usuário
- `DELETE /api/orcamentos/:id` - Deletar orçamento

## 🛠️ Comandos Úteis

### Ver logs
```bash
docker-compose logs -f
```

### Parar containers
```bash
docker-compose down
```

### Rebuild containers
```bash
docker-compose up -d --build
```

### Acessar o banco de dados
```bash
docker exec -it crudpython_db psql -U user -d cruddb
```

## 🔐 Segurança

- Senhas são hasheadas com Werkzeug
- Autenticação via JWT
- Tokens expiram em 24 horas
- CORS configurado
- Validação de permissões por usuário

## 📝 Modelos do Banco

### User
- id (PK)
- name
- email (unique)
- password (hashed)
- created_at

### Orcamento
- id (PK)
- user_id (FK)
- peca
- altura
- largura
- area
- total
- created_at

## 🌟 Próximos Passos (Opcional)

- [ ] Adicionar paginação
- [ ] Implementar refresh tokens
- [ ] Adicionar validação de campos mais robusta
- [ ] Implementar reset de senha
- [ ] Adicionar testes unitários
- [ ] Adicionar logs estruturados

## 📄 Licença

Este projeto é de código aberto.
