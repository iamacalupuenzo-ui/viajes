# Template Angular — Enzo System

Template base para proyectos Angular con CDK y design system propio.

## Stack
- Angular 17+ (Standalone Components)
- TypeScript
- SCSS
- Angular CDK (sin Angular Material)
- Design tokens propios (sin UI lib de terceros)

## Comandos

```bash
pnpm start      # dev server en localhost:4200
pnpm build      # build de producción
pnpm test       # unit tests
```

## Arrancar proyecto nuevo

1. Copiar esta carpeta con el nombre del proyecto
2. Cambiar `name` en `package.json`
3. `pnpm install`
4. `pnpm start`

## Estructura

```
src/
├── app/
│   ├── core/            → servicios globales, guards, interceptors
│   │   ├── services/
│   │   └── guards/
│   ├── shared/          → componentes, pipes y directives reutilizables
│   │   ├── components/  → TUS componentes (Button, Card, Input...)
│   │   ├── directives/
│   │   └── pipes/
│   └── features/        → módulos de negocio (lazy loading)
│       └── [feature]/
│           ├── components/
│           ├── services/
│           └── models/
├── styles/
│   ├── tokens/
│   │   ├── _primitives.scss  → valores crudos
│   │   └── _semantic.scss    → tokens con intención
│   └── styles.scss           → entry point
```

## Tokens

Los colores se usan via CSS vars directamente en SCSS o templates:
```scss
.btn-primary {
  background-color: var(--color-brand-default);
  color: var(--color-text-on-brand);
}
```

## Agregar una feature nueva

```bash
ng generate component features/nombre-feature/components/mi-componente
ng generate service features/nombre-feature/services/mi-servicio
```

Tipografía, bordes y sombras se agregan cuando estén
definidos en Lyse Design System.
