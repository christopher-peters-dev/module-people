import type { PersonDto } from '../models/PersonDto';

const PEOPLE_API_URL = 'https://dummyjson.com/users';

interface PeopleResponseDto {
  users: PersonDto[];
}

export class PeopleApi {
  async getPeople(): Promise<PersonDto[]> {
    const response = await fetch(PEOPLE_API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch people: ${response.status}`);
    }

    const data = (await response.json()) as PeopleResponseDto;

    return data.users;
  }
}
