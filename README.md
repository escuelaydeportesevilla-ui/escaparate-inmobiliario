# Escaparate Inmobiliario — versión para tu dominio

Carpeta lista para subir a GitHub y servir desde tu propio dominio, sin API
de pago: la redacción con IA se hace abriendo tu cuenta de Claude en una
pestaña nueva con el texto ya preparado; la agenda de visitas se guarda en
un Google Sheet tuyo (o en el navegador si no lo configuras).

## Contenido

- `index.html` — la app entera (HTML+CSS+JS en un solo archivo).
- `apps-script/Code.gs` — backend gratuito sobre Google Sheets para la agenda.

## 1. Publicar en GitHub Pages con tu dominio

1. Crea un repositorio nuevo en GitHub (público o privado, da igual para
   Pages en la mayoría de planes).
2. Sube `index.html` a la raíz del repositorio.
3. Crea un archivo llamado `CNAME` (sin extensión) en la raíz, con una
   sola línea dentro: tu dominio, por ejemplo `escaparate.tudominio.com`
   o `tudominio.com`.
4. En GitHub: Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
   Guarda.
5. En el panel DNS de tu dominio (donde lo compraste), añade:
   - Si usas un subdominio (`escaparate.tudominio.com`): un registro
     **CNAME** apuntando a `TUUSUARIO.github.io`.
   - Si usas el dominio raíz (`tudominio.com`): registros **A** apuntando
     a las IPs de GitHub Pages (185.199.108.153, .109.153, .110.153,
     .111.153).
6. Espera la propagación (minutos a unas horas) y activa "Enforce HTTPS"
   en la misma pantalla de Settings → Pages una vez GitHub verifique el
   dominio.

## 2. Agenda de visitas con Google Sheets (opcional pero recomendado)

Sin este paso, cada visita se guarda solo en el navegador de quien la
apunta — no se comparte entre dispositivos.

1. Sigue las instrucciones dentro de `apps-script/Code.gs` (están en el
   propio archivo, paso a paso): crear el Sheet, pegar el script, definir
   un TOKEN secreto y publicarlo como aplicación web.
2. Copia la URL que te da Google (termina en `/exec`) y el TOKEN que
   elegiste.
3. Abre tu app publicada, despliega "Configuración de la agenda" arriba
   del todo, pega ambos datos y pulsa "Guardar configuración".
4. A partir de ahí, cualquier visita que agendes se escribe directamente
   en tu Sheet — puedes abrirlo y verlas, filtrarlas o exportarlas como
   ya hagas con tus hojas de cálculo habituales.

El TOKEN es la única protección de la agenda: sin él, nadie puede leer ni
escribir aunque encuentre la URL. No lo compartas fuera del equipo.

## 3. Cómo funciona la redacción con IA

- Rellenas la ficha del inmueble (o el mensaje del cliente) y pulsas
  "Abrir en Claude". Se copia un prompt al portapapeles y se abre
  `claude.ai` en una pestaña nueva con el texto ya escrito.
- Revisas/generas en Claude, copias su respuesta completa.
- Vuelves a la app, la pegas en el cuadro "Pega aquí la respuesta de
  Claude" y pulsas "Repartir en las tres tarjetas" (o "Usar como
  respuesta" en el módulo de mensajes). El texto queda organizado y con
  botón de copia por formato.

Si `claude.ai/new?q=…` no te precarga el texto en algún navegador, no pasa
nada: ya lo tienes copiado en el portapapeles, solo pégalo.

## Límites de esta versión

- No hay generación automática dentro de la propia página (evita pagar
  una API); el paso por Claude.ai es manual pero rápido.
- Apps Script tiene cuotas generosas para uso individual/pequeño equipo,
  pero no está pensado para mucho tráfico simultáneo.
- Si en el futuro quieres que la IA responda dentro de la misma página sin
  cambiar de pestaña, hay que añadir un backend con tu propia clave de la
  API de Anthropic — el HTML no cambiaría, solo se conectarían esos
  botones a otro sitio.
