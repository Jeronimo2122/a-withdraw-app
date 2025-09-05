# Worldcoin Withdraw App

Una aplicación de retiros de Worldcoin con un flujo de usuario intuitivo y moderno.

## 🚀 Características

- **Flujo de 4 pasos**: Amount → Destination → Data → Confirmation
- **Diseño móvil-first**: Optimizado para dispositivos móviles
- **Interfaz moderna**: Basada en el diseño de la imagen de referencia
- **Gestión de estado**: Context API para manejar el estado de la aplicación
- **Validación de formularios**: Validación en tiempo real
- **Integración World ID**: Preparado para autenticación con World ID

## 📱 Flujo de la Aplicación

### 1. Amount Step
- Ingreso del monto a retirar
- Teclado numérico personalizado
- Conversión automática de EUR a USD
- Validación de monto mínimo

### 2. Destination Step
- Selección del destino del retiro:
  - Cuenta bancaria (Hasta 1 día)
  - Nequi (Instantáneo)
  - Daviplata (Instantáneo)
- Interfaz de selección visual

### 3. Data Step
- Formulario de datos personales:
  - Nombre completo
  - Fecha de nacimiento
  - Correo electrónico
  - Número de celular
- Validación de campos requeridos

### 4. Confirmation Step
- Resumen del retiro
- Detalles del destino seleccionado
- Información de procesamiento
- Confirmación final

## 🏗️ Arquitectura

```
app/
├── page.tsx                 # Página principal con navegación entre pasos
├── layout.tsx              # Layout principal con providers
└── globals.css             # Estilos globales

contexts/
└── WithdrawalContext.tsx   # Context para manejo de estado global

components/
├── withdrawal/
│   ├── Header.tsx          # Header compartido
│   ├── AmountStep.tsx      # Paso 1: Monto
│   ├── DestinationStep.tsx # Paso 2: Destino
│   ├── DataStep.tsx        # Paso 3: Datos
│   └── ConfirmationStep.tsx # Paso 4: Confirmación
└── ui/                     # Componentes UI reutilizables (shadcn/ui)
```

## 🛠️ Tecnologías

- **Next.js 14**: Framework de React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utilitarios
- **shadcn/ui**: Componentes UI
- **World ID**: Autenticación (preparado)
- **Context API**: Gestión de estado

## 🚀 Instalación

1. Instalar dependencias:
```bash
pnpm install
```

2. Ejecutar en desarrollo:
```bash
pnpm dev
```

3. Abrir en el navegador:
```
http://localhost:3000
```

## 📝 Configuración

### Variables de Entorno
Crear un archivo `.env.local` con:
```
# World ID Configuration
NEXT_PUBLIC_WLD_APP_ID=your_app_id
NEXT_PUBLIC_WLD_ACTION=withdraw
```

## 🎨 Diseño

La aplicación está diseñada para replicar exactamente el flujo mostrado en la imagen de referencia:

- **Colores**: Gris oscuro (#2C2C2E) para headers, fondo beige (#F5F5F5)
- **Tipografía**: Inter font family
- **Componentes**: Botones redondeados, cards con sombras sutiles
- **Responsive**: Optimizado para móviles con breakpoints para desktop

## 🔧 Desarrollo

### Estructura de Componentes

Cada paso del flujo es un componente independiente que:
- Recibe props para navegación (`onNext`, `onBack`)
- Usa el contexto para acceder y actualizar el estado
- Implementa validación específica del paso
- Mantiene consistencia visual con el diseño

### Gestión de Estado

El `WithdrawalContext` maneja:
- Datos del retiro (monto, destino, datos personales)
- Funciones para actualizar cada sección
- Estado persistente durante la navegación
- Reset del formulario

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Adaptación automática a pantallas más grandes
- **Touch Friendly**: Botones y elementos táctiles apropiados
- **Keyboard**: Teclado numérico personalizado para entrada de montos

## 🔐 Seguridad

- Validación de formularios en cliente y servidor
- Sanitización de inputs
- Preparado para integración con World ID
- Manejo seguro de datos personales

## 🚀 Próximos Pasos

1. **Integración World ID**: Implementar autenticación real
2. **API Backend**: Conectar con servicios de retiro
3. **Validación Server-side**: Validación robusta en el backend
4. **Testing**: Tests unitarios y de integración
5. **PWA**: Convertir en Progressive Web App
6. **Internacionalización**: Soporte multi-idioma