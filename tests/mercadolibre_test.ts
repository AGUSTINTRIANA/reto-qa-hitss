import { chromium } from 'playwright';
import axios from 'axios';

interface Product {
  name: string;
  price: number;
}

async function runChallenge() {
  console.log('Iniciando reto de automatización...');

  // Headless por defecto. Cambia a false para ver el navegador.
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // PARTE 1: UI AUTOMATION
    console.log('Abriendo Mercado Libre...');

    // Usamos URL directa para evitar selección de país y reducir riesgo de CAPTCHA
    await page.goto(
      'https://listado.mercadolibre.com.mx/playstation-5',
      { waitUntil: 'domcontentloaded' }
    );

    // Esperar a que carguen resultados
    await page.waitForSelector('ol.ui-search-layout, .ui-search-results', {
      timeout: 30000
    });

    // FILTRO: Nuevos
    console.log('Aplicando filtro: Nuevos');

    const newFilter = page.locator('a').filter({ hasText: /^Nuevo$/ }).first();
    if (await newFilter.isVisible().catch(() => false)) {
      await newFilter.click();
      await page.waitForLoadState('networkidle');
    }

    // FILTRO: Ciudad de México
    console.log('Aplicando filtro: Ciudad de México');

    const cdmxFilter = page
      .locator('a')
      .filter({ hasText: /Ciudad de México/i })
      .first();

    if (await cdmxFilter.isVisible().catch(() => false)) {
      await cdmxFilter.click();
      await page.waitForLoadState('networkidle');
    } else {
      console.log('No se encontró el filtro Ciudad de México, continuando...');
    }

    // ORDENAR: Menor precio
    console.log('Ordenando por menor precio');

    const sortButton = page.locator('span.andes-dropdown__display-values').first();
    if (await sortButton.isVisible().catch(() => false)) {
      await sortButton.click();

      const lowestPriceOption = page
        .locator('li, a, span')
        .filter({ hasText: /Menor precio/i })
        .first();

      if (await lowestPriceOption.isVisible().catch(() => false)) {
        await lowestPriceOption.click();
        await page.waitForLoadState('networkidle');
      }
    }

    
    // EXTRAER PRIMEROS 5 RESULTADOS
    console.log('\n===== RESULTADOS EXTRAÍDOS DE LA UI =====');

    const items = page.locator('li.ui-search-layout__item');
    const count = await items.count();

    if (count < 5) {
      throw new Error(`Solo se encontraron ${count} resultados.`);
    }

    const uiProducts: Product[] = [];

    for (let i = 0; i < 5; i++) {
      const item = items.nth(i);

      // Nombre del producto
      const name = (
        await item.locator('h3, .poly-component__title').first().innerText()
      ).trim();

      // Parte entera del precio
      const priceText = await item
        .locator('.andes-money-amount__fraction')
        .first()
        .innerText();

      const price = Number(priceText.replace(/\./g, '').replace(/,/g, ''));

      uiProducts.push({ name, price });

      console.log(`${i + 1}. ${name} - $${price}`);
    }

    // PARTE 2: API VALIDATION
    console.log('\n===== CONSULTANDO API DE MERCADO LIBRE =====');

    const response = await axios.get(
      'https://api.mercadolibre.com/sites/MLM/search?q=playstation%205'
    );

    const apiProducts = response.data.results.map((item: any) => ({
      name: item.title,
      price: Number(item.price)
    }));

    // COMPARACIÓN UI VS API
    console.log('\n===== COMPARACIÓN UI VS API =====');

    let matches = 0;

    for (const uiProduct of uiProducts) {
      const match = apiProducts.find((apiProduct: Product) => {
        const uiName = uiProduct.name.toLowerCase();
        const apiName = apiProduct.name.toLowerCase();

        // Coincidencia flexible por inclusión parcial
        return (
          uiName.includes(apiName.substring(0, 20)) ||
          apiName.includes(uiName.substring(0, 20))
        );
      });

      if (match) {
        matches++;
        console.log(`   Coincide: ${uiProduct.name}`);
        console.log(`   UI : $${uiProduct.price}`);
        console.log(`   API: $${match.price}`);

        if (uiProduct.price !== match.price) {
          console.log('    Diferencia de precio detectada');
        }
      } else {
        console.log(`No encontrado en API: ${uiProduct.name}`);
      }
    }

    // VALIDACIÓN FINAL
    console.log(`\n Coincidencias totales: ${matches} de 5`);

    if (matches >= 3) {
      console.log(' RETO APROBADO: al menos 3 productos coinciden con la API.');
    } else {
      throw new Error(
        `Solo ${matches} productos coincidieron con la API. Se requieren al menos 3.`
      );
    }
  } catch (error) {
    console.error(' Error durante la ejecución:', error);

    // Captura automática en caso de fallo
    await page.screenshot({
      path: 'error-screenshot.png',
      fullPage: true
    });
  } finally {
    await browser.close();
    console.log('\n Ejecución finalizada.');
  }
}

runChallenge();

