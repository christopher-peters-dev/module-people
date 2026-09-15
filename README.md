# module-people

`module-people` is a React Native library/package that provides the People
feature for the modular architecture POC. Phases 1 and 2 prove one
independently developable feature module and module-owned dependency injection
before an assembler, shared design system, or package publishing is introduced.

## Architecture

The module follows the dependency direction:

```text
Presentation -> Domain <- Data
```

- `presentation/` contains `PeopleScreen` and local UI state.
- `domain/` contains `Person`, `PeopleRepository`, and `GetPeople`.
- `data/` contains the DummyJSON API client, DTO, and repository
  implementation.

The current data source is the [DummyJSON Users endpoint](https://dummyjson.com/users).
`PeopleRepositoryImpl` maps its user DTOs into the module's `Person` domain
model.

Phase 2 adds constructor injection with tsyringe without changing the feature
layering. The host creates a container, the module registers its own graph, and
the public feature component resolves the internal use case:

```text
Host container -> registerPeopleModule -> PeopleFeature -> PeopleScreen
                                    |
                                    v
                    PeopleApi -> PeopleRepositoryImpl -> GetPeople
```

`PeopleScreen` remains a pure presentation component: it receives `GetPeople`
as a prop and does not know about tsyringe, HTTP, DummyJSON, or Data-layer
classes. `reflect-metadata` is initialized once by the executable host before
the module's decorated classes are loaded.

## Development host

The `example/` React Native app is a local development host, not part of the
production module API. It is the current composition root:

```text
createChildContainer -> registerPeopleModule -> PeopleFeature
```

It demonstrates the same consumer boundary planned for a future RN assembler,
without exposing or resolving the module's internal Data and Domain classes.

## Setup and validation

Install dependencies from the repository root:

```sh
yarn install
```

Run validation:

```sh
yarn typecheck
yarn lint
yarn test
yarn prepare
```

## Run the Android example

With an Android emulator or device available, run:

```sh
yarn workspace module-people-scaffold-example android
```

This starts the generated Android host and renders the People feature. iOS is
not supported from a Windows development environment.

## Public API

The package-level public API exposes only:

```ts
registerPeopleModule(container);
<PeopleFeature container={container} />;
```

`PeopleScreen`, `GetPeople`, API clients, DTOs, repository implementations,
and DI tokens remain private to the module.

## Deferred work

The RN assembler, Jobs and Support modules, a shared design-system package,
shared native Turbo Module package, package publishing, and CI/CD are future
work. React Native Web is outside the scope of this native Android/iOS POC.

## License

MIT
