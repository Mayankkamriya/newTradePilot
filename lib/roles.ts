// export function allowRoles(
//   user: { role: string },
//   ...roles: string[]
// ) {
//   if (!roles.includes(user.role)) {
//     throw new Error("Access Denied");
//   }
// }
type User = {
  role: string;
};

export const allowRoles = (user: User, roles: string[]) => {
  if (!roles.includes(user.role)) {
    throw new Error("Access Denied");
  }
};
