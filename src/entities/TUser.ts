import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TUserRoles } from "./TUserRoles";

@Index("t_user_pkey", ["idp"], { unique: true })
@Entity("t_user", { schema: "public" })
export class TUser {
  @PrimaryGeneratedColumn({ type: "integer", name: "idp" })
  idp: number;

  @Column("character varying", { name: "username", length: 50 })
  username: string;

  @Column("character varying", { name: "email", length: 100 })
  email: string;

  @Column("character varying", { name: "password", length: 255 })
  password: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @OneToMany(() => TUserRoles, (tUserRoles) => tUserRoles.userIdp)
  tUserRoles: TUserRoles[];
}
