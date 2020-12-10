import { http } from '@/providers/apis/http';
/**
 *
 * This Auth API Provider
 *
 */
export class AuthAPI {

  private static INSTANCE = new AuthAPI();

  static get instance() {
    return this.INSTANCE;
  }

  private authAPINamespace: string = 'sportsapi/login';

  private profileNameSpace: string = 'sportsapi/api/usergetbalance';

  private payoutNameSpace: string = 'sportsapi/api/payout';

  private accountNameSpace: string = 'sportsapi/api/accountstatement';

  private changePasswordNameSpace: string = 'sportsapi/api/changepassword';

  private riskManagerNameSpace: string = 'sportsapi/api/riskmanager';

  private placeBetNameSpace: string = 'sportsapi/api/placebet';

  private ticketNameSpace: string = 'sportsapi/api/tickets';

  private viewTicketNameSpace: string = 'sportsapi/api/viewticket';

  private barTicketNameSpace: string = 'sportsapi/api/barcode';

  public getBarCode(request, token) {
    const endpoint = this.barTicketNameSpace;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    return http.post(endpoint, headers, request).then((response: any) => {
      return response.data;
    });
  }

  public getUserTickets(token) {
    const endpoint = this.ticketNameSpace;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    return http.post(endpoint, headers, {}).then((response: any) => {
      return response.data;
    });
  }

  public getTicketInfo(request, token) {
    const endpoint = this.viewTicketNameSpace;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    return http.post(endpoint, headers, request).then((response: any) => {
      return response.data;
    });
  }

  public getBetSlipConfigByUser(token): Promise<any> {
    const endpoint = this.riskManagerNameSpace;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    return http.post(endpoint, headers, {}).then((response: any) => {
      return response.data;
    });
  }

  public login(request): Promise<any> {
    const endpoint = this.authAPINamespace;
    const headers = {
      'Content-Type': 'application/json',
    };
    return http.post(endpoint, headers, request).then((response: any) => {
      return response.data;
    });
  }

  public requestPayout(request, token): Promise<any> {
    const endpoint = this.payoutNameSpace;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    return http.post(endpoint, headers, request).then((response: any) => {
      return response.data;
    });
  }

  public getAccountStatements(token) {
    const endpoint = this.accountNameSpace;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    return http.post(endpoint, headers).then((response: any) => {
      return response.data;
    });
  }

  public changePassword(request, token): Promise<any> {
    const endpoint = this.changePasswordNameSpace;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    return http.post(endpoint, headers, request).then((response: any) => {
      return response.data;
    });
  }

  public getUserBalance(token) {
    const endpoint = this.profileNameSpace;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    return http.post(endpoint, headers).then((response: any) => {
      return response.data;
    });
  }

  public placeBet(request, token) {
    const endpoint = this.placeBetNameSpace;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    return http.post(endpoint, headers, request).then((response: any) => {
      return response.data;
    });
  }
}

export const authAPI = AuthAPI.instance;
