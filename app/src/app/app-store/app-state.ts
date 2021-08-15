import { User } from "@decl/user.type";
import { UIState } from "./ui";

export interface AppState {
    ui: UIState;
    user: User;
    usersList: Array<User>
}