
import { PrismaClient } from '@prisma/client';
// import { DataSource } from "typeorm";
// import { Product }  from "../entities/Product";

// export const AppDataSource = new DataSource({
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: "postgres",
//     password: "root",
//     database: "ecommerce",
//     synchronize: true,
//     logging: true,
//     entities: [Product],
// });


const AppDataSource = new PrismaClient();
export default AppDataSource;
