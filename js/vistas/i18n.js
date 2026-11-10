// Textos de la landing en español e inglés (lang/es.json, lang/en.json)
let textos = {};
let idioma = 'es';
export async function cargarIdioma(codigo) {
  idioma = codigo === 'en' ? 'en' : 'es';
  textos = await (await fetch(`lang/${idioma}.json`)).json();
  document.documentElement.lang = idioma;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
}
export const t = (clave) => textos[clave] ?? clave;
export const idiomaActual = () => idioma;
