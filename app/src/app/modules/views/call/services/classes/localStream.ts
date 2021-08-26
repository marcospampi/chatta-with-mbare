import Peer from "peerjs";
import { BehaviorSubject, Observable, Subject } from "rxjs";

type LocalStreamState = {
    video: StreamState;
    audio: StreamState;
    screen: StreamState;
}
type StreamState = { type: keyof LocalStreamState, state: boolean, stream?: MediaStream };


export class LocalStream {
    constructor(
        private peer: Peer,

    ) { }
    
}