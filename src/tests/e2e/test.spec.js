const {Builder, By, Key, until, logging} = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

// URL de base de l'application Angular (doit être en cours d'exécution)
const BASE_URL = 'http://localhost:4200';

describe('Todo Application E2E Tests - Ciblés', () => {
  let driver;

  beforeEach(async () => {
    // Configuration minimale du driver (comme dans l'exemple précédent)
    let options = new chrome.Options();
    // options.addArguments('--headless');
    options.addArguments('--log-level=3');
    options.setLoggingPrefs({browser: 'OFF', driver: 'OFF'});

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    await driver.manage().window().setSize(1200, 800);
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.css('h1')), 10000); // Attendre le chargement initial
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  // --- Test 1: Vérifier la Navigation ---
  it('devrait naviguer entre la page liste et la page ajout', async () => {
    console.log('Test: Vérification Navigation');
    // 1. Vérifier qu'on est sur la page liste par défaut
    await driver.wait(until.urlContains('/liste'), 5000, 'Devrait être sur /liste au démarrage');
    await driver.wait(until.elementLocated(By.css('app-todo-list h2')), 5000);

    // 2. Cliquer sur le lien "Ajouter"
    await driver.findElement(By.css('a[routerLink="/ajouter"]')).click();

    // 3. Vérifier qu'on est sur la page d'ajout
    await driver.wait(until.urlContains('/ajouter'), 5000, 'Devrait être sur /ajouter après clic');
    await driver.wait(until.elementLocated(By.css('app-todo-form h2')), 5000);

    // 4. Cliquer sur le lien "Voir la liste"
    await driver.findElement(By.css('a[routerLink="/liste"]')).click();

    // 5. Vérifier qu'on est revenu sur la page liste
    await driver.wait(until.urlContains('/liste'), 5000, 'Devrait revenir sur /liste');
    await driver.wait(until.elementLocated(By.css('app-todo-list h2')), 5000);
    console.log('Test: Vérification Navigation - OK');
  });

  // --- Test 2: Vérifier l'Affichage de la Liste ---
  it('devrait afficher la liste des tâches initiales', async () => {
    console.log('Test: Vérification Affichage Liste');
    const expectedInitialTask = 'Apprendre Angular'; // Une des tâches initiales du service

    // 1. S'assurer qu'on est sur la page liste (normalement le cas après beforeEach)
    await driver.wait(until.urlContains('/liste'), 5000);

    // 2. Vérifier que le titre du composant liste est présent
    const listTitle = await driver.wait(until.elementLocated(By.css('app-todo-list h2')), 5000);
    assert.ok(listTitle, "Le titre de la liste devrait être affiché");

    // 3. Vérifier qu'au moins une tâche initiale est visible
    try {
      const initialTodoElement = await driver.findElement(By.xpath(`//app-todo-list/ul/li/span[contains(text(), "${expectedInitialTask}")]`));
      assert.ok(initialTodoElement, `La tâche initiale "${expectedInitialTask}" devrait être dans la liste`);
      console.log('Test: Vérification Affichage Liste - OK');
    } catch (e) {
      const allListItems = await driver.findElements(By.css('app-todo-list li span'));
      const texts = await Promise.all(allListItems.map(el => el.getText()));
      console.error("Tâches présentes lors de la vérification de l'affichage : ", texts); // Log pour débogage
      assert.fail(`La tâche initiale "${expectedInitialTask}" n'a pas été trouvée dans la liste.`);
    }
  });

  // --- Test 3: Vérifier l'Ajout ---
  it('devrait ajouter une nouvelle tâche via le formulaire', async () => {
    console.log('Test: Vérification Ajout Tâche');
    const newTaskText = 'Nouvelle tâche ajoutée par test ' + Date.now();

    // 1. Naviguer vers la page d'ajout
    await driver.findElement(By.css('a[routerLink="/ajouter"]')).click();
    await driver.wait(until.urlContains('/ajouter'), 5000);

    // 2. Saisir le texte de la nouvelle tâche
    const taskInput = await driver.findElement(By.css('app-todo-form input#todoText'));
    await taskInput.sendKeys(newTaskText);

    // 3. Cliquer sur le bouton Ajouter
    const addButton = await driver.findElement(By.css('app-todo-form button[type="submit"]'));
    await addButton.click();

    // 4. Attendre la redirection vers la page liste
    await driver.wait(until.urlContains('/liste'), 5000);
    await driver.wait(until.elementLocated(By.css('app-todo-list h2')), 5000);

    // 5. Vérifier que la nouvelle tâche apparaît dans la liste
    try {
      const newTodoElement = await driver.findElement(By.xpath(`//app-todo-list/ul/li/span[contains(text(), "${newTaskText}")]`));
      assert.ok(newTodoElement, 'La tâche ajoutée devrait être visible dans la liste');
      console.log('Test: Vérification Ajout Tâche - OK');
    } catch (e) {
      const allListItems = await driver.findElements(By.css('app-todo-list li span'));
      const texts = await Promise.all(allListItems.map(el => el.getText()));
      console.error("Tâches présentes après ajout : ", texts); // Log pour débogage
      assert.fail(`La tâche ajoutée "${newTaskText}" n'a pas été trouvée dans la liste.`);
    }
  });

});
