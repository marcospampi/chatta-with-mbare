export type CallFeatureState = {

    my_peerid?: string;
    pal_userid?: string;
    pal_peerid?: string;
    inCall: boolean;

    iam?: 'caller'|'callee';
    closedBy?: 'caller'|'callee';
}

export const initialState: CallFeatureState = {
    iam: null,
    my_peerid: null,
    pal_userid: null,
    pal_peerid: null,
    inCall: false
}