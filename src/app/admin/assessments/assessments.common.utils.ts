import * as moment from 'moment'; //in your component
export class AssesmentsUtil {
  getDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    if(duration == 60){
      return `${hours} Hr`;
    }
    else if (hours > 0 && mins > 0) {
    if(hours == 1){
      return `${hours} Hr ${mins} Mins`;
      }
      return `${hours} Hrs ${mins} Mins`;
    } else if (hours > 0) {
      return `${hours} Hrs`;
    } 
    else {
      return `${mins} Mins`;
    }
  }


  // getDuration(duration: number): string {
  //   let durationText = '';
  //   if (duration < 60) {
  //     durationText = `${this.getFixedDuration(duration)} Mins`;
  //   } 
  //   else if (duration === 60) {
  //     durationText = `1 Hr`;
  //   }
  //    else {
  //     durationText = `${this.getFixedDuration(duration / 60)}`;
  //   }
  //   return durationText;
  // }

  // getFixedDuration(duration) {
  //   debugger;
  //   if (Number.isInteger(duration)) {
  //   return String(duration+'        '+'Hrs'); 
  //   } else {
  //     var rhours = Math.floor(duration);
  //     var minutes = (duration - rhours) * 60;
  //     var rminutes:any = Math.round(minutes);
  //     if(rminutes < 10){
  //       rminutes = "0"+rminutes;
  //     }
  //     return String(rhours+'        '+'Hrs' + rminutes +'      '+ 'Mins');
  //   }
  // }

  getUpdateTime(time: string, status: string): string {
    let dateOn = moment(time).format('MM-DD-YYYY');
    let today = moment();
    // const date = new Date(time);
    // const currentTime = new Date();
    // const differenceInTime = currentTime.getTime() - date.getTime();
    // const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const differenceInDays = today.diff(dateOn, 'days');
    let updateTimeText = '';
    if (Math.trunc(differenceInDays) < 1) {
      updateTimeText = 'Today';
    } else {
      updateTimeText = `${Math.trunc(differenceInDays) == 1 ? Math.trunc(differenceInDays) + ' day ago' : Math.trunc(differenceInDays) + ' days ago'}`;
    }
    return status === 'Draft' ? `Created ${updateTimeText}` : updateTimeText;
  }
}
