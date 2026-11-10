# SiGeRU - Landing page

Página pública de presentación de SiGeRU: qué es, cómo funciona, mapa público de contenedores y formulario de
registro. HTML, CSS y JavaScript sin frameworks. Los datos del mapa y el registro usan las APIs a través del gateway.

## Estructura

```
index.html
css/estilos.css
js/  config.js, modelos/api.js, vistas/ (dom, i18n, mapa), controladores/inicio.js, app.js
lang/es.json, lang/en.json
img/
```

El idioma por defecto es español; se puede cambiar con el botón ES/EN o con `?lang=en`.

## Reporte con el código del contenedor

Si el QR de un contenedor está dañado, en la sección "Cómo funciona" hay un formulario (**¿El QR no se lee?**) para
escribir el código impreso en la etiqueta. El código se normaliza (`cnt10`, `CNT-10` y `CNT-0010` dan lo mismo) y se
abre el reporte de ese contenedor en `/app/#/qr/CNT-0010`. Un código con otro formato muestra un aviso sin salir de la página.

## Docker

Se sirve con Nginx (`Dockerfile` + `nginx.conf`) detrás del gateway, en la raíz del sitio (`/`).
