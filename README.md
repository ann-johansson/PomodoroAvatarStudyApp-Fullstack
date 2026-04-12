# Pomodoro Avatar Study App

En pomodoro studieapplikation byggd med .NET Core Web API och React. Appen hjälper användare att fokusera med Pomodoro-tekniken, planen var att den samtidigt skall samla XP och levla upp en avatar genom att slutföra studieuppgifter ("Quests"), detta kommer läggas till under framtida uppdateringar.

## 🚀 Funktioner
- **Fullstack-integration:** Komplett flöde från SQL-databas till React-frontend.
- **JWT-Autentisering:** Säker inloggning och registrering.
- **Rollbaserad åtkomst:** Olika vyer och rättigheter för `User` och `Admin`.
- **Gamification:** XP-system kopplat till avklarade uppgifter.
- **Responsiv design:** Fungerar på enheter med olika storlekar.

## 🛠 Teknikstack
- **Backend:** .NET 10 Web API, Entity Framework Core, SQL Server Express.
- **Frontend:** React (Vite), CSS, JavaScript.
- **Säkerhet:** JSON Web Tokens (JWT) med Role-claims, BCrypt för lösenordshashning.

## 💻 Installation & Setup

### Backend
1. Navigera till `Backend/PomodoroWebAPI`.
2. Uppdatera `appsettings.json` med din lokala SQL Server-anslutningssträng.
3. Kör migrationer: `dotnet ef database update`.
4. Starta API:et: `dotnet run`.

### Frontend
1. Navigera till `Frontend`.
2. Installera paket: `npm install`.
3. Starta utvecklingsservern: `npm run dev`.

## 👥 Gruppmedlemmar & Bidrag
- **[Milo & Ann]:** CORS, Services, EF Core relationer.
- **[Milo]:** Frontend-utveckling, Dashboard-logik, API-integration.
- **[Ann]:** Backend-arkitektur, Databasdesign, Autentisering och JWT-logik.
