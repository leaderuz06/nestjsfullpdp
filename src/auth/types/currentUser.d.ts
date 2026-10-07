import { Role } from "../enum/role.enum"

export type CurrentUser = {
    id: number
    role: Role
}