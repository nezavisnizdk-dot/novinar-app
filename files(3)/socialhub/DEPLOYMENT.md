# 🚀 DEPLOYMENT VODIČ - Novinar App

Kompletna aplikacija spremna za deploy na bilo kojoj platformi!

---

## 📋 ŠTO IMAŠ:

✅ **Docker** - Za lokalno ili cloud deployment  
✅ **Render.com** - Besplatan hosting (preporučeno)  
✅ **Vercel** - Frontend hosting  
✅ **Railway.app** - Alternativa  
✅ **Nginx** - Production server za frontend

---

## 🎯 NAJBOLJA OPCIJA: Render.com (100% Besplatno)

### Prednosti:
- ✅ Frontend + Backend na jednom mjestu
- ✅ Automatski SSL (HTTPS)
- ✅ CI/CD iz GitHub-a
- ✅ 750h besplatno mjesečno
- ✅ Globalni CDN

---

## 🚀 DEPLOY NA RENDER.COM (Korak-po-Korak)

### Priprema (5 minuta):

1. **GitHub Account** - Napravi na https://github.com (ako nemaš)
2. **Render Account** - Registruj se na https://render.com (sa GitHub accountom)
3. **MongoDB Atlas** - Imaš već (connection string)

---

### Korak 1: Upload na GitHub

```bash
1. Idi na: https://github.com/new
2. Kreiraj novi repo:
   - Name: novinar-app
   - Public ili Private (tvoj izbor)
   - Klikni "Create repository"

3. Upload fajlove:
   - Klikni "uploading an existing file"
   - Drag & drop CIJELI socialhub folder
   - Commit changes
```

**ILI ako imaš Git instaliran:**

```bash
cd socialhub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TVOJ_USERNAME/novinar-app.git
git push -u origin main
```

---

### Korak 2: Deploy Backend na Render

```
1. Idi na https://dashboard.render.com
2. Klikni "New +" → "Web Service"
3. Connect GitHub repo: novinar-app
4. Popuni:
   
   Name: novinar-backend
   Region: Frankfurt
   Branch: main
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free

5. Environment Variables (klikni "Add Environment Variable"):
   
   MONGODB_URI = (paste svoj MongoDB Atlas connection string)
   JWT_SECRET = (generiši random: asdkjh234kjh5234kjh523kjh45)
   PORT = 5000
   NODE_ENV = production

6. Klikni "Create Web Service"
7. Sačekaj 2-3 minute (build proces)
8. Kopiraj URL (npr: https://novinar-backend.onrender.com)
```

---

### Korak 3: Deploy Frontend na Render

```
1. Render Dashboard → "New +" → "Static Site"
2. Connect GitHub repo: novinar-app
3. Popuni:

   Name: novinar-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build

4. Environment Variables:

   REACT_APP_API_URL = https://novinar-backend.onrender.com/api
   (koristi URL iz Koraka 2!)

5. Klikni "Create Static Site"
6. Sačekaj 3-5 minuta
7. Dobićeš URL: https://novinar-frontend.onrender.com
```

---

### Korak 4: Testiranje

```
1. Otvori: https://novinar-frontend.onrender.com
2. Registruj se
3. Dodaj RSS feed
4. Dohvati članke
5. Testraj preview modal
6. Zakaži objavu
7. ✅ RADI!
```

---

## 🐳 OPCIJA 2: Docker (Lokalno ili VPS)

### Pokretanje sa Docker-om:

```bash
# 1. Kopiraj .env.example u .env
cp .env.example backend/.env

# 2. Edituj backend/.env sa svojim MongoDB URI

# 3. Edituj frontend/.env
echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env

# 4. Build i pokreni
docker-compose up -d

# 5. Otvori browser
http://localhost
```

### Zaustavljanje:
```bash
docker-compose down
```

---

## ☁️ OPCIJA 3: Vercel (Frontend) + Render (Backend)

### Frontend → Vercel:

```
1. https://vercel.com → Import Project
2. Connect GitHub: novinar-app
3. Root Directory: frontend
4. Framework: Create React App (auto-detect)
5. Environment Variable:
   REACT_APP_API_URL = https://your-backend-url.onrender.com/api
6. Deploy!
```

### Backend → Render:
(Isti kao Korak 2 gore)

---

## 🚂 OPCIJA 4: Railway.app

```
1. https://railway.app → New Project
2. Deploy from GitHub repo
3. Add Service → Backend
   - Root: /backend
   - Start: npm start
   - Add env vars
4. Add Service → Frontend
   - Root: /frontend
   - Build: npm run build
5. Deploy!
```

---

## 🔧 Post-Deployment Setup

### 1. Facebook Integration:

```
1. https://developers.facebook.com
2. Create App → Business
3. Add "Facebook Login" product
4. Settings → Basic:
   - App Domains: your-frontend-url.com
   - Site URL: https://your-frontend-url.com
5. Copy App ID i App Secret
6. U app-u: Connect Facebook button → paste credentials
```

### 2. Custom Domain (Optional):

**Render.com:**
```
1. Dashboard → Your service → Settings
2. Custom Domain → Add Domain
3. Update DNS:
   Type: CNAME
   Name: @
   Value: your-app.onrender.com
```

**Vercel:**
```
1. Project Settings → Domains
2. Add Domain
3. Follow DNS instructions
```

---

## 📊 Monitoring & Logs

### Render.com:
```
Dashboard → Service → Logs tab
Real-time logs, errors, access logs
```

### Docker:
```bash
# Backend logs
docker-compose logs backend

# Frontend logs  
docker-compose logs frontend

# Live tail
docker-compose logs -f
```

---

## 🆘 Troubleshooting

### Backend ne može povezati MongoDB:
```
- Provjeri MONGODB_URI env variable
- Provjeri MongoDB Atlas Network Access (0.0.0.0/0)
- Provjeri Database User credentials
```

### Frontend pokazuje "Network Error":
```
- Provjeri REACT_APP_API_URL env variable
- Backend mora biti pokrenut PRIJE frontend-a
- Provjeri CORS u backend/server.js
```

### Render "Service Unavailable":
```
- Free tier ima sleep nakon 15 min neaktivnosti
- Prvi request traje 30-60 sec (cold start)
- To je normalno za free plan
```

---

## 💰 Troškovi

| Platforma | Plan | Cijena | Limit |
|-----------|------|--------|-------|
| Render.com | Free | 0€ | 750h/mjesec |
| Vercel | Hobby | 0€ | 100GB bandwidth |
| Railway | Free | 0€ | 500h/mjesec |
| MongoDB Atlas | M0 | 0€ | 512MB storage |
| **UKUPNO** | | **0€/mjesec** | |

---

## ✅ Production Checklist

- [ ] MongoDB Atlas cluster kreiran
- [ ] Database user added (admin/password)
- [ ] Network access: 0.0.0.0/0
- [ ] GitHub repo kreiran i uploaded
- [ ] Backend deployed na Render
- [ ] Frontend deployed na Render/Vercel
- [ ] Environment variables konfigurisani
- [ ] DNS settings (ako koristiš custom domain)
- [ ] SSL certifikat (automatski sa Render/Vercel)
- [ ] Testiranje registracije
- [ ] Testiranje RSS dohvaćanja
- [ ] Testiranje preview modal-a
- [ ] Testiranje schedule funkcije
- [ ] (Optional) Facebook integration
- [ ] 🎉 LIVE!

---

## 🎯 Preporučeni Setup

**Za Production:**
```
Frontend: Vercel (brži, bolji CDN)
Backend: Render.com (besplatan, dobar za Node.js)
Database: MongoDB Atlas M0 (besplatan)
```

**Za Development/Testing:**
```
Docker Compose (lokalno na računaru)
Ili: Render.com za sve (lakše za testiranje)
```

---

## 📞 Support

**Render.com Docs:** https://render.com/docs  
**Vercel Docs:** https://vercel.com/docs  
**Docker Docs:** https://docs.docker.com  
**MongoDB Atlas Docs:** https://docs.atlas.mongodb.com

---

**Sve je spremno za deploy! Odaberi platformu i kreni!** 🚀

Za Render.com (najlakše), trebat će ti **10 minuta od nule do live app-a**! 

Javi mi koju platformu ćeš koristiti pa mogu pomoći ako zaglviš! 😊
