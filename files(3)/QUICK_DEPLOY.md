# ⚡ QUICK DEPLOY - 10 Minuta do Live!

## 🎯 Render.com Deployment (Najbrže)

### ✅ Checklist:

#### 1. GitHub (2 min)
- [ ] Idi na https://github.com/new
- [ ] Name: `novinar-app`
- [ ] Upload cijeli `socialhub` folder
- [ ] Commit!

#### 2. MongoDB Atlas (već imaš!)
- [ ] Connection string kopiran
- [ ] Format: `mongodb+srv://admin:password@cluster.mongodb.net/novinar?retryWrites=true&w=majority`

#### 3. Render - Backend (3 min)
- [ ] https://dashboard.render.com
- [ ] New + → Web Service
- [ ] Connect GitHub repo
- [ ] Settings:
  ```
  Name: novinar-backend
  Root: backend
  Build: npm install
  Start: npm start
  ```
- [ ] Environment Variables:
  ```
  MONGODB_URI = (paste connection string)
  JWT_SECRET = asdkjh234kjh5234kjh523kjh45
  PORT = 5000
  NODE_ENV = production
  ```
- [ ] Create Web Service
- [ ] Kopiraj URL (https://novinar-backend.onrender.com)

#### 4. Render - Frontend (3 min)
- [ ] Dashboard → New + → Static Site
- [ ] Connect GitHub repo
- [ ] Settings:
  ```
  Name: novinar-frontend
  Root: frontend
  Build: npm install && npm run build
  Publish: build
  ```
- [ ] Environment Variable:
  ```
  REACT_APP_API_URL = https://novinar-backend.onrender.com/api
  ```
- [ ] Create Static Site

#### 5. Test (2 min)
- [ ] Otvori frontend URL
- [ ] Registruj se
- [ ] Dodaj RSS feed
- [ ] Dohvati članke
- [ ] Klikni oko ikonu → WordPress tab → Kopiraj
- [ ] ✅ RADI!

---

## 🐳 ALTERNATIVA: Docker (Lokalno)

### ✅ Checklist:

- [ ] Docker Desktop instaliran
- [ ] Kopiraj `.env.example` → `backend/.env`
- [ ] Edituj `backend/.env` sa MongoDB URI
- [ ] Pokreni: `docker-compose up -d`
- [ ] Otvori: `http://localhost`

---

## 💡 Potrebna Pomoć?

**Render.com grešk a?**
- Provjeri logs: Dashboard → Service → Logs tab

**MongoDB greška?**
- Network Access: 0.0.0.0/0
- Database User postoji
- Password tačan (bez specijalnih znakova)

**Frontend ne vidi backend?**
- REACT_APP_API_URL tačan?
- Backend mora biti deployed PRIJE frontend-a

---

## 📞 Linkovi:

- Render Dashboard: https://dashboard.render.com
- GitHub: https://github.com
- MongoDB Atlas: https://cloud.mongodb.com
- Dokumentacija: DEPLOYMENT.md

---

**Render.com = Najbrže i najlakše! 10 minuta total!** 🚀
