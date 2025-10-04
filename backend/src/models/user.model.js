import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      length: 50,
      unique: true,
    },
    email: {
      type: "varchar",
      length: 120,
      unique: true,
    },
    password_hash: {
      type: "varchar",
      length: 255,
    },
    role: {
      type: "varchar",
      length: 20,
      default: "user",
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
});

export { User };
