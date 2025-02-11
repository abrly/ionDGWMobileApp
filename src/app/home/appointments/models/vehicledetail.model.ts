export class VehicleDetail {
    constructor(
        public EquipmentID: string,
        public DriverName: string,
        public DriverMobileNo: string,
        public DriverEmailAddress: string,
        public VehicleManufacturer: string,
        public VehicleModel: string,
        public VehicleYear: string,
        public VehicleType: string,
        public MeterReading: string
    ) { }
}