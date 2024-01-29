export interface User {
    id: number;
    organizationId: number;
    countryId: number;
    stateId: number;
    country: string;
    state: string;
    firstName: string;
    middleName: string;
    lastName: string;
    emailId: string;
    createdBy: number;
    updateddBy: number;
    mobileNumberPrimary: string;
    description: string;
    numberOfUsers: number;
    webSite: string;
    faxNumber: string;
    skypeId: string;
    mobileNumberSecondary: string;
    phoneNumberPrimary: string;
    phoneNumberSecondary: string;
    status: string;
    salutationId: number;
    gender: string;
    dateOfBirth: string;
    street: string;
    city: string;
    stateOther: string;
    zipcode: string;
    timezoneId: string;
    signonId: string;
    signonPassword: string;
    transactionPassword: string;
    secretQuestionId: number;
    secretQuestion: string;
    isAdmin: boolean;
    isSystemAdmin: boolean;
    isActive: boolean;
    isSignonActive: boolean;
    userAddress2: string;
    salutation: string;
    userNameAndEmail:string;
    salutationName:string;
}