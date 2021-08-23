import { User } from "@decl/user.type";
import { CallFeatureState } from "./call";
import { ChatState } from "./chat";
import { UIState } from "./ui";
import { UserListState } from "./users-list";

export interface AppState {
    ui: UIState;
    user: User;
    usersList: UserListState;
    chat: ChatState;
    call: CallFeatureState;
}