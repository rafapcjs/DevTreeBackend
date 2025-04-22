import { IUser, UserDto } from "../models/User";

export const toUserDto = (user: IUser): UserDto => {
    return {
      _id: user._id.toString(),
      handle: user.handle,
      name: user.name,
      email: user.email,
      description: user.description
    };
  };
  