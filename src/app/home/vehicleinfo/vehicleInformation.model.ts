export class VehicleInformation {
    constructor(
        public Name: string,
        public Year: string,
        public Color: string,
        public PlateNo: string,
        public RegistrationDate: string,
        public RegistrationExpiryDate: string,
        public ChassisNo: string,
        public EngineNo: string,
        public LastMeterReading: string,
        public InsuranceNo: string,
        public OwnerName: string,
        public OperatorName: string,
        public ServiceCost: number ,
        public WorkOrderDocUrl:string     
        ) { }
}