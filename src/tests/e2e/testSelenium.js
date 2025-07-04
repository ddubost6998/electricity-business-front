const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');
const path = require('path'); // Utilisé ici juste pour info, pas nécessaire si URL fixe
const chrome = require('selenium-webdriver/chrome');

// URL de base de l'application Angular
const BASE_URL = 'http://localhost:4200';

(async function simpleAddTodoTest() {
  console.log("Début du test simple d'ajout...");
  let options = new chrome.Options();
  options.addArguments('--log-level=3'); // Supprime certains logs non essentiels
  options.setLoggingPrefs({browser: 'OFF', driver: 'OFF'});

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Naviguer vers l'application
    await driver.get(BASE_URL);
    console.log(`Navigué vers ${BASE_URL}`);

    // Définir le texte unique pour la nouvelle tâche
    const simpleTaskText = 'Test simple ajout ' + Date.now();

    // Cliquer sur le lien pour aller au formulaire
    console.log("Navigation vers la page d'ajout...");
    await driver.wait(until.elementLocated(By.css('a[routerLink="/ajouter"]')), 10000).click();

    // Attendre que le formulaire soit chargé
    console.log("Attente du formulaire...");
    await driver.wait(until.urlContains('/ajouter'), 5000);
    const taskInput = await driver.wait(until.elementLocated(By.css('app-todo-form input#todoText')), 5000);
    const addButton = await driver.findElement(By.css('app-todo-form button[type="submit"]'));

    // Entrer le texte et soumettre
    console.log(`Ajout de la tâche: "${simpleTaskText}"`);
    await taskInput.sendKeys(simpleTaskText);
    await addButton.click();

    // Attendre la redirection vers la liste
    console.log("Attente de la redirection vers la liste...");
    await driver.wait(until.urlContains('/liste'), 5000);
    await driver.wait(until.elementLocated(By.css('app-todo-list h2')), 5000);

    // Vérifier que la tâche existe dans la liste
    console.log("Vérification de la présence de la tâche dans la liste...");
    try {
      const newTodoElement = await driver.findElement(By.xpath(`//app-todo-list/ul/li/span[contains(text(), "${simpleTaskText}")]`));
      assert.ok(newTodoElement, 'La nouvelle tâche devrait être dans la liste');
      console.log('Test simple: SUCCÈS - Tâche ajoutée et trouvée.');
    } catch (e) {
      const allListItems = await driver.findElements(By.css('app-todo-list li span'));
      const texts = await Promise.all(allListItems.map(el => el.getText()));
      console.error("Tâches présentes : ", texts);
      assert.fail(`Test simple: ÉCHEC - La tâche "${simpleTaskText}" n'a pas été trouvée dans la liste.`);
    }

  } catch (error) {
    console.error('Test simple: ERREUR -', error);
  } finally {
    if (driver) {
      await driver.quit();
      console.log('Test simple: Navigateur fermé.');
    }
  }
})();
