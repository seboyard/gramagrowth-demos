"""Job de cron de Hermes (modo --no-agent): trae los prospectos que deja el bot
en seboyard/production-data al repo Gramagrowth y los audita.

Se instala con hermes/instalar.ps1 -ConCron en HERMES_HOME/scripts/ y se
registra así:

  hermes -p grama cron create "0 */6 * * *" --name grama-sync-hermes --no-agent \
    --script sincronizar_gramagrowth.py --deliver telegram

Sin LLM: sólo corre el script de Node y reenvía su resumen. Si no hay nada
nuevo, imprime una línea corta igual, para saber que corrió.
"""
import os
import subprocess
import sys

REPO = os.environ.get("GRAMAGROWTH_REPO", r"C:\Users\sebci\Documents\Gramagrowth")

result = subprocess.run(
    ["node", "scripts/sincronizar-hermes.mjs"],
    cwd=REPO, capture_output=True, text=True, encoding="utf-8", errors="replace",
)
out = (result.stdout or "").strip()
err = (result.stderr or "").strip()
if result.returncode != 0:
    print(f"Sincronización Gramagrowth falló ({result.returncode}): {err or out}")
    sys.exit(0)
print("Sincronización Gramagrowth · " + (out.splitlines()[0] if out else "sin salida"))
for line in out.splitlines()[1:12]:
    print(line)
