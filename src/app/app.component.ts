import { Component } from '@angular/core';

interface rowItem {
  level: number;
  c1: number;
  c2: number;
  c3: number;
  manual: boolean;
}

@Component({
  selector: 'spa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'spa';
  data: rowItem[] = [
    { level: 1, c1: 50, c2: 100, c3: 50, manual: true },
    { level: 2, c1: 0, c2: 0, c3: 0, manual: false },
    { level: 2, c1: 0, c2: 0, c3: 0, manual: false },
    { level: 2, c1: 0, c2: 5, c3: 0, manual: true },
    { level: 2, c1: 0, c2: 0, c3: 0, manual: false },
  ];

  recompute() {
    //Missing in IE
    if (!Math.trunc) {
      Math.trunc = function (v) {
        v = +v;
        return (v - v % 1) || (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
      };
    }
    const sumRowItem = this.data.find((item) => item.level === 1);
    const totalC3 = sumRowItem !== undefined ? sumRowItem.c1 : 100;
    const rowsForAdjustment = this.data.filter((item) =>
      item.manual === false);
    const divisorC2 = rowsForAdjustment.length;
    const rowsFixed = this.data.filter((item) =>
      item.manual === true);
    // Compute percentage
    rowsFixed.map((item) => {
      item.c3 = item.c2 >= 0 && item.c2 <= 100 ? Math.trunc(item.c2 / 100 * totalC3) : 0;
    });
    const rowTotalAdjustedEle = rowsFixed.reduce(
      (accumulator, currentValue) => {
        let result = currentValue;
        if (accumulator.level === 2) {
          result = {
            level: currentValue.level,
            c1: 0,
            c2: (accumulator.c2 + currentValue.c2),
            c3: (accumulator.c3 + currentValue.c3),
            manual: false
          };
        }
        return result;
      });

    // Confirm bound 1-100
    let rowTotalAdjustedC2 = rowTotalAdjustedEle.c2 >= 0 && rowTotalAdjustedEle.c2 <= 100 ? rowTotalAdjustedEle.c2 : 100;
    let rowTotalAdjustedC3 = rowTotalAdjustedEle.c3 >= 0 && rowTotalAdjustedEle.c3 <= totalC3 ? rowTotalAdjustedEle.c3 : totalC3;

    const perRowValC2 = Math.trunc((100 - rowTotalAdjustedC2) / divisorC2);
    let remainderC2 = (100 - rowTotalAdjustedC2) % divisorC2;
    const perRowValC3 = Math.trunc((totalC3 - rowTotalAdjustedC3) / divisorC2);
    let remainderC3 = (totalC3 - rowTotalAdjustedC3) % divisorC2;

    rowsForAdjustment.map((item) => {
      item.c1 = 0;
      item.c2 = perRowValC2 + (remainderC2 > 0 ? 1 : 0);
      remainderC2 = (remainderC2 > 0 ? remainderC2 - 1 : 0);
      item.c3 = perRowValC3 + (remainderC3 > 0 ? 1 : 0);
      remainderC3 = (remainderC3 > 0 ? remainderC3 - 1 : 0);
    });

    for (let i1 = 0; i1 < this.data.length; i1++) {

    }
  }
}
