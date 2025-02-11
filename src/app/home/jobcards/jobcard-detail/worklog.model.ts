export class WorkLog {
    constructor(
        public IncidentSNo: number,
        public IncidentDateTime: Date,
        public Jobcardnumber: string,
        public RepairSiteID: number,
        public RepairSiteName: string,
      ) { }
}