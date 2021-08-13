import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

//#region model
export interface User {
  id: number;
  name: string;
  city: string;
}
export interface WDict {
  propertyName: string;
  startIndex: number;
  endIndex:number;
  value: string;
}
//#endregion model
//#region Actions

export class AddUser {
  static readonly type = '[User] Add';

  constructor(public payload: User) {}
}

export class UpdateUser {
  static readonly type = '[User] Update';

  constructor(public payload: User, public id: number) {}
}

export class DeleteUser {
  static readonly type = '[User] Delete';

  constructor(public id: number) {}
}

export class SetSelectedUser {
  static readonly type = '[User] Set';

  constructor(public payload: User) {}
}
//#endregion Actions

//#region state
export class UserStateModel {
  Users: User[];
  selectedUser: User;
}

@State<UserStateModel>({
  name: 'Users',
  defaults: {
    Users: [],
    selectedUser: null
  }
})
@Injectable()
export class UserState {
  constructor() {}

  @Selector()
  static getUserList(state: UserStateModel) {
    return state.Users;
  }

  @Selector()
  static getSelectedUser(state: UserStateModel) {
    return state.selectedUser;
  }

  @Action(AddUser)
  addUser(
    { getState, patchState }: StateContext<UserStateModel>,
    { payload }: AddUser
  ) {
    const state = getState();
    const UserList = [...state.Users];
    payload.id = UserList.length + 1;
    patchState({
      Users: [...state.Users, payload]
    });
    return;
  }

  @Action(UpdateUser)
  updateUser(
    { getState, setState }: StateContext<UserStateModel>,
    { payload, id }: UpdateUser
  ) {
    const state = getState();
    const UserList = [...state.Users];
    const UserIndex = UserList.findIndex(item => item.id === id);
    UserList[UserIndex] = payload;
    setState({
      ...state,
      Users: UserList
    });
    return;
  }

  @Action(DeleteUser)
  deleteUser(
    { getState, setState }: StateContext<UserStateModel>,
    { id }: DeleteUser
  ) {
    const state = getState();
    const filteredArray = state.Users.filter(item => item.id !== id);
    setState({
      ...state,
      Users: filteredArray
    });
    return;
  }

  @Action(SetSelectedUser)
  setSelectedUserId(
    { getState, setState }: StateContext<UserStateModel>,
    { payload }: SetSelectedUser
  ) {
    const state = getState();
    setState({
      ...state,
      selectedUser: payload
    });
    return;
  }
}
//#endregion state
