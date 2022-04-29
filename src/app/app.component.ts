import { Component } from '@angular/core';
import { decode_hcert } from 'eu-dcc-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EU DCC lib - Test Angular';
  input = 'HC1:NCFTW2H:7*I06R3W/J:O6:P4QB3+7RKFVJWV66UBCE//UXDT:*ML-4D.NBXR+SRHMNIY6EB8I595+6UY9-+0DPIO6C5%0SBHN-OWKCJ6BLC2M.M/NPKZ4F3WNHEIE6IO26LB8:F4:JVUGVY8*EKCLQ..QCSTS+F$:0PON:.MND4Z0I9:GU.LBJQ7/2IJPR:PAJFO80NN0TRO1IB:44:N2336-:KC6M*2N*41C42CA5KCD555O/A46F6ST1JJ9D0:.MMLH2/G9A7ZX4DCL*010LGDFI$MUD82QXSVH6R.CLIL:T4Q3129HXB8WZI8RASDE1LL9:9NQDC/O3X3G+A:2U5VP:IE+EMG40R53CG9J3JE1KB KJA5*$4GW54%LJBIWKE*HBX+4MNEIAD$3NR E228Z9SS4E R3HUMH3J%-B6DRO3T7GJBU6O URY858P0TR8MDJ$6VL8+7B5$G CIKIPS2CPVDK%K6+N0GUG+TG+RB5JGOU55HXDR.TL-N75Y0NHQTZ3XNQMTF/ZHYBQ$8IR9MIQHOSV%9K5-7%ZQ/.15I0*-J8AVD0N0/0USH.3';
  output ='';

  scannerEnabled = true;

  constructor() {
    this.decode()
  }

  decode() {
    this._decode(this.input);
  }
  
  clear() {
    this.output='';
  }

  scanSuccessHandler(event: any) {
    this.input = event;
    console.log(event);
    this.scannerEnabled = false;
    this.decode();
  }

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled
  }

  private _decode(input: string){
    try {
      const dcc = decode_hcert(input);
      this.output = JSON.stringify(dcc, null, 2);
      console.log(dcc)
    } catch (error: any) {
      this.output = error.message;
      console.log(error.message)
    }
  }
}
