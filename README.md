# Sistema de Agendamento de Consultas

Sistema web para agendamento de consultas médicas, com painel administrativo.

---

## Tecnologias utilizadas

- **Frontend:** React (JavaScript)
- **Backend:** Java 17 + Spring Boot 3
- **Banco de dados:** MySQL 8
- **Infraestrutura:** Docker Swarm + Portainer + Traefik
- **Deploy:** VPS Hetzner + Cloudflare (SSL via Let's Encrypt)
- **CI/CD:** GitHub Actions

---

## Funcionalidades

**Área pública:**
- Visualizar especialidades disponíveis
- Visualizar profissionais por especialidade
- Agendar consulta informando nome e CPF
- Consultar e cancelar agendamento pelo CPF

**Área administrativa (login necessário):**
- Cadastrar, editar e excluir especialidades
- Cadastrar, editar e excluir profissionais
- Gerar horários disponíveis automaticamente por janela de tempo
- Visualizar, editar e cancelar agendamentos

---

## Como executar localmente

### Pré-requisitos
- Docker e Docker Compose instalados

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/llopesbb/Agendamento-Clinica.git
cd Agendamento-Clinica
```

2. Edite o arquivo `.env` com suas configurações (ou mantenha os valores padrão para testes locais).

3. Suba os containers:
```bash
docker-compose up --build -d
```

4. Acesse o sistema:
   - **Frontend:** http://localhost:3000
   - **Backend:** http://localhost:8080

> O banco de dados é inicializado automaticamente com as tabelas e o usuário admin.

---

## Como fazer o deploy na VPS Hetzner

### 1. Criar o servidor

No painel da Hetzner, crie um servidor com **Ubuntu 22.04**, tipo CX22 ou superior.

### 2. Instalar o Docker e habilitar o Swarm

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Habilitar modo Swarm
docker swarm init
```

### 3. Instalar o Portainer com Traefik

O Portainer é gerenciado visualmente e o Traefik atua como proxy reverso, emitindo SSL automaticamente via Let's Encrypt.

> Siga a documentação do seu stack de Portainer + Traefik para subir esses serviços na rede `Zeus1`.

Após instalar, acesse o Portainer pelo endereço configurado. Com ele você pode:
- Subir e derrubar serviços visualmente
- Ver logs em tempo real
- Reiniciar serviços com um clique
- Gerenciar stacks sem usar o terminal

### 4. Clonar o repositório na VPS

```bash
git clone https://github.com/llopesbb/Agendamento-Clinica.git ~/sistema-agendamento
cd ~/sistema-agendamento
```

### 5. Configurar o arquivo `.env`

```bash
nano .env
```

Edite `DOMINIO` com o subdomínio completo (ex: `agendamento.seudominio.com`) e ajuste as senhas do banco.

### 6. Configurar o Cloudflare

1. No painel do Cloudflare, crie um registro **A** apontando o subdomínio para o IP da VPS
2. Deixe o proxy do Cloudflare **desativado** (nuvem cinza) para que o Traefik consiga emitir o certificado via Let's Encrypt
3. Após o certificado ser emitido, você pode reativar o proxy se quiser

### 7. Primeiro deploy manual

```bash
# Build das imagens
docker build -t agendamento-backend:latest ./backend
docker build -t agendamento-frontend:latest ./frontend

# Sobe o stack no Swarm
export $(cat .env | grep -v '^#' | grep '=' | xargs)
docker stack deploy -c stack.yml agendamento
```

Verifique os serviços:
```bash
docker stack services agendamento
```

### 8. Configurar os secrets do GitHub Actions

No repositório GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

| Secret | Valor |
|--------|-------|
| `VPS_HOST` | IP da sua VPS |
| `VPS_USER` | Usuário SSH (ex: `root`) |
| `VPS_KEY` | Chave SSH privada |

A partir daí, todo push na branch `main` faz o deploy automaticamente.

---

## Credenciais do ADM

Após subir o sistema, acesse `/login` com:

- **Usuário:** `admin`
- **Senha:** `admin123`

---

## Variáveis de ambiente (.env)

| Variável | Descrição |
|----------|-----------|
| `DOMINIO` | Subdomínio completo (ex: `agendamento.seudominio.com`) |
| `MYSQL_DATABASE` | Nome do banco de dados |
| `MYSQL_USER` | Usuário do banco |
| `MYSQL_PASSWORD` | Senha do usuário do banco |
| `MYSQL_ROOT_PASSWORD` | Senha do root do MySQL |

---

## Estrutura do banco de dados

```sql
admin            -- usuários administradores
especialidades   -- especialidades médicas
profissionais    -- médicos/profissionais vinculados a uma especialidade
disponibilidade  -- horários disponíveis por profissional
agendamentos     -- consultas agendadas por pacientes
```

---

## Prints do sistema

> Adicione aqui prints das telas do sistema após o deploy.

---

## Link do deploy

> https://seudominio.com

---

## Autor

Desenvolvido por [Seu Nome]
