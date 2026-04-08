# Tabby Broadcast Input Plugin

Plugin para Tabby que agrega una barra de comando siempre visible en la parte inferior.

## Que hace

- Muestra un input fijo con boton `Enviar`
- Al presionar `Enter` o el boton, envia el comando a todas las tabs de terminal abiertas
- Funciona tambien con tabs dentro de `SplitTab`

## Uso

1. Escribe el comando en la barra inferior.
2. Pulsa `Enter` o haz clic en `Enviar`.
3. El comando se manda a cada terminal abierta con salto de linea final.

## Build

```bash
npm install
npm run build
```

## Instalar en Tabby

1. Copia esta carpeta en el directorio de plugins de Tabby.
2. Asegurate de que exista `dist/index.js` ejecutando el build.
3. Reinicia Tabby.

Tabby detecta el plugin porque `package.json` incluye el keyword `tabby-plugin`.