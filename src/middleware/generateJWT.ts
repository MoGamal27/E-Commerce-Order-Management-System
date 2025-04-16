import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

interface JwtPayload {
  [key: string]: any;
}

const generateToken = async (payload: JwtPayload): Promise<string> => {
  const token = await jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: '3d' }
  );

  return token;
};

export default generateToken;
