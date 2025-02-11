import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter , switchMap } from 'rxjs/operators';
import { JobcardService } from '../jobcard.service';
import { JobCard } from '../jobcard.model';
import { WorkLog } from './worklog.model';
import { ActivatedRoute } from '@angular/router';
import { WorklogService } from './worklog.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

/*import { Plugins } from '@capacitor/core';

const { Browser  } = Plugins;  */

import { Browser } from '@capacitor/browser';
import { StatusLog } from './statuslog.model';

@Component({
  selector: 'app-jobcard-detail',
  templateUrl: './jobcard-detail.page.html',
  styleUrls: ['./jobcard-detail.page.scss'],
})
export class JobcardDetailPage implements OnInit, OnDestroy {

  paramUserToken: string;
  paramWorkorderid: string;
  paramEquipmentNo: string;

  lang: string;
  jobcard: JobCard;
  worklogs: WorkLog[];
  heading1: string;
  workorderID: string;
  equipmentNo: string;
  JobCreated: string;
  UpdatedOn: string;
  Status: string;
  WorkLogs: string;
  MoreDetailText: string;
  StatusLogsText: string;
  statusStyleName: string;
  jobType:string;
  jobcardReportURLCap:string;
  jobcardReportURL:string;
  bShowActivity:boolean;

  statuslogs: StatusLog[];

  private jcsSub: Subscription;
  private subAppLang: Subscription;




  

  constructor(private jobcardService: JobcardService, private authService: AuthService,
              private translate: TranslateService, private activatedRoute: ActivatedRoute, private worklogService: WorklogService) { }

  ngOnInit() {


    this.bShowActivity=false;

    this.jcsSub = this.activatedRoute.params
                   .pipe(
                    filter(response => !!response),
                    switchMap(response => {
                    this.paramUserToken = response.userToken;
                    this.paramWorkorderid = response.workorderid;
                    this.paramEquipmentNo = response.equipmentNo;
                    return this.jobcardService.GetJobCard(this.paramUserToken, this.paramWorkorderid, this.paramEquipmentNo);
                    }),
                    filter(response => !!response),
                    switchMap(response => {
                      this.jobcard = response;

                      //console.log('what i get jobcard info');
                      //console.log(this.jobcard);

                      if (this.jobcard.WorkOrderStatusID === 1) {
                        this.statusStyleName = 'status_box pending';
                       } else if (this.jobcard.WorkOrderStatusID === 2) {
                        this.statusStyleName = 'status_box completed';
                      } else if (this.jobcard.WorkOrderStatusID === 3) {
                         this.statusStyleName = 'status_box closed';
                        }

                        this.jobcardReportURL = this.jobcard.ReportURL;

                       // this.jobcardReportURL="https://www.dgw.gov.ae";

                       return this.worklogService.GetWorkLogs(this.paramUserToken, response.WorkOrderID, response.EquipmentNo);
                    })

                    ,
                    filter(response => !!response),
                    switchMap(response => {
                   
                      this.worklogs = response;

                      return this.worklogService.GetStatusLogs(this.paramUserToken, this.paramWorkorderid, this.paramEquipmentNo);

                    })

                    ).subscribe((response) => {

                      this.statuslogs = response;


                    });

  }

  ionViewDidEnter(): void {
    this.getUserLanguage();
  }

  showMeActivityLogs(){
    this.bShowActivity=true;
  }

  getUserLanguage() {

    this.subAppLang = this.authService.userLang.subscribe((lang) => {

      this._initTranslate(lang);

     });

  }

  _initTranslate(language) {
    this.translate.setDefaultLang('en');
    if (language) {
      this.lang = language;
    } else {
        this.lang = 'en';
    }

    this._translateLanguage();
  }
  
  _translateLanguage(): void {
    this.translate.use(this.lang);
    this._initialiseTranslation();
  }
  
  _initialiseTranslation(): void {

    this.translate.get('jobcarddetails.heading1').subscribe((res: string) => {
      this.heading1 = res;
    });

    this.translate.get('jobcarddetails.workorderID').subscribe((res: string) => {
      this.workorderID = res;
    });
    this.translate.get('jobcarddetails.JobCreated').subscribe((res: string) => {
      this.JobCreated = res;
    });
    this.translate.get('jobcarddetails.UpdatedOn').subscribe((res: string) => {
      this.UpdatedOn = res;
    });
    this.translate.get('jobcarddetails.Status').subscribe((res: string) => {
      this.Status = res;
    });
    this.translate.get('jobcarddetails.WorkLogs').subscribe((res: string) => {
      this.WorkLogs = res;
    });

    this.translate.get('jobcarddetails.MoreDetailText').subscribe((res: string) => {
      this.MoreDetailText = res;
    });   

    this.translate.get('jobcarddetails.StatusLogsText').subscribe((res: string) => {
      this.StatusLogsText = res;
    });
   
    this.translate.get('jobcarddetails.jobType').subscribe((res: string) => {
      this.jobType = res;
    });

    this.translate.get('jobcarddetails.jobcardReportURLCap').subscribe((res: string) => {
      this.jobcardReportURLCap = res;
    });

  }


  async  openBrowser(webpage){
   // console.log("home.page.ts: Opneing Web browser: " + webpage);
    await Browser.open({url: webpage});
  }

  openCapacitorSite = async () => {
    await Browser.open({ url: 'http://capacitorjs.com/' });
   

  };

  openMe(webpage){
    window.open(webpage,'_system','location=no');
   // window.open(webpage, "_system", "toolbar=1, scrollbars=1, resizable=1, width=" + 1015 + ", height=" + 800);
  }


  ngOnDestroy() {

      if (this.jcsSub) {
        this.jcsSub.unsubscribe();
      }

      if (this.subAppLang) {
        this.subAppLang.unsubscribe();
      }
 
  }


}
