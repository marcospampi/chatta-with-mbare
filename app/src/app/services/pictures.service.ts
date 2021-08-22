import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PicturesService {
  $: Observable<Array<string>>;
  pictures$: Observable<Array<string>>;
  constructor( private http: HttpClient ) {
    this.$ = this.pictures$ = http.get<Array<string>>(`/api/pictures`).pipe(
      shareReplay(1)
    );
    this.$.subscribe( );
  }
}

@Injectable()
export class Pictures extends Observable<Array<string>> {}