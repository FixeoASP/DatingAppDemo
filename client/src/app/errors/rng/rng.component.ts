import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Lotto } from 'src/app/_models/lotto';
import { NumbersService } from 'src/app/_services/numbers.service';

@Component({
  selector: 'app-rng',
  templateUrl: './rng.component.html',
  styleUrls: ['./rng.component.css']
})
export class RngComponent {
  jackpotResult: Lotto | null = null;

  constructor(private numbersService: NumbersService){}

  ngOnInit(): void {
    this.getLottoResult();
  }

  getLottoResult(): void{
    console.log('Execute getLottoResult from rng component');
    this.numbersService.getLottoResult().subscribe(
      {
        next: response => this.jackpotResult = response,
        error: error => console.log(error)
      }
    );
  }

}
