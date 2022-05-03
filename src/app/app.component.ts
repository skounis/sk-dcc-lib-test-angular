import { Component } from '@angular/core';
import { decode_hcert, verify_hcert } from 'eu-dcc-lib';
import trustlist from '../assets/trustlist.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Use camera example:
  // https://stackblitz.com/edit/zxing-ngx-scanner?file=projects%2Fzxing-scanner-demo%2Fsrc%2Fapp%2Fapp.component.ts
  title = 'EU DCC lib - Test Angular';
  input = 'HC1:NCFTW2H:7*I06R3W/J:O6:P4QB3+7RKFVJWV66UBCE//UXDT:*ML-4D.NBXR+SRHMNIY6EB8I595+6UY9-+0DPIO6C5%0SBHN-OWKCJ6BLC2M.M/NPKZ4F3WNHEIE6IO26LB8:F4:JVUGVY8*EKCLQ..QCSTS+F$:0PON:.MND4Z0I9:GU.LBJQ7/2IJPR:PAJFO80NN0TRO1IB:44:N2336-:KC6M*2N*41C42CA5KCD555O/A46F6ST1JJ9D0:.MMLH2/G9A7ZX4DCL*010LGDFI$MUD82QXSVH6R.CLIL:T4Q3129HXB8WZI8RASDE1LL9:9NQDC/O3X3G+A:2U5VP:IE+EMG40R53CG9J3JE1KB KJA5*$4GW54%LJBIWKE*HBX+4MNEIAD$3NR E228Z9SS4E R3HUMH3J%-B6DRO3T7GJBU6O URY858P0TR8MDJ$6VL8+7B5$G CIKIPS2CPVDK%K6+N0GUG+TG+RB5JGOU55HXDR.TL-N75Y0NHQTZ3XNQMTF/ZHYBQ$8IR9MIQHOSV%9K5-7%ZQ/.15I0*-J8AVD0N0/0USH.3';
  output = '';

  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;
  scannerEnabled = true;
  hasDevices: boolean = false;

  verified = false;

  constructor() {
    this.decode()
    this.verify()
  }

  decode(): any {
    this.clear()
    return this._decode(this.input);
  }
  
  verify() {
    this._verify(this.input);
  }

  clear() {
    this.output = '';
    this.verified = false;
  }

  scanSuccessHandler(event: any) {
    this.input = event;
    console.log(event);
    this.scannerEnabled = false;
    this.decode();
    this.verify();
  }

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled
  }
  
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onDeviceSelectChange(selected: Event | null) {
    if (!selected) return;
    const device = this.availableDevices.find(x => x.deviceId === (<HTMLSelectElement>selected.target).value);
    this.currentDevice = device || undefined;
  }
  private _decode(input: string): any{
    try {
      const dcc = decode_hcert(input);
      this.output = JSON.stringify(dcc, null, 2);
      console.log(dcc)
      return dcc;
    } catch (error: any) {
      this.output = error.message;
      console.log(error.message)
    }
  }

  private _verify(input: string) {
    const dcc = this._decode(input);
    const kid = dcc.metadata.kid; // 'FhciF/j3plg=';
    const pem = `-----BEGIN CERTIFICATE-----
    ${this._getPem(kid)}
    -----END CERTIFICATE-----`
    console.log('PEM', pem)
    try {
      const verify = verify_hcert(input, pem);
      verify.then((buf:any) => {
        this.verified = true;
        console.log('All Good.');
        console.log(buf);
        this.output = this.output + `\n\n The Certificate is Verified.`
      }).catch((error:any) => {
          console.error('Verification failed.');
          console.error(error);
          this.output = this.output + `\n\n Verification failed. ${error}`
      });
    } catch (error: any) {
      console.log(error.message)
      this.output = this.output + `\n\n Verification failed. ${error.message}`
    }

  }

  private _getPem(kid: string): string {
    const certificate = trustlist.certificates.filter(e => {
      return e.kid == kid;
    })

    if(certificate.length > 0) {
      return certificate[0].rawData;
    } else {
      return 'No Certificate found.'
    }
  }
}
