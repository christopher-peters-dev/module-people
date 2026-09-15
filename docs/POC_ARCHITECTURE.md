# React Native Modular Architecture POC

## 1. Purpose

This repository is the first step of a local proof of concept for a modular
React Native architecture intended for a large brownfield application.

The eventual architecture will consist of:

- A React Native assembler/application
- Three independently owned feature modules:
  - `module-people`
  - `module-jobs`
  - `module-support`
- A shared design system
- Independent CI/CD pipelines for each module
- An assembler/application CI/CD pipeline
- React Native modules distributed as packages/artifacts
- A final React Native bundle consumed by a native Android/iOS application

The POC is intentionally incremental. Do not implement the complete target
architecture in the first phase.

The purpose of this POC is to validate architectural boundaries and technical
decisions one phase at a time.

---

## 2. Core Architectural Goals

The final architecture should demonstrate:

1. Clear separation of concerns
2. Clean Architecture principles
3. Layered architecture
4. Independent feature/module ownership
5. Reusable React Native modules
6. Independent module development
7. Independent module testing
8. Shared design-system consumption
9. Dependency Injection
10. Package-based module distribution
11. Independent module CI/CD
12. Application/assembler CI/CD
13. Eventual consumption by a native Android/iOS application

---

## 3. Target Architecture

Conceptually:

```text
                    Native Android / iOS App
                              |
                              v
                       RN Assembler
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
        module-people    module-jobs     module-support
             |                |                |
             +----------------+----------------+
                              |
                              v
                       Design System
```

Each feature module is independently developed and packaged.

The RN assembler is responsible for composing the modules into the final
React Native application.

The assembler should not contain business logic belonging to a feature module.

The final native application consumes the assembled React Native application,
not the individual business modules directly.

---

## 4. Repository Strategy

The eventual system is intended to use separate repositories:

- `module-people`
- `module-jobs`
- `module-support`
- `rn-assembler`
- `design-system` if a separate repository proves appropriate

The feature modules are React Native libraries/packages, not standalone
production applications.

Each feature module should have a small development host/sandbox so that a
developer can develop and visually test the module independently.

The development host exists for local development and testing only. It is not
part of the production module API.

---

# 5. Incremental Implementation Strategy

The architecture must be implemented in phases.

## Phase 1

Prove a single independently developable React Native feature module:

- `module-people`

Phase 1 demonstrates:

- React Native library/module structure
- Independent development host
- TypeScript
- Clean Architecture layering
- People domain
- Dummy external API
- Loading state
- Success state
- Empty state
- Error state
- Repository abstraction
- API isolation
- Basic testability
- Minimal public module API

Phase 1 must NOT implement:

- Jobs
- Support
- RN assembler
- Navigation/tabs
- Design system
- Theme
- Design tokens
- DI container/framework
- npm publishing
- GitHub Actions CI/CD
- Native application integration
- Redux
- Zustand
- TanStack Query
- Authentication

Do not implement future phases unless explicitly instructed.

---

# 6. Phase 1 Module

`module-people` is a reusable React Native module.

It should expose a small public API through:

```text
src/index.ts
```

The eventual assembler should be able to consume the module through a
package-level API conceptually similar to:

```tsx
import { PeopleScreen } from '@poc/module-people';
```

Do not expose internal implementation details unnecessarily.

---

# 7. Independent Development

A developer working on `module-people` must be able to run and visually test
the feature without the future RN assembler or native application.

The module should therefore have a small development host.

Conceptually:

```text
module-people/

    src/
        presentation/
        domain/
        data/
        index.ts

    dev/
        App.tsx
```

The development host renders `PeopleScreen`.

The development host is not part of the production module API.

---

# 8. Clean Architecture

Use the conceptual dependency direction:

```text
Presentation -> Domain <- Data
```

Presentation may depend on Domain.

Data may depend on Domain abstractions.

Domain must NOT depend on:

- React Native
- HTTP/network clients
- APIs
- UI components
- Presentation
- Data implementations

The Domain layer should remain framework independent wherever practical.

The important architectural principle is dependency inversion:

```text
              DOMAIN
                 |
        +--------+--------+
        |                 |
        v                 ^
Repository contract       |
        ^                 |
        |                 |
   Repository Impl
        |
        v
   External API
```

---

# 9. Initial Module Structure

Use this as the initial conceptual structure:

```text
module-people/

    src/

        presentation/
            screens/
                PeopleScreen.tsx

        domain/
            entities/
                Person.ts

            repositories/
                PeopleRepository.ts

            usecases/
                GetPeople.ts

        data/
            api/
                PeopleApi.ts

            models/
                PersonDto.ts

            repositories/
                PeopleRepositoryImpl.ts

        index.ts

    dev/
        App.tsx

    package.json
    tsconfig.json
    README.md
```

The exact structure may evolve if there is a strong technical reason.

If a significant structural decision changes this layout, document the reason.

---

# 10. Domain Layer

The Domain layer represents the application's business concepts.

Create a `Person` domain model.

For example:

```ts
interface Person {
  id: number;
  name: string;
  email: string;
}
```

The domain model should represent the application's internal model and should
not blindly mirror an external API response.

The Domain layer must not know which API provides the data.

---

# 11. Repository Abstraction

The Domain layer defines the repository contract.

Conceptually:

```ts
interface PeopleRepository {
  getPeople(): Promise<Person[]>;
}
```

Use cases depend on this abstraction.

The Domain layer must not instantiate the concrete repository implementation.

---

# 12. Use Case

Create a `GetPeople` use case.

It depends on `PeopleRepository`.

Conceptually:

```text
GetPeople
    |
    v
PeopleRepository
    |
    v
Person[]
```

The use case must not know:

- API URL
- HTTP client
- React Native
- DTO structure
- UI implementation

---

# 13. Data Layer

The Data layer is responsible for external data sources and implementation
details.

It should contain:

- API integration
- DTOs
- API-to-domain mapping
- Repository implementation

Conceptually:

```text
External API
    |
    v
PeopleApi
    |
    v
PersonDto
    |
    v
Mapping
    |
    v
Person
    |
    v
PeopleRepositoryImpl
```

External API DTOs must not leak into the Presentation layer.

---

# 14. Dummy API

Use a public dummy API suitable for demonstrating a people/users endpoint.

The API choice should be documented in `README.md`.

The rest of the architecture must not be tightly coupled to the selected
dummy API.

The API implementation belongs under:

```text
src/data/api/
```

API URLs must not exist in the Presentation or Domain layers.

---

# 15. Presentation Layer

`PeopleScreen` is responsible for presenting the state of the People feature.

It must support:

### Loading

Display an appropriate loading indicator.

### Success

Display a list of people.

At minimum display:

- name
- email

### Empty

Display an appropriate empty state if the API returns no people.

### Error

Display an appropriate error message and a Retry action.

The Presentation layer must not make direct HTTP requests.

It must not contain API URLs.

---

# 16. State Management

Do not introduce a global state-management library in Phase 1.

Do not add:

- Redux
- Redux Toolkit
- Zustand
- MobX
- TanStack Query

Use simple local React state/effects or a small local presentation-state
abstraction.

The objective is to validate module boundaries before introducing additional
infrastructure.

---

# 17. Dependency Injection

Do not introduce a DI framework/container in Phase 1.

However, design the code so dependencies can be injected.

For example:

```ts
new GetPeople(repository)
```

This allows a later phase to introduce a DI solution such as `tsyringe`
without changing the business contract between the use case and repository.

Dependency Injection is implemented in Phase 2.

### Phase 2 DI boundary

Phase 2 uses `tsyringe` for constructor injection and a host-created
`DependencyContainer`. The feature module owns the registrations through:

```ts
registerPeopleModule(container)
```

The registration function receives a container from the executable host; it
does not register services in tsyringe's global container. The module keeps its
repository token and its Data/Domain implementation types private. Stateless
People dependencies use transient lifetimes in this POC.

The module-owned integration component is the consumer boundary:

```tsx
<PeopleFeature container={container} />
```

`PeopleFeature` resolves the internal `GetPeople` use case and passes it to
the pure `PeopleScreen`. `PeopleScreen` remains unaware of tsyringe, and the
host need not know the API client, repository implementation, repository token,
or use case. `reflect-metadata` must be initialized once by the executable host
before module code that uses decorators is loaded.

---

# 18. Testability

The repository abstraction must allow a mock/fake implementation.

For example:

```text
PeopleScreen
    |
    v
GetPeople
    |
    v
PeopleRepository
    |
    v
MockPeopleRepository
```

A mock repository must be capable of returning deterministic data without
performing a network request.

This will allow later unit/component tests to validate presentation and
business behavior independently of the external API.

---

# 19. Public API

The module must expose a minimal public API.

Use:

```text
src/index.ts
```

as the public entry point.

Do not export every internal class, implementation, DTO, API client, or helper.

Only expose things that consumers of the module genuinely need.

---

# 20. Architecture Rules

The following rules must be respected:

1. Presentation cannot directly call the external API.
2. Presentation should depend on Domain abstractions rather than Data
   implementations wherever practical.
3. Domain cannot import React Native.
4. Domain cannot import HTTP/network libraries.
5. Domain cannot depend on concrete Data implementations.
6. External API DTOs cannot be used directly by Presentation.
7. API URLs must remain inside the Data layer.
8. Business logic should live in Domain/use cases rather than UI components.
9. The module must expose a minimal public API.
10. The development host must not leak into the production module API.
11. Avoid adding dependencies unless they solve a demonstrated requirement.
12. Do not implement future phases prematurely.

---

# 21. Phase 1 CI/CD Boundary

CI/CD is intentionally deferred from the implementation of Phase 1.

The eventual module CI pipeline is expected to validate:

```text
Pull Request
    |
    v
GitHub Actions
    |
    +-- install dependencies
    +-- typecheck
    +-- lint
    +-- unit tests
    +-- build
    |
    v
PR validation
```

The eventual module CD pipeline is expected to publish a versioned package:

```text
Git tag
    |
    v
GitHub Actions
    |
    +-- install
    +-- typecheck
    +-- tests
    +-- build
    +-- package
    +-- publish
    |
    v
Package Registry
    |
    v
@poc/module-people@version
```

The assembler/application will have its own separate CI/CD pipeline.

The module should not build an APK/IPA as its CD artifact.

---

# 22. Future Phases

The intended progression is:

## Phase 1
People module + Clean Architecture

## Phase 2
Dependency Injection

## Phase 3
Shared Design System:
- Theme
- Tokens
- Shared UI components

The design system may become a separately owned shared package after the POC
establishes the need for it.

## Phase 4
`module-jobs`

## Phase 5
`module-support`

## Phase 6
RN assembler:
- Tab navigation
- Module composition

## Phase 7
Local package consumption

## Phase 8
Independent Git repositories

## Phase 9
GitHub Actions CI

## Phase 10
Package publishing/CD

## Phase 11
Native Android/iOS consumption

A shared native Turbo Module package is a future native-platform concern. It
is not part of the current feature-module POC.

## Phase 12
Complete end-to-end CI/CD

Do not skip ahead unless explicitly instructed.

React Native Web is outside the scope of this native Android/iOS POC.

---

# 23. Engineering Principles

Prefer:

- TypeScript
- small interfaces
- dependency inversion
- explicit boundaries
- composition over inheritance
- testability
- minimal dependencies
- simple solutions
- incremental architecture

Avoid:

- premature abstractions
- unnecessary frameworks
- global state without a demonstrated requirement
- enterprise patterns added only for appearance
- speculative infrastructure
- unnecessary shared code
- tightly coupling modules to the assembler

Every dependency should have a clear reason.

---

# 24. Decision Making

When an architectural decision is not explicitly specified:

1. Prefer the simplest solution that preserves the intended boundaries.
2. Do not introduce infrastructure for future requirements prematurely.
3. Document significant architectural decisions.
4. Do not silently implement future phases.
5. If a decision materially affects the target architecture, ask before
   implementing it.
6. Prefer current, well-supported React Native tooling rather than inventing
   custom build infrastructure.

---

# 25. Phase 1 Completion Criteria

Phase 1 is complete only when:

- [ ] `module-people` runs independently
- [ ] Development host works
- [ ] People data loads from a dummy API
- [ ] Loading state works
- [ ] Success state works
- [ ] Empty state works
- [ ] Error state works
- [ ] Retry works
- [ ] Presentation is separated from Domain
- [ ] Domain is separated from Data
- [ ] Repository abstraction exists
- [ ] API implementation exists
- [ ] API DTO is mapped to a Domain model
- [ ] Domain contains no React Native dependencies
- [ ] Repository can be replaced with a mock/fake
- [ ] Module has a minimal public API
- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] README documents development and architecture

Do not proceed to Phase 2 until these criteria are satisfied.
