import { User } from "@decl/user.type";
import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";



export const entityAdapter = createEntityAdapter<User>({
    selectId: (user: User) => user.uuid,
    sortComparer: ( a: User, b: User ) => a.username.localeCompare(b.username)
})
export interface UserListState extends EntityState<User> {

}

export const initialState = entityAdapter.getInitialState();

const featureSelector = createFeatureSelector<UserListState>('usersList');

const _selectors = entityAdapter.getSelectors();

export const selectors = {
    selectAll: createSelector( featureSelector, _selectors.selectAll ),
    selectCount: createSelector( featureSelector, _selectors.selectTotal ),
    selectOne: (uuid: string) =>  createSelector( featureSelector, s => s.entities[uuid])
}