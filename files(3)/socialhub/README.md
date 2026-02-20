# 📰 Novinar - Social Media Manager

**Profesionalna aplikacija za upravljanje objavljivanjem članaka na social media platformama.**

Dizajnirana po uzoru na postojeće novinarske sisteme - identičan UI/UX.

---

## ✨ Funkcionalnosti

### ✅ RSS Management
- Dodavanje neograničenog broja RSS izvora
- Automatsko dohvaćanje novih članaka
- Filtriranje po izvoru

### ✅ Content Preview sa 3 Taba
- **WordPress** - Očišćen tekst, copy-paste ready
- **Facebook** - Formatiran post sa preview-om
- **Instagram** - Caption sa emoji i hashtag-ovima

### ✅ Status Tracking
- **Neobjavljeno** - Novi članci sa RSS-a
- **Obrada** - Članci u procesu editovanja
- **Za zakazivanje** - Spremni za scheduling
- **Čeka Facebook** - Zakazani za objavu
- **Objavljeno** - Uspješno objavljeni
- **Neuspješno** - Greške pri objavljivanju

### ✅ Zakazivanje (Scheduling)
- Početak i kraj objavljivanja
- Interval između objava
- Tačno vrijeme objave

### ✅ Social Media Integracija
- **Facebook** - Automatsko objavljivanje
- **WordPress** - Copy-paste ready
- **Instagram** - Caption generation

### ✅ Multi-user Support
- Login/Register sistem
- Odvojeni računi
- Svako vidi svoje članke

---

## 🚀 Deployment Opcije

### OPCIJA 1: Render.com (Preporučeno - 100% Besplatno)

```
✅ Frontend + Backend na jednom mjestu
✅ Automatski SSL (HTTPS)
✅ CI/CD iz GitHub-a
✅ 750h besplatno mjesečno

📖 Vidi: DEPLOYMENT.md za korak-po-korak vodič
```

### OPCIJA 2: Docker (Lokalno ili VPS)

```bash
# Jednostavno pokreni:
./deploy.sh      # Linux/Mac
deploy.bat       # Windows

# Ili ručno:
docker-compose up -d
```

### OPCIJA 3: Vercel + Render

```
Frontend → Vercel (brži CDN)
Backend → Render.com
Database → MongoDB Atlas

📖 Vidi: DEPLOYMENT.md
```

---

## 💻 Lokalno Pokretanje

### Preduvjeti:
1. **Node.js** - https://nodejs.org/ (LTS verzija)
2. **MongoDB Atlas** - https://www.mongodb.com/cloud/atlas/register

### Setup:

```bash
# 1. Kloniraj/Download repo

# 2. MongoDB Atlas
- Kreiraj cluster (FREE M0)
- Database User: admin / password
- Network Access: 0.0.0.0/0
- Kopiraj connection string

# 3. Konfiguriši Backend
cd backend
cp ../.env.example .env
# Edituj .env sa svojim MongoDB URI

# 4. Instaliraj Dependencies
npm install

# 5. Pokreni Backend
npm start

# 6. U novom terminalu - Frontend
cd frontend
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm install
npm start

# 7. Otvori browser
http://localhost:3000
```

### Windows - Brzo:
```
1. Duplo-klikni START-BACKEND.bat
2. Duplo-klikni START-FRONTEND.bat
```

---

## 📖 Dokumentacija

- **README.md** - Ovaj fajl (overview)
- **DEPLOYMENT.md** - Kompletan deployment vodič
- **UPDATE_NOTES.md** - Changelog i nove funkcionalnosti

---

## 🎯 Kako Koristiti

### 1. Prva Prijava

```
1. Otvori http://localhost:3000
2. Klikni "Registruj se"
3. Unesi:
   - Username: irfan (ili tvoje ime)
   - Email: irfan@example.com
   - Password: (minimum 6 karaktera)
4. Klikni "Registruj se"
```

### 2. Dodaj RSS Feedove

```
Feedovi su već dodani u backend ali možeš dodati nove:

- Zenit.ba: https://www.zenit.ba/feed/
- Klix.ba: https://www.klix.ba/rss
- Oslobođenje: https://www.oslobodjenje.ba/rss
- Avaz: https://avaz.ba/rss
```

Dodavanje: Backend route `/api/rss/feeds` (POST request)

### 3. Dohvati Članke

```
- Klikni ikonicu "Osvježi" (FaRedo) u header-u
- Ili koristi dropdown i odaberi izvor
- Sačekaj 5-10 sekundi
- Članci će se pojaviti!
```

### 4. Zakaži Objavu

```
1. Pronađi članak u listi
2. Klikni plavo dugme sa strelicom (FaPaperPlane)
3. Popuni modal:
   - Početak: 15:00
   - Kraj: 23:50
   - Interval: 10 minuta
   - Datum/vrijeme: Odaberi kada želiš objaviti
4. Klikni "Sačuvaj promjene"
```

### 5. Poveži Facebook (Optional)

```
1. Klikni na Facebook ikonicu u header-u (desno)
2. Unesi:
   - Page Access Token (dobij sa Facebook Developers)
   - Page ID
3. Klikni "Poveži"

Token: https://developers.facebook.com/ → Graph API Explorer
```

### 6. Poveži WordPress (Copy-Paste)

```
WordPress.com free plan ne dozvoljava API pristup.

Zato:
1. Otvori članak
2. Kopiraj čist tekst
3. Paste u WordPress editor
4. Objavi ručno
```

---

## 🎨 Dizajn - Identičan kao na Slikama

### Header (Siva pozadina)
- Ikone: Home, Edit, Stats, Refresh, Bell, Image
- Desno: Username, Facebook status, WordPress status, Logout

### Source Dropdown (Plavi)
- Dropdown sa svim RSS izvorima
- Refresh dugme

### Status Tabs
- 6 tabova sa ikonama i brojačima
- Aktivni tab plavo podvučen

### Article Cards
- Status ikonica (krug sa ✅, ❌, ⏸, itd.)
- Naslov članka
- Badges: NOVO, PENDING
- Akcije: Web (globe), Pošalji (strelica)

### Schedule Modal (kao na trećoj slici)
- Početak objavljivanja (HH:MM)
- Kraj objavljivanja (HH:MM)
- Interval (minuta)
- Datum i vrijeme zadnje objave
- Crno dugme "Sačuvaj promjene"

---

## 🔧 Troubleshooting

### Backend ne startuje
```bash
# Provjeri MongoDB connection string u .env
# Provjeri da li je MongoDB Atlas cluster aktivan
```

### Frontend pokazuje "Network Error"
```bash
# Backend nije pokrenut
# Provjeri: http://localhost:5000/health u browseru
# Trebao bi vidjeti: {"status":"OK"}
```

### "npm is not recognized"
```bash
# Node.js nije instaliran
# Download: https://nodejs.org/
# Restartuj računar nakon instalacije
```

### Članci se ne dohvaćaju
```bash
# RSS URL nije validan
# Provjeri URL u browseru
# Neki sajtovi blokiraju scraping - to je normalno
```

---

## 📊 API Endpoints

```
POST   /api/auth/register          - Registracija
POST   /api/auth/login             - Prijava
GET    /api/auth/me                - Trenutni korisnik

POST   /api/rss/feeds              - Dodaj RSS feed
GET    /api/rss/feeds              - Svi feedovi
POST   /api/rss/fetch-all          - Dohvati sve članke

GET    /api/articles               - Članci (filter: ?status=neobjavljeno)
PATCH  /api/articles/:id/status    - Promijeni status

POST   /api/schedule/:id           - Zakaži članak
POST   /api/schedule/:id/facebook  - Objavi na Facebook
```

---

## 🌐 Cloud Deployment (Optional)

### Backend → Render.com
```
1. https://render.com → New Web Service
2. Build: npm install
3. Start: npm start
4. Env vars: MONGODB_URI, JWT_SECRET, PORT
```

### Frontend → Vercel
```
1. https://vercel.com → Import Project
2. Auto-detect React
3. Env var: REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## 💰 Troškovi

| Servis | Plan | Cijena |
|--------|------|--------|
| MongoDB Atlas | Free M0 | 0€ |
| Render.com | Free | 0€ |
| Vercel | Hobby | 0€ |
| **UKUPNO** | | **0€/mjesec** |

---

## 🎯 Razlike od Prethodne Verzije

### Što je NOVO:
- ✅ Dizajn identičan tvojim slikama
- ✅ Status sistem (6 statusa)
- ✅ Schedule modal sa tačnim poljima (početak, kraj, interval)
- ✅ Header sa ikonicama
- ✅ Plavi source dropdown
- ✅ NOVO i PENDING badges
- ✅ Connection status (Facebook/WordPress)
- ✅ Datum grupiranje članaka

### Što je ISTO:
- ✅ RSS dohvaćanje
- ✅ Text cleaning
- ✅ Multi-user
- ✅ Zakazivanje
- ✅ 100% besplatno

---

## ✅ Checklist - Prvi Put

- [ ] Registruj se na MongoDB Atlas
- [ ] Kopiraj connection string u backend\.env
- [ ] Duplo-klikni START-BACKEND.bat
- [ ] Duplo-klikni START-FRONTEND.bat
- [ ] Otvori http://localhost:3000
- [ ] Registruj se (tvoj account)
- [ ] Registruj kolegu (njegov account)
- [ ] Dohvati članke (Refresh dugme)
- [ ] Zakaži prvi članak
- [ ] (Optional) Poveži Facebook
- [ ] 🎉 Uživaj!

---

**Aplikacija je 100% identična dizajnu sa tvojih slika!** 🚀

Irfane, uživaj u korištenju! 😊
