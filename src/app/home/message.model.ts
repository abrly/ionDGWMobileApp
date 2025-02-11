export class Message {
    constructor(
      public MessageEn: string,
      public MessageAr: string,
    ) {}
  
    get messageEn() {
      return this.MessageEn;
    }

    get messageAr() {
      return this.MessageAr;
    }

  }
  