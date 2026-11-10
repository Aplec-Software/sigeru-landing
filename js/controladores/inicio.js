// Controlador de la landing: mapa público, contadores y formulario de registro
import { obtenerMapa, obtenerParametros, solicitarRegistro } from '../modelos/api.js';
import { dibujarMapa, leyendaMapa } from '../vistas/mapa.js';
import { t } from '../vistas/i18n.js';
import { esc } from '../vistas/dom.js';

export async function mostrarMapa() {
  const contenedor = document.getElementById('mapa-publico');
  try {
    const [mapa, parametros] = await Promise.all([obtenerMapa(), obtenerParametros()]);
    const { contenedores, centros } = mapa.datos;
    const disponibles = contenedores.filter((c) => c.estado === 'funcional').length;
    document.getElementById('contadores').innerHTML = `
      <div><strong>${contenedores.length}</strong><span>${esc(t('mapa.contenedores'))}</span></div>
      <div><strong>${disponibles}</strong><span>${esc(t('mapa.disponibles'))}</span></div>
      <div><strong>${centros.length}</strong><span>${esc(t('mapa.centros'))}</span></div>`;
    document.getElementById('leyenda').outerHTML = leyendaMapa();
    const p = parametros.datos;
    await dibujarMapa(contenedor, { contenedores, centros }, [Number(p.mapa_latitud || -34.896), Number(p.mapa_longitud || -56.15)], Number(p.mapa_zoom || 13));
  } catch (e) {
    contenedor.innerHTML = `<p class="mensaje mensaje-error">${esc(t('mapa.error'))}</p>`;
  }
}

function claveSegura(v) {
  return v.length >= 10 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v);
}

export function prepararRegistro() {
  const form = document.getElementById('form-registro');
  const mensaje = document.getElementById('mensaje-registro');
  const campoDoc = form.querySelector('.campo-documento');
  form.rol.addEventListener('change', () => {
    campoDoc.hidden = form.rol.value === 'vecino';
    form.documento.required = !campoDoc.hidden;
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    mensaje.className = 'mensaje';
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (!claveSegura(form.password.value)) {
      mensaje.textContent = t('registro.clave_debil');
      mensaje.classList.add('mensaje-error');
      return;
    }
    const datos = Object.fromEntries(new FormData(form));
    if (datos.rol === 'vecino') delete datos.documento;
    else datos.documento = datos.documento.replace(/\D/g, '');
    try {
      const r = await solicitarRegistro(datos);
      form.reset();
      campoDoc.hidden = true;
      mensaje.textContent = r.mensaje;
      mensaje.classList.add('mensaje-ok');
    } catch (err) {
      mensaje.textContent = err.errores ? Object.values(err.errores).join(' ') : err.message;
      mensaje.classList.add('mensaje-error');
    }
  });
}

// Reporte con el código escrito a mano (cuando el QR de la etiqueta está dañado)
export function normalizarCodigo(texto) {
  const limpio = texto.toUpperCase().replace(/\s+/g, '');
  const partes = limpio.match(/^CNT-?(\d{1,6})$/);
  return partes ? `CNT-${partes[1].padStart(4, '0')}` : null;
}

export function prepararCodigo() {
  const form = document.getElementById('form-codigo');
  const mensaje = document.getElementById('mensaje-codigo');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const codigo = normalizarCodigo(form.codigo.value);
    if (!codigo) {
      mensaje.className = 'mensaje mensaje-error';
      mensaje.textContent = t('como.codigo_error');
      form.codigo.focus();
      return;
    }
    location.href = `/app/#/qr/${encodeURIComponent(codigo)}`;
  });
}
