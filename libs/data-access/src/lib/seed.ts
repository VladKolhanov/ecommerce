import { dbClient } from "./client"
import { userTable } from "./schemas/auth"

async function main() {
  await dbClient.insert(userTable).values({
    email: "admin@gmail.com",
    id: "e0ab5d74-1efa-44ec-8f35-c86d85a2c4cd",
    password:
      "$argon2id$v=19$m=65536,t=3,p=4$7QGqQJEJWhV/oXFj5pkYMA$W55p1sIIi092u6eIPrMQ1kPB7IJBl+hZUl14UuwBLWU",
    role: "admin",
  })
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("\nSeeding complete")
    process.exit(0)
  })
  .catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
