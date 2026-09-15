# module-people

`module-people` is a React Native library/package that provides the People
feature for the modular architecture POC. Phase 1 proves one independently
developable feature module before an assembler, shared design system, or
package publishing is introduced.

## Phase 1 architecture

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

## Development host

The `example/` React Native app is a local development host, not part of the
production module API. It is the Phase 1 composition root:

```text
PeopleApi -> PeopleRepositoryImpl -> GetPeople -> PeopleScreen
```

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

The current package-level public API exposes `PeopleScreen` only. API clients,
DTOs, repository implementations, and other Domain/Data internals remain
private to the module.

## Deferred work

Dependency injection, the RN assembler, Jobs and Support modules, a shared
design system, package publishing, and CI/CD are future phases. They are not
part of this Phase 1 POC.

## License

MIT
