import { Message } from "@decl/message.type";
import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";



export const entityAdapter = createEntityAdapter<Message>({
    selectId: (user: Message) => user.uuid,
    sortComparer: ( a: Message, b: Message ) => a.localDate - b.localDate
})
export interface ChatState extends EntityState<Message> {
    chat: [string,string];
    size: number;
    offset: number;
    end: boolean;
}

export const initialState = entityAdapter.getInitialState({
    chat: [ undefined, undefined ],
    size: undefined,
    offset: undefined,
    end: false
});

const featureSelector = createFeatureSelector<ChatState>('chat');

const _selectors = entityAdapter.getSelectors();

export const selectors = {
    selectAll: createSelector( featureSelector, _selectors.selectAll ),
    selectCount: createSelector( featureSelector, _selectors.selectTotal ),
    selectState: createSelector( featureSelector, ({chat, size, offset, end}) => ({chat, size, offset, end}))
}