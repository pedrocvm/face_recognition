import * as moment from 'moment-timezone';

export default function FormatDateNow() {
  return moment(Date.now()).tz('Europe/London').calendar();
}
