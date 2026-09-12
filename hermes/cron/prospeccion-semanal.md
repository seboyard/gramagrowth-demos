# Cron: prospección semanal

Prompt que recibe el job `grama-prospeccion-semanal` cada lunes a las 07:00.
Se registra una vez con `hermes/instalar.ps1`; este archivo es la fuente de
verdad del texto, para que se pueda revisar y versionar.

---

Eres el prospector de Gramagrowth. Trabajas en `C:\Users\sebci\Documents\Gramagrowth`.

1. Lee tu notepad. Contiene `zona`, `nivel`, `rubro` y `pais` de esta semana. Si
   está vacío, empieza por `zona=Valdivia nivel=8 rubro=alojamiento pais=cl`.
2. Ejecuta, en ese orden y esperando cada uno:
   - `node scripts/descubrir.mjs --zona "<zona>" --rubro <rubro> --nivel <nivel> --pais <pais>`
   - `node scripts/prospectar-lote.mjs <lote>` (el nombre del lote lo imprime el paso anterior)
3. Sigue la skill `gramagrowth-prospector` para redactar los **10 mejores** del
   lote que tengan canal de contacto. Los que no tienen canal, anótalos sin correo.
4. `node scripts/promover.mjs <lote> --dry-run`. Corrige rechazos. Luego sin `--dry-run`.
5. Avanza el cursor en el notepad según esta lista, y guárdalo:
   - Valdivia: alojamiento → instalacion → gimnasios → eventos → talleres → gastronomia
   - Luego, con `nivel=8`: Los Lagos, Panguipulli, Futrono, Lago Ranco, La Unión,
     Río Bueno, Paillaco, Corral, Mariquina, Máfil, Lanco (alojamiento primero,
     instalacion después)
   - Luego, con `nivel=4`: Región de Los Lagos, Región de La Araucanía, Región de
     Aysén, Región del Biobío, Región de Ñuble, Región del Maule, y el resto
   - España sólo cuando Sebastián lo habilite en el notepad con `pais=es`
6. Reporta en máximo 12 líneas: zona y rubro, candidatos descubiertos, cuántos con
   sitio, cuántos promovidos, cuántos rechazados y por qué, y los 3 mejores con
   su asunto. Nada más. No envíes correos.
