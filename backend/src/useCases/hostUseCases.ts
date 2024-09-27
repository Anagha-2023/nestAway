import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/serverconfig';
import { findHostByEmail, createHost } from '../repositories/hostRepository';
import { otpService } from '../services/otpService';
import Otp from '../entities/Otp';
import Host from '../entities/Host';

// Use case to register host with OTP validation
export const loginHostUseCase = async (email: string, password: string): Promise<string | null> => {
  const host = await findHostByEmail(email);
  if (!host || !host.password || !(await bcrypt.compare(password, host.password))) {
    return null;
  }

  const token = jwt.sign({ id: host._id }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Use case to register host with OTP validation
export const registerHostUseCase = async (hostData: { email: string; password: string; name: string }) => {
  const { email, password, name } = hostData;

  const existingHost = await findHostByEmail(email);
  if (existingHost) {
    throw new Error('Host already registered');
  }

  const otp = await otpService.sendOtp(email);
  return { email, otp };
};

// Verifying OTP and completing host registration
export const verifyOtpAndRegisterHostUseCase = async (email: string, otp: string, name: string, password: string) => {
  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw new Error('Invalid or expired OTP');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const host = new Host({ name, email, password: hashedPassword, verified: true });
  await host.save();

  await Otp.deleteOne({ _id: otpRecord._id });
  return host;
};

// Resend OTP to the host
export const resendOtpUseCase = async (email: string) => {
  await Otp.deleteMany({ email });
  const otpCode = await otpService.sendOtp(email);
  return otpCode;
};

// Google sign-in use case
export const googleSignInUseCase = async (email: string, name: string, googleId: string) => {
  let host = await Host.findOne({ email });
  if (host) {
    const token = jwt.sign({ id: host._id }, JWT_SECRET, { expiresIn: '1h' });
    return { token, host };
  }

  host = new Host({ name, email, googleId, verified: true });
  await host.save();
  const token = jwt.sign({ id: host._id }, JWT_SECRET, { expiresIn: '1h' });
  return { token, host };
};
