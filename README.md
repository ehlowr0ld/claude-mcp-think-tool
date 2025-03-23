# Claude MCP Think Tool

Un servidor MCP (Model Context Protocol) que implementa la herramienta "think" para Claude Desktop.

## Descripción

Esta herramienta permite a Claude utilizar un espacio estructurado para pensar y razonar paso a paso durante la resolución de problemas complejos. La herramienta proporciona:

- Registro de pensamientos con marcas de tiempo
- Recuperación de la secuencia de pensamiento
- Estadísticas sobre el proceso de pensamiento
- Capacidad para borrar la sesión de pensamiento

## Instalación

### Usando npx (sin instalación)

```bash
npx -y github:cgize/claude-mcp-think-tool
```

### Instalación global

```bash
npm install -g github:cgize/claude-mcp-think-tool
```

## Configuración con Claude Desktop

Añade esta configuración a tu archivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "think-tool": {
      "command": "npx",
      "args": [
        "-y",
        "github:cgize/claude-mcp-think-tool"
      ],
      "type": "stdio",
      "pollingInterval": 30000,
      "startupTimeout": 30000,
      "restartOnFailure": true
    }
  }
}
```

La ubicación de este archivo depende de tu sistema operativo:

- **Windows**: `%APPDATA%\Anthropic\Claude\mcp.json`
- **macOS**: `~/Library/Application Support/Anthropic/Claude/mcp.json`
- **Linux**: `~/.config/Anthropic/Claude/mcp.json`

## Uso

Una vez configurado, puedes usar la herramienta de pensamiento con Claude Desktop para problemas que requieren razonamiento paso a paso:

1. **Registrar un pensamiento**: `think` - Guarda un paso de razonamiento
2. **Ver todos los pensamientos**: `get_thoughts` - Muestra la secuencia completa de razonamiento
3. **Limpiar pensamientos**: `clear_thoughts` - Borra todos los pensamientos guardados

## Desarrollo

### Requisitos previos

- Node.js 14 o superior
- npm o yarn

### Configuración local

```bash
git clone https://github.com/cgize/claude-mcp-think-tool.git
cd claude-mcp-think-tool
npm install
npm run build
```

## Licencia

MIT
