1\. What would you NOT automate in this flow, and why?

No automatizaría procesos de validación de seguridad (como el login o la resolución de CAPTCHAs, con los que cuenta MercadoLibre). Tampoco automatizaría el uso de datos personales, contraseñas reales o métodos de pago. El objetivo de una prueba E2E es validar la lógica de búsqueda y visualización, no intentar evadir sistemas de seguridad ni exponer información confidencial en los pipelines.





2\. If MercadoLibre added a CAPTCHA to the search flow, how would you handle it in your test suite?

De hecho, esto me pasó mientras hacía este reto. En mi computadora, lo que hice fue ponerle una pausa al código (timeout) para darme tiempo de resolver el CAPTCHA a mano y poder continuar.



Sin embargo, como estudiante sé que en un entorno real la idea es que las pruebas corran solas y sin ayuda humana. Así que para solucionarlo de verdad, yo pediría que hagamos las pruebas en una página interna de la empresa que tenga el CAPTCHA apagado. Si eso no se puede, otra opción es usar datos falsos (Mocks) en el código; así la página no se da cuenta de que somos un robot y no nos lanza el bloqueo.



3\. What flakiness risks exist in this test, and how did you mitigate them?

Un riesgo es que la página tarde en cargar. Para mitigarlo, en lugar de poner pausas con un tiempo estimado fijo, usé "esperas inteligentes", es decir, decirle al código que espere hasta que aparezca un botón o elemento en específico.



Otro riesgo es que el diseño cambie. Para esto, es mejor buscar los elementos por su texto visible como por  una palabra exacta o también por atributos más estables.



Por último, el mayor riesgo de inestabilidad fueron los bloqueos. Para evitar que la prueba fallara porque MercadoLibre bloqueó nuestra IP, la forma de mitigarlo fue migrar nuestra estrategia a otra página, en este caso a Amazon, para poder completar el flujo.





4\. If you had to add this to a team's CI pipeline running 50+ other test suites, what would you change?

Lo primero que cambiaría sería quitar la pausa de 12 segundos que puse en mi código, porque en un sistema automático en la nube no hay humanos para resolver el CAPTCHA a mano.



Lo segundo que haría es configurar el sistema para que esas 50 pruebas se ejecuten todas al mismo tiempo. Si hacemos que corran una por una, van a tardar muchísimo en terminar. Si corren al mismo tiempo, ahorramos tiempo de espera

