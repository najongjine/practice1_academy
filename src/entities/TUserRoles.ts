import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TUser } from "./TUser";

@Index("t_user_roles_pkey", ["idp"], { unique: true })
@Entity("t_user_roles", { schema: "public" })
export class TUserRoles {
  @PrimaryGeneratedColumn({ type: "integer", name: "idp" })
  idp: number;

  @Column("character varying", { name: "role_name", length: 50 })
  roleName: string;

  @Column("timestamp with time zone", {
    name: "assigned_at",
    nullable: true,
    default: () => "now()",
  })
  assignedAt: Date | null;

  @ManyToOne(() => TUser, (tUser) => tUser.tUserRoles, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_idp", referencedColumnName: "idp" }])
  userIdp: TUser;
}
