import { Injectable  } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CallService } from './call.service';
import { CallManager } from './classes';

@Injectable()
export class ResolveCallManagerService implements Resolve<CallManager>{

  constructor(
    private callService: CallService
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CallManager | Observable<CallManager> | Promise<CallManager> {
    return this.callService.getCallManager$;
  }
}
