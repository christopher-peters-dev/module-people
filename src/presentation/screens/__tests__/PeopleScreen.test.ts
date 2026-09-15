import { describe, expect, it, jest } from '@jest/globals';
import type { PeopleRepository } from '../../../domain/repositories/PeopleRepository';
import { GetPeople } from '../../../domain/usecases/GetPeople';
import { PeopleScreen } from '../PeopleScreen';

const React = require('react');
const { act, create } = require('react-test-renderer');

function createGetPeople(repository: PeopleRepository): GetPeople {
  return new GetPeople(repository);
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

async function renderPeopleScreen(getPeople: GetPeople) {
  let renderer: ReturnType<typeof create>;

  await act(async () => {
    renderer = create(React.createElement(PeopleScreen, { getPeople }));
  });

  return renderer!;
}

describe('PeopleScreen', () => {
  it('displays a loading indicator while people are loading', async () => {
    const deferredPeople = createDeferred<[]>();
    const getPeople = createGetPeople({
      getPeople: jest.fn(() => deferredPeople.promise),
    });

    const renderer = await renderPeopleScreen(getPeople);

    expect(
      renderer.root.findByProps({ accessibilityLabel: 'Loading people' })
    ).toBeDefined();
  });

  it('displays each person name and email after loading', async () => {
    const getPeople = createGetPeople({
      getPeople: jest.fn(async () => [
        { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
      ]),
    });

    const renderer = await renderPeopleScreen(getPeople);

    expect(
      renderer.root.findByProps({ children: 'Ada Lovelace' })
    ).toBeDefined();
    expect(
      renderer.root.findByProps({ children: 'ada@example.com' })
    ).toBeDefined();
  });

  it('displays an empty state when no people are returned', async () => {
    const getPeople = createGetPeople({
      getPeople: jest.fn(async () => []),
    });

    const renderer = await renderPeopleScreen(getPeople);

    expect(
      renderer.root.findByProps({ children: 'No people found.' })
    ).toBeDefined();
  });

  it('displays an error message when loading fails', async () => {
    const getPeople = createGetPeople({
      getPeople: jest.fn(async () => {
        throw new Error('Request failed');
      }),
    });

    const renderer = await renderPeopleScreen(getPeople);

    expect(
      renderer.root.findByProps({
        children: 'Unable to load people. Please try again.',
      })
    ).toBeDefined();
  });

  it('retries loading and returns to the loading state while the retry is pending', async () => {
    const deferredPeople = createDeferred<[]>();
    const repository: PeopleRepository = {
      getPeople: async () => [],
    };
    const getPeopleSpy = jest
      .spyOn(repository, 'getPeople')
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockImplementationOnce(() => deferredPeople.promise);
    const getPeople = createGetPeople(repository);
    const renderer = await renderPeopleScreen(getPeople);

    await act(async () => {
      renderer.root.findByProps({ title: 'Retry' }).props.onPress();
    });

    expect(getPeopleSpy).toHaveBeenCalledTimes(2);
    expect(
      renderer.root.findByProps({ accessibilityLabel: 'Loading people' })
    ).toBeDefined();
  });
});
