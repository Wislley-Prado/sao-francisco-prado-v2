# 🎣 PradoAqui - Plataforma de Turismo e Pesca Esportiva

Bem-vindo ao repositório oficial do sistema **PradoAqui**!

**URL do Projeto:** [pradoaqui.com.br](https://pradoaqui.com.br) / [seashell-butterfly-283571.hostingersite.com](https://seashell-butterfly-283571.hostingersite.com/)

---

## 📖 Sobre o Projeto

O PradoAqui é uma plataforma online completa voltada para o turismo e a pesca esportiva no Rio São Francisco, região de Três Marias/MG. O sistema gerencia:
- Reservas de ranchos e hospedagens ribeirinhas.
- Demonstração e administração de pacotes de pescaria (VIP, Luxo e Diamante).
- Blog com conteúdo informativo otimizado para buscadores (SEO).
- Status em tempo real do clima, nível da represa e calendário lunar.
- Gestão completa através de um Painel Administrativo.

---

## 💻 Como trabalhar no código (Desenvolvimento Local)

Se você ou sua equipe precisam testar ou modificar a plataforma em um computador novo, siga os passos abaixo. O único requisito é possuir o pacote [Node.js](https://nodejs.org/) instalado.

**1. Clone o repositório do Git**
```bash
git clone https://github.com/Wislley-Prado/sao-francisco-prado-v2.git
```

**2. Navegue até a pasta criada**
```bash
cd sao-francisco-prado-aqui
```

**3. Instale os módulos necessários**
```bash
npm install
```

**4. Inicie o servidor de testes**
```bash
npm run dev
```

*O projeto abrirá diretamente no navegador (geralmente em `http://localhost:8080`) com atualização em tempo real conforme você salva o código.*

---

## 🛠️ Tecnologias Utilizadas

Nossa arquitetura prioriza a velocidade de carregamento e performance máxima para dispositivos móveis, sendo construída com:

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/) e **TypeScript**
- **Design de Interface:** [Tailwind CSS](https://tailwindcss.com/) com elementos do [shadcn/ui](https://ui.shadcn.com/)
- **Backend / Banco de Dados:** [Supabase](https://supabase.com/) (Banco PostgreSQL nativo e regras de Edge Functions)
- **Hospedagem Frontend:** [Hostinger](https://www.hostinger.com.br/) operando sob um servidor Web (Apache)

---

## 🚀 Entenda o Processo de Deploy

A atualização do site no ar funciona através de **Integração e Entrega Contínuas Automatizadas (CI/CD)**:

1. Todas as melhorias no código e desenvolvimento são registradas através do **Git**.
2. Assim que um novo Commit é enviado ("Push") para a nuvem da versão principal (`main`) no repositório do GitHub.
3. Configurações internas do GitHub (as *GitHub Actions*) disparam um robô automático.
4. Esse robô roda as verificações do site, constrói e compila a versão final otimizada para internet (`npm run build`).
5. Depois de compilado, o robô conecta no protocolo FTP da Hostinger e joga a nova atualização no ar, de forma transparente.

---
*Projeto orquestrado por inteligência arquitetônica avançada Antigravity, construído e operado por **Wislley Prado**.*
