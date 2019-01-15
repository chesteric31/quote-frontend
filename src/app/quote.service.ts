import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Quote} from './quote';

@Injectable()
export class QuoteService {

  quotes: Quote[] = [];
  url = 'http://localhost:8080/quotes';
  urlPaged = 'http://localhost:8080/quotes-paged';

  getQuoteStream(page?: number, size?: number): Observable<Array<Quote>> {
    this.quotes = [];
    return Observable.create((observer) => {
      let url = null;
      if (page != null) {
        url = this.urlPaged + '?page=' + page + '&size=' + size;
      } else {
        url = this.url;
      }
      const eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        // console.log('Received event: ', event);
        const json = JSON.parse(event.data);
        // console.log(json);
        this.quotes.push(new Quote(json['id'], json['book'], json['content']));
        // console.log(this.quotes);
        observer.next(this.quotes);
      };
      eventSource.onerror = (error) => {
        // readyState === 0 (closed) means the remote source closed the connection,
        // so we can safely treat it as a normal situation. Another way of detecting the end of the stream
        // is to insert a special element in the stream of events, which the client can identify as the last one.
        if (eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      };
    });
  }

}
