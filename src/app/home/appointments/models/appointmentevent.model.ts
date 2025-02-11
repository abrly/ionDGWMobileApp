export class AppointmentEvent {
    constructor(
        public StartDateTime: Date,
        public EndDateTime: Date,
        public Title: string,
        public Description: string, 
    ) { }
}