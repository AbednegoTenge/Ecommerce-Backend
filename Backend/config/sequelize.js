import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.AURORA_DB,
    process.env.AURORA_USER,
    process.env.AURORA_PASSWORD,
    {
        host: process.env.AURORA_HOST,
        dialect: 'mysql',
        logging: false
    }
);

export default sequelize;