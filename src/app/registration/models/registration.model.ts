export class Registration {
    constructor(
        public ConfirmationTrxID: number,
        public FirstName: string,
        public LastName: string,
        public UserID: string,
        public Password: string,
        public EmailAddress: string,
        public PreferredLanguageID: number,
        public UserMobileNo: string
        ) { }
}