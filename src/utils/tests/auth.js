import jwt from "jsonwebtoken";
import config from '../../config';

const { jwtSecret } = config;

export const signAsDoctor = (crm, options) => jwt.sign({ crm }, jwtSecret, options)
export const signAsPatient = (cpf, options) => jwt.sign({ cpf }, jwtSecret, options)