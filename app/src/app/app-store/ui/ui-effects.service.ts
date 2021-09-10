import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { AppState } from '../app-state';
import { actions } from './actions';
import { combineLatest, fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { catchError, filter, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { ResponsivenessState } from './ui-state';

@Injectable()
export class UiEffectsService implements OnDestroy {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private ngzone: NgZone
  ) { 
  }
  ngOnDestroy(): void {
    this.events$.unsubscribe();
  }

  private getEvents(): Observable<ResponsivenessState> {
    const nospacesplz = ( s: string ) => s.replace(/\s*/g, '');
    const breakpoints = {
      xs: getComputedStyle(document.documentElement).getPropertyValue(`--constant-breakpoint-xs`),
      sm: getComputedStyle(document.documentElement).getPropertyValue(`--constant-breakpoint-sm`),
      md: getComputedStyle(document.documentElement).getPropertyValue(`--constant-breakpoint-md`),
      lg: getComputedStyle(document.documentElement).getPropertyValue(`--constant-breakpoint-lg`),
      xl: getComputedStyle(document.documentElement).getPropertyValue(`--constant-breakpoint-xl`),
      xxl: getComputedStyle(document.documentElement).getPropertyValue(`--constant-breakpoint-xxl`)
    }
    
    const reverseMatcher: {[key: string]: ResponsivenessState} = {
      [nospacesplz(`(min-width:${breakpoints.xs})`)]: 'xs',
      [nospacesplz(`(min-width:${breakpoints.sm})`)]: 'sm',
      [nospacesplz(`(min-width:${breakpoints.md})`)]: 'md',
      [nospacesplz(`(min-width:${breakpoints.lg})`)]: 'lg',
      [nospacesplz(`(min-width:${breakpoints.xl})`)]: 'xl',
      [nospacesplz(`(min-width:${breakpoints.xxl})`)]: 'xxl'
    }
    
    const matchers = {
      xs: matchMedia(`(min-width: ${breakpoints.xs})`),
      sm: matchMedia(`(min-width: ${breakpoints.sm})`),
      md: matchMedia(`(min-width: ${breakpoints.md})`),
      lg: matchMedia(`(min-width: ${breakpoints.lg})`),
      xl: matchMedia(`(min-width: ${breakpoints.xl})`),
      xxl: matchMedia(`(min-width: ${breakpoints.xxl})`)
    }

    //const firstEmission = Object.entries( matchers ).reverse().find( e => e[1].matches == true ) ?? 'xs';

    const observables = [
      fromEvent<MediaQueryListEvent>(matchers.xs,'change' ).pipe(
        startWith( matchers.xs )
      ) ,
      fromEvent<MediaQueryListEvent>(matchers.sm,'change' ).pipe(
        startWith( matchers.sm )
      ) ,
      fromEvent<MediaQueryListEvent>(matchers.md,'change' ).pipe(
        startWith( matchers.md )
      ) ,
      fromEvent<MediaQueryListEvent>(matchers.lg,'change' ).pipe(
        startWith( matchers.lg )
      ) ,
      fromEvent<MediaQueryListEvent>(matchers.xl,'change' ).pipe(
        startWith( matchers.xl )
      ) ,
      fromEvent<MediaQueryListEvent>(matchers.xxl,'change').pipe(
        startWith( matchers.xxl)
      )
    ];
    
    return combineLatest(observables).pipe(
      map( e => {
        const array: [ResponsivenessState, boolean][] = e.filter( e => e.matches).map(e => [reverseMatcher[nospacesplz(e.media)], e.matches ]);

        const latest = array.pop();
        if ( latest ) {
          return latest[0] ?? 'xs';
        }
        return 'xs';
      })
    )

  }

  events$ = this.getEvents().subscribe({
    next: ( value ) => this.store.dispatch(actions.responsivenessChange({value}))
  })
}
