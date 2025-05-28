# 🚀 Cervejaria Virada - Projeto FullStack

<div align="center">
  <img src="https://img.icons8.com/color/96/000000/beer.png" alt="Logo"/>
  <h1>Sistema de Gerenciamento de Cervejas Artesanais</h1>
  <p>
    <b>Frontend:</b> React.js | <b>Backend:</b> Node.js/Express | <b>Database:</b> MongoDB Atlas
  </p>
</div>

---

## 📌 Índice
- [Frontend](#-frontend-reactjs)
- [Backend](#-backend-nodejsexpress)
- [Deploy](#-deploy-na-nuvem)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🖥️ Frontend (React.js)

### 🔧 Pré-requisitos
```bash
Node.js v16+
npm ou yarn

git clone https://github.com/PedroLucas003/frontendn2.git
cd client
npm install
cp .env.example .env

REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development

npm start
Acesse: http://localhost:3000

src/
├── components/
│   ├── beers/       # 🍻 Componentes de cervejas
│   ├── common/      # 🔄 Componentes compartilhados
│   ├── home/        # 🏠 Página inicial
│   └── users/       # 👥 Gerenciamento de usuários
├── styles/          # 🎨 Estilos CSS
├── App.js           # ⚛️ Componente raiz
└── index.js         # 🔌 Ponto de entrada
