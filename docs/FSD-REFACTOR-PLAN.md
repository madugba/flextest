# Frontend FSD Architecture Refactor Plan

## Current Structure Issues

### Non-FSD Compliant Directories
- ❌ `/src/components` - Should move to `/src/shared/ui` or `/src/widgets`
- ❌ `/src/hooks` - Should move to `/src/shared/hooks` or feature-specific
- ❌ `/src/lib` - Should move to `/src/shared/lib`
- ❌ `/src/app/**/components` - Should move to `/src/widgets`
- ❌ `/src/app/**/hooks` - Should move to `/src/features`

### ✅ Already FSD Compliant
- `/src/entities` - Business entities
- `/src/features` - User interactions (error-display, metrics)
- `/src/widgets` - Composite components (dashboard)
- `/src/shared` - Reusable code
- `/src/processes` - Business processes
- `/src/app` - Next.js App Router (routes only)

## FSD Layer Structure

```
src/
├── app/                    # Next.js App Router (routing only)
│   ├── (auth)/
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── candidate_login/
│   ├── dashboard/
│   ├── onboarding/
│   └── layout.tsx
│
├── processes/              # Complex business processes
│   └── (existing processes)
│
├── pages/                  # Page compositions (optional with App Router)
│
├── widgets/                # Large composite components
│   ├── dashboard/
│   │   ├── ui/            # UI components
│   │   └── index.ts       # Public API
│   ├── auth/              # NEW - Auth forms
│   └── onboarding/        # NEW - Onboarding wizards
│
├── features/               # User interactions
│   ├── metrics/           # ✅ Already done
│   ├── auth/              # NEW - Login/logout/reset
│   ├── error-display/     # ✅ Already exists
│   └── form-validation/   # NEW - Form handling
│
├── entities/               # Business entities
│   ├── metrics/           # ✅ Already done
│   ├── user/              # NEW - User entity
│   ├── admin/             # NEW - Admin entity
│   └── center/            # NEW - Center entity
│
└── shared/                 # Reusable code
    ├── ui/                # UI kit
    ├── api/               # API clients
    ├── lib/               # Utilities
    ├── hooks/             # Shared hooks
    ├── contexts/          # React contexts
    ├── config/            # Configuration
    └── types/             # TypeScript types
```

## Refactoring Steps

### Phase 1: Dashboard (✅ DONE)
- [x] Move `/src/app/dashboard/hooks` → `/src/features/metrics/model`
- [x] Move `/src/app/dashboard/components` → `/src/widgets/dashboard/ui`
- [x] Move `/src/shared/api/metricsApi.ts` → `/src/entities/metrics/api`
- [x] Create index files for clean exports
- [x] Update all imports

### Phase 2: Shared Components & Hooks
- [ ] Audit `/src/components` - move to `/src/shared/ui` or `/src/widgets`
- [ ] Audit `/src/hooks` - move to `/src/shared/hooks` or feature-specific
- [ ] Audit `/src/lib` - move to `/src/shared/lib`
- [ ] Remove empty directories

### Phase 3: Auth Feature
- [ ] Create `/src/entities/user/`
  - `api/userApi.ts` - User API
  - `model/types.ts` - User types
- [ ] Create `/src/entities/admin/`
  - `api/adminApi.ts` - Admin API
  - `model/types.ts` - Admin types
- [ ] Move `/src/shared/api/authApi.ts` → `/src/entities/user/api/authApi.ts`
- [ ] Create `/src/features/auth/`
  - `model/useAuth.ts` - Auth hooks
  - `model/useLogin.ts` - Login logic
  - `model/useLogout.ts` - Logout logic
  - `model/usePasswordReset.ts` - Password reset
- [ ] Create `/src/widgets/auth/`
  - `ui/LoginForm.tsx`
  - `ui/ForgotPasswordForm.tsx`
  - `ui/CandidateLoginForm.tsx`
- [ ] Extract logic from `/src/app/login/page.tsx`
- [ ] Extract logic from `/src/app/forgot-password/page.tsx`
- [ ] Extract logic from `/src/app/candidate_login/page.tsx`

### Phase 4: Onboarding Feature
- [ ] Create `/src/features/onboarding/`
  - `model/useOnboardingWizard.ts`
  - `model/useSetupSteps.ts`
- [ ] Create `/src/widgets/onboarding/`
  - `ui/OnboardingWizard.tsx`
  - `ui/SetupForm.tsx`
  - `ui/PreviewPanel.tsx`
- [ ] Extract logic from `/src/app/onboarding/**/*.tsx`

### Phase 5: Other Entities
- [ ] Create `/src/entities/center/`
  - `api/centerApi.ts`
  - `model/types.ts`
- [ ] Create `/src/entities/candidate/`
  - `api/candidateApi.ts`
  - `model/types.ts`
- [ ] Create `/src/entities/exam/`
  - `api/examApi.ts`
  - `model/types.ts`

### Phase 6: Clean up
- [ ] Remove all non-FSD directories
- [ ] Update all imports across the project
- [ ] Run type-check and fix errors
- [ ] Update documentation
- [ ] Test all pages

## Benefits of FSD

1. **Clear separation of concerns** - Each layer has a specific purpose
2. **Easy to navigate** - Predictable file locations
3. **Scalable** - Add features without affecting others
4. **Testable** - Each layer can be tested independently
5. **Team-friendly** - Multiple devs can work without conflicts
6. **Import control** - Upper layers can't import from lower layers

## Import Rules

```typescript
// ✅ Allowed imports (from lower to upper layers)
app/ → processes/
app/ → pages/
app/ → widgets/
app/ → features/
app/ → entities/
app/ → shared/

widgets/ → features/
widgets/ → entities/
widgets/ → shared/

features/ → entities/
features/ → shared/

entities/ → shared/

// ❌ Forbidden imports
shared/ → entities/  // ❌
features/ → widgets/  // ❌
entities/ → features/  // ❌
```

## Next Steps

1. Complete Phase 2 (shared components)
2. Complete Phase 3 (auth feature)
3. Run comprehensive tests
4. Update team documentation
