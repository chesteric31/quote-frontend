import {Component} from '@angular/core';

import {Quote} from './quote';
import {Observable} from 'rxjs';
import {QuoteService} from './quote.service';

@Component({
  selector: 'app-component-quotes',
  providers: [QuoteService],
  templateUrl: './quote.component.html'
})
export class QuoteComponent {

  quotes: Observable<Quote[]>;
  selectedQuote: Quote;
  mode: String;
  pagination: boolean;
  page: number;
  size: number;

  constructor(private service: QuoteService) {
    this.mode = 'reactive';
    this.pagination = true;
    this.page = 0;
    this.size = 50;
  }

  requestQuoteStream(): void {
    if (this.pagination === true) {
      this.quotes = this.service.getQuoteStream(this.page, this.size);
    } else {
      this.quotes = this.service.getQuoteStream();
    }
  }

  onSelect(quote: Quote): void {
    this.selectedQuote = quote;
  }
}
