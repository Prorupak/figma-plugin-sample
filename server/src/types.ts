export type TTokenResponseData = {
  user_id: number;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type TPollDataResponse = {
  [key: string]: string;
};

export type TPKCEVerifierResponse = { code_verifier: string };

export type TUser = {
  id: string;
  email: string;
  handle: string;
};

export type TCheckSessionResponse = TUser & {
  expiresAt: number;
  token: string;
  writeKey: string;
};

export type TFirebaseUsersResponse = {
  [userId: string]: TCheckSessionResponse;
};

export type TUserDataResponse = TUser & { img_url: string };

export type TFirebaseKeysResponse = {
  [key: string]: {
    readKey: string;
  };
};
