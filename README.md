# Character Chat with World ID Verification

Aplicación de chat interactivo con personajes que utiliza World ID para la verificación de identidad.

## 🚀 Características

- Chat interactivo con personajes personalizables  
- Verificación de identidad mediante World ID  
- Interfaz de usuario moderna y responsiva  
- Persistencia de estado de verificación  
- Soporte para múltiples personajes  

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)  
- [pnpm](https://pnpm.io/) instalado globalmente  
- Cuenta de desarrollador en [World ID](https://developer.worldcoin.org/)  
- World App instalada en tu dispositivo móvil  

## 🔧 Configuración del Entorno (Primera vez)

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd character-chat
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar Tailwind CSS (si es necesario)**
   Si no existen los archivos `tailwind.config.js` y `postcss.config.js`, ejecuta:
   ```bash
   pnpm exec tailwindcss init -p
   ```

4. **Crear archivo de estilos base (si no existe)**
   ```bash
   mkdir -p app
   echo "@tailwind base;\n@tailwind components;\n@tailwind utilities;" > app/globals.css
   ```

5. **Crear archivo de configuración TypeScript (si no existe)**
   ```bash
   npx tsc --init
   ```

6. **Instalar tipos de Node y React (si hay errores)**
   ```bash
   pnpm add -D @types/node @types/react @types/react-dom
   ```

7. **Configurar variables de entorno**
   Crear un archivo `.env.local` en la raíz del proyecto con:
   ```env
   APP_VERIFY=tu-action-id-de-world-id
   OPENAI_API_KEY=tu-clave-de-openai
   ```

8. **Configurar World ID**
   - Ir a [World ID Developer Portal](https://developer.worldcoin.org/)
   - Crear una acción con el nombre que pusiste en `APP_VERIFY`
   - Usar nivel de verificación `Device`

## 🏃‍♂️ Ejecutar la aplicación

1. **Modo desarrollo**
   ```bash
   pnpm run dev
   ```

2. **Abrir la aplicación**
   Ir a [http://localhost:3000](http://localhost:3000)

## 🔐 Verificación

1. **Primera vez**
   - Se solicitará verificación de identidad
   - Abre la World App en tu teléfono y sigue las instrucciones

2. **Verificaciones posteriores**
   - Se almacenan en localStorage si `persistVerification` está habilitado
   - Para volver a verificar:
     - Limpiar localStorage
     - Llamar `clearVerification()`
     - Deshabilitar persistencia en el código

## 🛠️ Estructura del Proyecto

```
character-chat/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── verify/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── character-settings.tsx
│   └── ui/
├── hooks/
│   └── useWorldIDVerification.ts
├── lib/
├── public/
└── styles/
```

## 📦 Dependencias Principales

- Next.js  
- React  
- World ID MiniKit  
- Tailwind CSS  
- Shadcn/ui  
- AI SDK (para integración con OpenAI)

## 🤝 Contribuir

1. Haz fork del proyecto  
2. Crea una rama (`git checkout -b feature/NuevaFuncion`)  
3. Realiza cambios y commits (`git commit -m 'Nueva funcion'`)  
4. Haz push (`git push origin feature/NuevaFuncion`)  
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte, por favor abre un issue en GitHub o contacta al equipo de desarrollo.
