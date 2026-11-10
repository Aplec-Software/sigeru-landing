import { cargarIdioma, idiomaActual } from './vistas/i18n.js';
import { mostrarMapa, prepararCodigo, prepararRegistro } from './controladores/inicio.js';

async function iniciar() {
  // idioma: el de la dirección (?lang=en) o español, que es el idioma por defecto del sistema
  const pedido = new URLSearchParams(location.search).get('lang') || 'es';
  await cargarIdioma(pedido);
  const boton = document.getElementById('idioma');
  boton.textContent = idiomaActual() === 'es' ? 'EN' : 'ES';
  boton.addEventListener('click', async () => {
    await cargarIdioma(idiomaActual() === 'es' ? 'en' : 'es');
    boton.textContent = idiomaActual() === 'es' ? 'EN' : 'ES';
    mostrarMapa();
  });
  prepararRegistro();
  prepararCodigo();
  mostrarMapa();
}
iniciar();
