export class User {
    constructor(
      public UserID: string,
      public fullName: string,
      private userToken: string,
      private userlanguage: string,
      private deptNo: string
    ) {}
  
    get token() {
      return this.userToken;
    }

    get preferredlang() {
      return this.userlanguage;
    }

    get Name() {
      return this.fullName;
    }

    get DeptNo() {
      return this.deptNo;
    }

  }
  