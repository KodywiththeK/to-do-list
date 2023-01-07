import { checkLeapYear, getFirstDayOfWeek } from "./module/module.js";
import { appendChildrenList, makeDOMwithProperties } from "./utils/dom.js";
import { MONTH_NAME } from "./constant/monthName.js"


const leftArrow = document.getElementsByClassName('bxs-left-arrow')[0]
const rightArrow = document.getElementsByClassName('bxs-right-arrow')[0]
const dates = document.getElementsByClassName('dates')[0]
const monthName = document.getElementsByClassName('month')[0]
const yearName = document.getElementsByClassName('year')[0]
const clickableDate = document.getElementsByClassName('clickable')
const selectDate = document.getElementsByClassName('select-date')[0]
const calendar = document.getElementsByClassName('calendar')[0]
const container = document.getElementsByClassName('container')[0]


const memoContainer = document.getElementsByClassName('memo-container')
const memoDate = document.getElementsByClassName('memo-date')
const inputField = document.getElementById('inputField')
const addToDo = document.getElementById('addToDo')
const thingsToDo = document.getElementById('toDoContainer')
const save = document.getElementById('save')


let current_year = (new Date()).getFullYear();
let current_month = (new Date()).getMonth()+1;


// 달력 페이지 날짜 배열 만들기
function changeYearMonth(year, month) {
  let month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if(month == 2) {
    if(checkLeapYear(year)) month_day[1] = 29;
  }
  let first_day_of_week = getFirstDayOfWeek(year, month);
  let arr_calendar = [];


  for(let i=0; i<first_day_of_week; i++) {
    if(month == 1) {
      arr_calendar.unshift(month_day[11]-i)
    } else {
      arr_calendar.unshift(month_day[month-2]-i)
    }
  }
  for(let i=1; i<=month_day[month-1]; i++) {
    arr_calendar.push(String(i))
  }
  let remain_day = 7 - (arr_calendar.length%7);
  if(remain_day<7){
    for(let i=1; i<=remain_day; i++) {
      arr_calendar.push(i)
    }
  }

  monthName.innerHTML = MONTH_NAME[month-1]
  yearName.innerHTML = year

  renderCalendar(arr_calendar);
}


// 달력 만들기
function renderCalendar(data) {
  let h = [];
  for(let i=0; i<data.length; i++) {
    if(typeof data[i]=='string') {
      if(i%7==0) {
        h.push(makeDOMwithProperties('div', {
          className: 'date clickable sun', innerHTML: `${data[i]}`
        }))
      } else {
        h.push(makeDOMwithProperties('div', {
          className: 'date clickable', innerHTML: `${data[i]}`
        }))
      }
    } else {
      h.push(makeDOMwithProperties('div', {
        className: 'date not-this-month', innerHTML: `${data[i]}`
      }))
    }
    appendChildrenList(dates, h)
  }
}

const checkItems = (date) => {
  const allItems = localStorage.getItem(date) || [];
  if(allItems.length == 0) return false;
  else return true;
}

function loading() {
  for(let i=0; i<clickableDate.length; i++) {
    let tmp_month = '';
    if(current_month<10) {
      tmp_month = `0${current_month}`
    } else {
      tmp_month = current_month
    }
    if(clickableDate[i].innerHTML.length == 1) {
      if(checkItems(`${current_year}-${tmp_month}-0${clickableDate[i].innerHTML}`)) {
        clickableDate[i].classList.add('memo-exist')
      }
    } else if(clickableDate[i].innerHTML.length == 2){
      if(checkItems(`${current_year}-${tmp_month}-${clickableDate[i].innerHTML}`)) {
        clickableDate[i].classList.add('memo-exist')
      }
    }
  }
}

function firstLoad() {
  changeYearMonth(current_year, current_month);
  for(let i=0; i<clickableDate.length; i++) {
    // console.log((new Date().getDay()))
    if(clickableDate[i].innerHTML == (new Date()).getDate()) {
      clickableDate[i].classList.add('today')
      // clickableDate[i+1].innerHTML = `Today`
    }
  }
  loading();
}
firstLoad();

function changeMonth(diff) {
  current_month = current_month + diff;
  if(current_month == 0) {
    current_year --;
    current_month = 12;
  } else if(current_month == 13) {
    current_year ++;
    current_month = 1;
  }
}


leftArrow.onclick = () => {
  dates.replaceChildren();
  changeMonth(-1)
  changeYearMonth(current_year, current_month)
  if(MONTH_NAME[(new Date()).getMonth()] == monthName.innerHTML && (new Date()).getFullYear() == yearName.innerHTML) {
    dates.replaceChildren();
    firstLoad();
  }
  loading();
  getPickedDay()
}
rightArrow.onclick = () => {
  dates.replaceChildren();
  changeMonth(1)
  changeYearMonth(current_year, current_month)
  if(MONTH_NAME[(new Date()).getMonth()] == monthName.innerHTML && (new Date()).getFullYear() == yearName.innerHTML) {
    dates.replaceChildren();
    firstLoad();
  }
  loading();
  getPickedDay()
}

// 로컬 스토리지 값 가져오기
const getOriginalItems = () => {
  const originalItem = localStorage.getItem(memoDate[0].innerHTML) || []; 
  if(originalItem.length==0) return false;
  else return originalItem.split(',');
};



// 날짜를 선택하면 ..?
const getPickedDay = () => {
  for(let i=0; i<clickableDate.length; i++) {
    clickableDate[i].onclick = () => {
      //기존의 picked 클래스 찾아서 삭제
      for(let j=0; j<clickableDate.length; j++) {
        if(clickableDate[j].className.includes('picked')) {
          clickableDate[j].classList.remove('picked')
          break
        }
      }
      // 새롭게 선택된 요소에 picked 클래스 추가
      clickableDate[i].classList.add('picked')

      // 날짜 형식 만들기 yyyy-mm-dd
      const pickedDay = [`${current_year}`, `${current_month}`, `${i+1}`]
      for(let i=0; i<pickedDay.length; i++) {
        if(pickedDay[i].length<2) {
          pickedDay[i] = "0"+pickedDay[i];
        }
      }
      console.log(pickedDay.join('-'))

      // 날짜가 선택되면 달력 감추기
      calendar.setAttribute('hidden','')
      // 선택된 날짜 보여지기
      selectDate.value = pickedDay.join('-');

      // todoList 보이기
      memoContainer[0].removeAttribute('hidden')
      memoDate[0].innerHTML = pickedDay.join('-');
      
      // 기존에 다른날짜에 작성된 메모가 보이지 않게 하기 위해 thingsToDo 자식요소 모두 삭제
      thingsToDo.replaceChildren();

      // 만약 선택된 날짜에 저장된 메모가 있으면 불러와서 보여줌
      if(getOriginalItems() !== false) {
        for(let i=0; i<getOriginalItems().length; i++) {
          let item = makeDOMwithProperties('p', {className: 'to-do-item', innerHTML: `${getOriginalItems()[i]}`})
          thingsToDo.appendChild(item)
        }
      }
      // 더블클릭하면 메모 삭제
      const toDoItems = document.querySelectorAll('.to-do-item')
      for(let i=0; i<toDoItems.length; i++) {
        toDoItems[i].addEventListener('dblclick', function() {
          thingsToDo.removeChild(toDoItems[i])
        })
      }
    }
  }
}
getPickedDay();


selectDate.addEventListener('focus', () => {
  calendar.removeAttribute('hidden')
  memoContainer[0].setAttribute('hidden', '')
})
calendar.addEventListener('blur', () => {
  calendar.setAttribute('hidden','')
  memoContainer[0].removeAttribute('hidden')
})
container.addEventListener('focus', () => {
  calendar.setAttribute('hidden','')
  memoContainer[0].setAttribute('hidden','')
})


addToDo.addEventListener('click', function () {
  const paragraph = makeDOMwithProperties('p', {className: 'to-do-item'})
  
  thingsToDo.appendChild(paragraph)
  paragraph.innerText = inputField.value;
  inputField.value = ''

  // 더블클릭하면 메모 삭제
  const toDoItems = document.querySelectorAll('.to-do-item')
  for(let i=0; i<toDoItems.length; i++) {
    toDoItems[i].addEventListener('dblclick', function() {
      thingsToDo.removeChild(toDoItems[i])
    })
  }
})

inputField.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const paragraph = makeDOMwithProperties('p', {className: 'to-do-item'})
  
    thingsToDo.appendChild(paragraph)
    paragraph.innerText = inputField.value;
    inputField.value = ''
  }
  // 더블클릭하면 메모 삭제
  const toDoItems = document.querySelectorAll('.to-do-item')
  for(let i=0; i<toDoItems.length; i++) {
    toDoItems[i].addEventListener('dblclick', function() {
      thingsToDo.removeChild(toDoItems[i])
    })
  }
});


save.addEventListener('click', function() {
  const paragraph = document.getElementsByClassName('to-do-item')
  const date = memoDate[0].innerHTML
  const getDay = () => {
    let day = '';
    if(date[8]=='0') {
      day = date[9]
    } else {
      day = date[8]+date[9]
    }
    return parseInt(day)
  }
  const arr = [];

  localStorage.removeItem(date)
  for(let i=0; i<paragraph.length; i++) {
    arr.push(paragraph[i].innerHTML)
  }
  if(arr.length == 0) {
    window.alert(`You have nothing to do on ${date}`)
    localStorage.removeItem(date)
    clickableDate[getDay()].classList.remove('memo-exist')
    location.reload();
  } else {
    window.alert(`You have "${arr}" to do on ${date}`)
    localStorage.setItem(date, arr)
    clickableDate[getDay()].classList.add('memo-exist')
    location.reload();
  }
})