import { chromium } from 'playwright';

(async () => {
  console.log("🚀 Démarrage de l'assistant DolaPay pour la démonstration LigdiCash...");
  // On lance en mode non-headless pour que vous puissiez regarder l'écran
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("1️⃣ Visite du site officiel de LigdiCash...");
  await page.goto('https://ligdicash.com/');
  await page.waitForTimeout(3000);

  console.log("2️⃣ Visite de la documentation développeur...");
  await page.goto('https://developers.ligdicash.com/');
  await page.waitForTimeout(3000);

  console.log("3️⃣ Connexion à votre espace client LigdiCash...");
  await page.goto('https://client.ligdicash.com/login');
  
  // Remplissage du formulaire avec des placeholders pour la sécurité
  console.log("👉 Saisie de l'email...");
  // Utilisation de l'ID spécifique au lieu du type pour éviter l'erreur de sélection
  await page.waitForSelector('#sign_in_input_email', { timeout: 10000 });
  await page.fill('#sign_in_input_email', 'VOTRE_EMAIL_ICI');
  
  console.log("👉 Saisie du mot de passe...");
  // Il est préférable que vous saisissiez vous-même vos identifiants réels.
  await page.fill('input[type="password"]', 'VOTRE_MOT_DE_PASSE_ICI');
  
  console.log("👉 Clic sur le bouton de connexion...");
  try {
      await page.click('button[type="submit"]');
  } catch (e) {
      try {
          await page.click('button:has-text("Se connecter")');
      } catch(e2) {
          console.log("Sélecteur de bouton non trouvé, on appuie sur Entrée...");
          await page.keyboard.press('Enter');
      }
  }

  // Attendre le chargement du tableau de bord
  console.log("⏳ Attente du chargement du tableau de bord...");
  await page.waitForTimeout(5000); 

  console.log("4️⃣ Exploration du tableau de bord...");
  // Tentative de clic sur "Marchand"
  try {
      await page.click('text=Marchand', { timeout: 3000 });
      await page.waitForTimeout(2000);
      await page.click('text=Projets API', { timeout: 3000 });
      console.log("✅ Section Projets API ouverte avec succès !");
  } catch (e) {
      console.log("⚠️ Navigation automatique spécifique interrompue (interface différente). Regardez l'écran !");
  }

  console.log("👀 Laissez-moi vous montrer cela pendant quelques secondes...");
  await page.waitForTimeout(15000); // Laisse l'écran ouvert 15 secondes
  
  console.log("🏁 Fin de la démonstration automatique.");
  await browser.close();
})();
