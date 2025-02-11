export class JobCard {
    constructor(
        public TrxID: number,
        public WorkOrderID: string,
        public WorkOrderLocation: string,
        public WorkOrderYear: number,
        public EquipmentNo: string,
        public EquipmentDescription: string,
        public EquipmentYear: string,
        public WorkOrderStatusID: number,
        public WorkOrderStatus: string,
        public WorkOrderStatusAr: string,
        public CreatedOn: Date,
        public UpdatedOn: Date,
        public EQLicense: string,
        public RepairReason: string,
        public RepairReasonAr: string,
        public ReportURL: string,
        public TotalRecsCount: number
        ) { }
}