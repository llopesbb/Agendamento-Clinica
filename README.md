# Sistema de Agendamento de Consultas

Sistema web para agendamento de consultas médicas, com painel administrativo.

---

## Tecnologias utilizadas

- **Frontend:** React (JavaScript)
- **Backend:** Java 17 + Spring Boot 3
- **Banco de dados:** MySQL 8
- **Infraestrutura:** Docker + Docker Compose + Portainer
- **Deploy:** VPS Hetzner + Nginx + Cloudflare (SSL Flexible)
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
git clone https://github.com/seu-usuario/sistema-agendamento.git
cd sistema-agendamento
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

### 2. Instalar dependências na VPS

Acesse a VPS via SSH e execute:

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# Instalar Nginx
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3. Instalar o Portainer (gerenciamento visual de containers)

```bash
docker volume create portainer_data
docker run -d \
  -p 9000:9000 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

Após instalar, acesse `http://IP_DA_VPS:9000` para configurar o Portainer.

Com o Portainer você pode:
- Subir e derrubar containers visualmente
- Ver logs em tempo real
- Reiniciar containers com um clique
- Gerenciar o docker-compose sem usar o terminal

### 4. Clonar o repositório na VPS

```bash
cd ~
git clone https://github.com/seu-usuario/sistema-agendamento.git
cd sistema-agendamento
```

### 5. Configurar o arquivo `.env`

```bash
nano .env
```

Edite os valores de `DOMINIO`, `MYSQL_USER`, `MYSQL_PASSWORD` e `MYSQL_ROOT_PASSWORD`.

### 6. Configurar o Nginx com seu domínio

```bash
# Instala o envsubst (pacote gettext)
sudo apt install gettext -y

# Gera o arquivo de configuração com o domínio do .env
export $(cat .env | xargs) && envsubst '${DOMINIO}' < nginx/nginx.conf > /etc/nginx/sites-available/agendamento

# Ativa o site
sudo ln -s /etc/nginx/sites-available/agendamento /etc/nginx/sites-enabled/

# Remove o site padrão (opcional)
sudo rm -f /etc/nginx/sites-enabled/default

# Testa e recarrega o Nginx
sudo nginx -t && sudo systemctl reload nginx
```

### 7. Configurar o Cloudflare

1. Adicione o domínio no Cloudflare
2. Aponte o registro A (`@` e/ou `www`) para o IP da VPS
3. No Cloudflare, vá em **SSL/TLS** e selecione o modo **Flexible**
4. Aguarde a propagação do DNS (pode levar alguns minutos)

### 8. Configurar os secrets do GitHub Actions

No repositório GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

| Secret | Valor |
|--------|-------|
| `VPS_HOST` | IP da sua VPS |
| `VPS_USER` | Usuário SSH (ex: `root`) |
| `VPS_KEY` | Chave SSH privada |

### 9. Subir a aplicação

```bash
docker-compose up --build -d
```

Ou utilize o Portainer para iniciar os containers visualmente.

---

## Credenciais do ADM

Após subir o sistema, acesse `/login` com:

- **Usuário:** `admin`
- **Senha:** `admin123`

---

## Variáveis de ambiente (.env)

| Variável | Descrição |
|----------|-----------|
| `DOMINIO` | Domínio do site (ex: `clinica.com.br`) |
| `MYSQL_DATABASE` | Nome do banco de dados |
| `MYSQL_USER` | Usuário do banco |
| `MYSQL_PASSWORD` | Senha do usuário do banco |
| `MYSQL_ROOT_PASSWORD` | Senha do root do MySQL |
| `FRONTEND_PORT` | Porta do frontend (padrão: 3000) |
| `BACKEND_PORT` | Porta do backend (padrão: 8080) |

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
