
# 🏗️ Arquitectura MVC - Worldcoin Withdraw App

## 📁 Estructura de Directorios

```
app/
├── views/                    # Vistas (Componentes de presentación)
│   ├── WithdrawalApp.tsx     # Vista principal con navegación
│   ├── AmountView.tsx        # Vista de ingreso de monto
│   ├── DestinationView.tsx   # Vista de selección de destino
│   ├── DataView.tsx          # Vista de datos personales
│   └── ConfirmationView.tsx  # Vista de confirmación
├── hooks/                    # Hooks (Lógica de negocio y estado)
│   ├── useWithdrawal.ts      # Hook principal de retiros
│   ├── useExchangeRate.ts    # Hook para tasas de cambio
│   └── useDestinations.ts    # Hook para destinos
├── services/                 # Servicios (Comunicación con backend)
│   └── withdrawalService.ts  # Servicio principal de retiros
├── types/                    # Tipos TypeScript
│   └── withdrawal.ts         # Tipos del dominio de retiros
├── utils/                    # Utilidades compartidas
│   ├── validation.ts         # Funciones de validación
│   └── constants.ts          # Constantes de la aplicación
├── api/                      # APIs del backend
│   ├── exchange-rates/       # API de tasas de cambio
│   ├── destinations/         # API de destinos
│   └── withdrawal/           # APIs de retiros
│       ├── validate/         # Validación de retiros
│       ├── process/          # Procesamiento de retiros
│       └── status/           # Estado de retiros
└── page.tsx                  # Punto de entrada
```

## 🎯 Principios de la Arquitectura

### **Separación de Responsabilidades**

#### **Views (Vistas)**
- **Responsabilidad**: Solo presentación y interacción del usuario
- **No contienen**: Lógica de negocio, llamadas a APIs, validaciones complejas
- **Sí contienen**: Event handlers, validaciones básicas de UI, renderizado

#### **Hooks (Lógica de Negocio)**
- **Responsabilidad**: Manejo de estado, lógica de negocio, coordinación
- **No contienen**: Lógica de presentación, llamadas directas a APIs
- **Sí contienen**: Estado local, efectos, funciones de negocio

#### **Services (Servicios)**
- **Responsabilidad**: Comunicación con backend, transformación de datos
- **No contienen**: Estado de UI, lógica de presentación
- **Sí contienen**: Llamadas HTTP, transformación de datos, manejo de errores

### **Flujo de Datos**

```
View → Hook → Service → Backend
  ↑      ↑       ↑
  └──────┴───────┘
   Estado y Datos
```

## 🔧 Componentes por Capa

### **1. Views (Capa de Presentación)**

```typescript
// Ejemplo: AmountView.tsx
export default function AmountView({ onNext }: AmountViewProps) {
  const { withdrawalData, updateAmount, error, setError } = useWithdrawal()
  const { convertAmount } = useExchangeRate()
  
  // Solo lógica de presentación
  const handleNumberClick = (number: string) => { /* ... */ }
  const handleContinue = () => { /* ... */ }
  
  return (/* JSX */)
}
```

**Características:**
- Reciben props para navegación
- Usan hooks para obtener estado y funciones
- Manejan eventos de UI
- Renderizan la interfaz

### **2. Hooks (Capa de Lógica)**

```typescript
// Ejemplo: useWithdrawal.ts
export function useWithdrawal(): WithdrawalContextType {
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData>(defaultWithdrawalData)
  
  const updateAmount = useCallback((amount: string) => {
    setWithdrawalData(prev => ({ ...prev, amount }))
    setError(null)
  }, [])
  
  const submitWithdrawal = useCallback(async () => {
    // Lógica de negocio
    const result = await withdrawalService.processWithdrawal(/* ... */)
    // Manejo de estado
  }, [withdrawalData])
  
  return { /* ... */ }
}
```

**Características:**
- Manejan estado local y global
- Contienen lógica de negocio
- Coordinan llamadas a servicios
- Proporcionan interfaz limpia a las vistas

### **3. Services (Capa de Datos)**

```typescript
// Ejemplo: withdrawalService.ts
export class WithdrawalService {
  async processWithdrawal(request: WithdrawalRequest): Promise<WithdrawalResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/withdrawal/process`, {
        method: 'POST',
        headers: { /* ... */ },
        body: JSON.stringify(request)
      })
      return await response.json()
    } catch (error) {
      // Manejo de errores
    }
  }
}
```

**Características:**
- Encapsulan llamadas HTTP
- Manejan transformación de datos
- Proporcionan fallbacks y manejo de errores
- Son reutilizables y testables

## 🚀 Ventajas de esta Arquitectura

### **Escalabilidad**
- **Fácil agregar nuevas vistas**: Solo crear en `views/`
- **Lógica reutilizable**: Hooks pueden ser usados por múltiples vistas
- **Servicios modulares**: Cada servicio maneja un dominio específico

### **Mantenibilidad**
- **Separación clara**: Cada capa tiene responsabilidades específicas
- **Fácil testing**: Cada capa puede ser testeada independientemente
- **Código limpio**: Principios SOLID aplicados

### **Flexibilidad**
- **Cambios de UI**: No afectan lógica de negocio
- **Cambios de backend**: Solo afectan servicios
- **Nuevas funcionalidades**: Fácil de agregar siguiendo el patrón

## 📋 Guías de Desarrollo

### **Agregar una Nueva Vista**

1. Crear archivo en `app/views/`
2. Usar hooks existentes o crear nuevos
3. Seguir el patrón de props para navegación
4. Mantener solo lógica de presentación

### **Agregar Nueva Lógica de Negocio**

1. Crear hook en `app/hooks/`
2. Usar servicios existentes o crear nuevos
3. Exponer interfaz limpia
4. Manejar estado y efectos

### **Agregar Nueva API**

1. Crear endpoint en `app/api/`
2. Crear método en servicio correspondiente
3. Actualizar tipos si es necesario
4. Manejar errores apropiadamente

### **Agregar Validación**

1. Agregar función en `app/utils/validation.ts`
2. Usar en hooks o servicios
3. Mantener consistencia con constantes

## 🔄 Flujo de Desarrollo

### **Para una Nueva Funcionalidad:**

1. **Definir tipos** en `app/types/`
2. **Crear servicio** en `app/services/`
3. **Crear hook** en `app/hooks/`
4. **Crear vista** en `app/views/`
5. **Integrar** en la aplicación principal

### **Para Modificar Existente:**

1. **Identificar capa** afectada
2. **Modificar** solo esa capa
3. **Verificar** que no rompe otras capas
4. **Actualizar** tipos si es necesario

## 🧪 Testing Strategy

### **Unit Tests**
- **Services**: Mock de APIs externas
- **Hooks**: Mock de servicios
- **Utils**: Tests puros de funciones

### **Integration Tests**
- **Views + Hooks**: Renderizado y interacciones
- **Hooks + Services**: Flujo completo de datos

### **E2E Tests**
- **Flujo completo**: Desde vista hasta backend

## 📈 Métricas de Calidad

### **Cobertura de Código**
- **Services**: >90%
- **Hooks**: >85%
- **Utils**: >95%

### **Complejidad Ciclomática**
- **Máximo 10** por función
- **Máximo 5** por componente

### **Acoplamiento**
- **Bajo** entre capas
- **Alto** cohesión dentro de capas

## 🚀 Próximos Pasos

1. **Implementar testing** completo
2. **Agregar logging** y monitoreo
3. **Implementar caching** en servicios
4. **Agregar internacionalización**
5. **Optimizar performance** con React.memo y useMemo
