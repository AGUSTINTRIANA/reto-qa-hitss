\# QA Automation Challenge



\## Instalación y Ejecución

1\. Abrir la carpeta del proyecto en la consola.

2\. Instalar las dependencias del proyecto corriendo el comando: 

&#x20;  npm install

3\. Instalar los navegadores de Playwright corriendo el comando: 

&#x20;  npx playwright install

4\. Ejecutar la prueba de MercadoLibre: 

&#x20;  npx ts-node tests/mercadolibre\_test.ts

5\. Ejecutar la prueba de Amazon: 

&#x20;  npx ts-node tests/amazon\_test.ts



\## Notas sobre el desarrollo

Durante el desarrollo local con MercadoLibre me encontré con bloqueos de seguridad (CAPTCHA y error 403) al intentar buscar artículos. Para resolver el reto de forma efectiva, implementé la automatización principal utilizando Amazon México para demostrar la extracción de elementos reales, e incluí el script de MercadoLibre con datos simulados (Mock Data). 

El análisis de esta decisión se encuentra en el archivo TEST\_STRATEGY.md.

