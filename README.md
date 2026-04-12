# Pomodoro Avatar Study App

En gamifierad studieapplikation byggd med .NET Core Web API och React. Appen hjälper användare att fokusera med Pomodoro-tekniken samtidigt som de samlar XP och levlar upp sin avatar genom att slutföra studieuppgifter ("Quests").

## 🚀 Funktioner
- **Fullstack-integration:** Komplett flöde från SQL-databas till React-frontend.
- **JWT-Autentisering:** Säker inloggning och registrering.
- **Rollbaserad åtkomst:** Olika vyer och rättigheter för `User` och `Admin`.
- **Gamification:** XP-system kopplat till avklarade uppgifter.
- **Responsiv design:** Fungerar på både desktop och mobila enheter.

## 🛠 Teknikstack
- **Backend:** .NET 8/10 Web API, Entity Framework Core, SQL Server Express.
- **Frontend:** React (Vite), CSS3, JavaScript (ES6+).
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
- **[Namn 1]:** Backend-arkitektur, Services-lager, JWT-implementering.
- **[Namn 2]:** Frontend-utveckling, Dashboard-logik, API-integration.
- **[Namn 3]:** Databasdesign, Modeller, CSS/Responsiv design.
