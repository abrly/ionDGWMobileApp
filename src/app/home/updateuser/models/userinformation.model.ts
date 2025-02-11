export class UserInformation {
    constructor(
        public TrxID: number,
        public UserMobileNo: string,
        public UserID: string,
        public MobilePrefix: string,
        public MobilePostfix: string,
        public FirstName: string,
        public LastName: string,
        public UserTypeID: number,
        public UserTypeDescription: string,
        public UserTypeDescriptionAr: string,
        public OperatorCode: string,
        public DepartmentCode: string,
        public FleetSystemStoredContactNumber: string,
        public EmailAddress: string,
        public PreferredLanguageID: number,
        public PreferredLanguageName: string,
        public PreferredLanguageNameAr: string,
        public CreatedOn: Date,
        public UpdatedOn: Date
    ) { }
}