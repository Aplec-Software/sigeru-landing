// Modelo de la landing: consultas a la API de Gestión y solicitudes a la API de Usuarios
import { API } from '../config.js';
import { idiomaActual } from '../vistas/i18n.js';

async function pedir(url, opciones = {}) {
  const r = await fetch(url, { ...opciones, headers: { Accept: 'application/json', 'Accept-Language': idiomaActual(), ...(opciones.headers || {}) } });
  const datos = await r.json().catch(() => ({}));
  if (!r.ok) {
    const error = new Error(datos.mensaje || `Error ${r.status}`);
    error.errores = datos.errores;
    throw error;
  }
  return datos;
}

export const obtenerMapa = () => pedir(`${API.gestion}/mapa`);
export const obtenerParametros = () => pedir(`${API.usuarios}/parametros/publicos`);
export const solicitarRegistro = (datos) => pedir(`${API.usuarios}/auth/registro`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos),
});
