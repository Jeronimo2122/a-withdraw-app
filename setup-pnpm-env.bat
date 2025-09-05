@echo off
echo ================================
echo INICIANDO LIMPIEZA Y CONFIGURACION DE PNPM
echo ================================

:: 1. Eliminar configuraciones anteriores
echo Eliminando node_modules, lock files y dist...
rmdir /s /q node_modules 2>nul
del /q package-lock.json 2>nul
del /q yarn.lock 2>nul
del /q pnpm-lock.yaml 2>nul
del /q tailwind.config.* 2>nul
del /q postcss.config.* 2>nul

:: 2. Inicializar package.json si no existe
if not exist package.json (
  echo Creando package.json...
  pnpm init -y
)

:: 3. Instalar dependencias principales
echo Instalando dependencias principales...
pnpm add next react react-dom

:: 4. Instalar dependencias de desarrollo (Dev)
echo Instalando dependencias de desarrollo...
pnpm add -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer eslint eslint-config-next tailwindcss-animate

:: 5. Crear archivos de configuración Tailwind
echo Generando tailwind.config.js y postcss.config.js...
pnpm exec tailwindcss init -p

:: 6. Crear carpeta app/ y archivo globals.css si no existen
if not exist app (
  mkdir app
)

if not exist app\globals.css (
  echo @tailwind base;> app\globals.css
  echo @tailwind components;>> app\globals.css
  echo @tailwind utilities;>> app\globals.css
)

:: 7. Crear tsconfig.json si no existe
if not exist tsconfig.json (
  echo Generando tsconfig.json...
  echo {^
  "compilerOptions": {^
    "lib": ["dom", "dom.iterable", "esnext"],^
    "allowJs": true,^
    "target": "ES6",^
    "skipLibCheck": true,^
    "strict": true,^
    "noEmit": true,^
    "esModuleInterop": true,^
    "module": "esnext",^
    "moduleResolution": "bundler",^
    "resolveJsonModule": true,^
    "isolatedModules": true,^
    "jsx": "preserve",^
    "incremental": true,^
    "plugins": [ { "name": "next" } ],^
    "paths": { "@/*": ["./*"] }^
  },^
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],^
  "exclude": ["node_modules"]^
} > tsconfig.json
)

:: 8. Mostrar versión actual de PNPM
echo PNPM versión instalada:
pnpm -v

echo ================================
echo CONFIGURACIÓN COMPLETA
echo Puedes ejecutar: pnpm run dev
echo ================================
pause
