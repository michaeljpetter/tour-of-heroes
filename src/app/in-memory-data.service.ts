import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { add, flow, map, max } from 'lodash/fp';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    return {
      heroes: [
        { id: 12, name: 'Dr. Nice', tagline: 'He\'s nice, until you make him mad.' },
        { id: 13, name: 'Bombasto', tagline: 'Definitely not related to Shaggy.' },
        { id: 14, name: 'Celeritas', tagline: 'Part man, part celery, all badass.' },
        { id: 15, name: 'Magneta', tagline: 'A personality as magnetic as his powers.' },
        { id: 16, name: 'RubberMan', tagline: 'Not to be used as a prophylactic.' },
        { id: 17, name: 'Dynama', tagline: 'Not endorsed by or affiliated with L. Ron Hubbard.' },
        { id: 18, name: 'Dr. IQ', tagline: 'Pronounced "eye-cue", not "ick".' },
        { id: 19, name: 'Magma' },
        { id: 20, name: 'Tornado', tagline: 'Sorry, we ran out of original names.' }
      ]
    }
  }

  genId = flow(map('id'), max, add(1));
}
