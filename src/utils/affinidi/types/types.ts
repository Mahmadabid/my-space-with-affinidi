export type ErrorResponse = {
  code: string;
  message?: string;
  issues?: { message: string }[];
};

export type UserInfo = {
  email?: string;
  familyName?: string;
  givenName?: string;
  middleName?: string;
  picture?: string;
  country?: string;
  nickname?: string;
  phoneNumber?: string;
  gender?: string;
  birthdate?: string;
  livenessCheckPassed?: string;
  postalCode?: string;
  locality?: string;
  formatted?: string;
};
