import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lotto } from '../_models/lotto';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLottoResult(){
    console.log("GetLottoResult called");
    return this.http.get<Lotto>(this.baseUrl + 'numbers/lotto');
  }
}
