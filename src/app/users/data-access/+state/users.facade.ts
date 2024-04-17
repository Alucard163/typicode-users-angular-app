import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import * as UsersAction from "./users.action"
import { User } from "../../interfaces/user.interface";
import * as selectUsers  from "./users.selectors";

@Injectable({
  providedIn: 'root'
})
export class UsersListFacade {
  private readonly store = inject(Store)
  public readonly users$ = this.store.select(selectUsers.selectUsers);

  getUsers(){
    this.store.dispatch(UsersAction.getUsers());
  }
  setUsers(users: User[]){
    this.store.dispatch(UsersAction.setUsers({ users }));
  }
  deleteUser(id:number){
    this.store.dispatch(UsersAction.deleteUsers({ userId: id }));
  }
  createUser(newUser: User){
    this.store.dispatch(UsersAction.createUsers({user: newUser }));
  }
  editUser(editUser: User, id: number){
    this.store.dispatch(UsersAction.editUsers({ editUser:editUser, id }));
  }
}
