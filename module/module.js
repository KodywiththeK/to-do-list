// 윤년 구하기
export function checkLeapYear(year) {
  if(year%400 == 0) {
    return true;
  } else if(year%100 == 0) {
    return false;
  } else if(year%4==0) {
    return true;
  } else {
    return false;
  }
}


// 달의 첫째 날 구하기
export function getFirstDayOfWeek(year, month) {
  if(month<10) {
    month = "0" + month;
  }
  return (new Date(year+"-"+month+"-01")).getDay()
}
