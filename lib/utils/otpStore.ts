type OTPData = {
  hashedOTP: string;
  name: string;
  password: string;
  role: "BUYER" | "SELLER";
  expiresAt?: number;
};

const otpStore = new Map<string, OTPData>();

export const setOTP = (email: string, data: OTPData) => {
  otpStore.set(email, { ...data });
};

export const getOTP = (email: string): OTPData | undefined => {
  return otpStore.get(email);
};

export const deleteOTP = (email: string) => {
  otpStore.delete(email);
};
