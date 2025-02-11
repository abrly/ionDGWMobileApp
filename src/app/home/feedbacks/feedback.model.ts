export class Feedback {
    constructor(
        public TrxID: number,
        public ServiceID: number,
        public FeedbackTypeID: number,
        public FeedbackDescription: string,
        public AttachmentPath: string,
        public CreatedBy: string,
        public CreatedOn: Date,
        public UpdatedOn: Date
        ) { }
}