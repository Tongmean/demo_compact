import moment from 'moment-timezone';

export function convertToUTCPlus7(date) {
  return moment(date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
}
