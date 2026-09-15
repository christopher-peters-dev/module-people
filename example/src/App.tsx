import { container } from 'tsyringe';
import { PeopleFeature, registerPeopleModule } from '../../src';

const peopleContainer = container.createChildContainer();

registerPeopleModule(peopleContainer);

export default function App() {
  return <PeopleFeature container={peopleContainer} />;
}
