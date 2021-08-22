import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CallModule } from '../call.module';
import { LocalUserStreamManager, StreamManager } from './classes/streamManager';

@Injectable({
  providedIn: CallModule
})
export class CallService {
  constructor() {

  }

}
