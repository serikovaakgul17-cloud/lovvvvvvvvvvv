(() => {
  // Keep the relationship start date in one place. Date-only math avoids UTC offset errors.
  const START = {year: 2024, month: 10, day: 24}; // month is 1-based
  const $ = id => document.getElementById(id);
  const localToday = () => {
    const now = new Date();
    return {year: now.getFullYear(), month: now.getMonth()+1, day: now.getDate()};
  };
  const dateObj = d => new Date(d.year, d.month-1, d.day, 12, 0, 0);
  const dayNumber = d => Math.floor(Date.UTC(d.year, d.month-1, d.day) / 86400000);
  const dayDiff = (a,b) => dayNumber(b)-dayNumber(a);
  const formatNum = n => new Intl.NumberFormat('ru-RU').format(n);
  const addYears = (d, years) => ({year:d.year+years, month:d.month, day:d.day});
  function calendarDuration(start, end) {
    let years = end.year - start.year;
    let cursor = addYears(start, years);
    if (dayNumber(cursor) > dayNumber(end)) { years--; cursor = addYears(start, years); }
    let months = (end.year-cursor.year)*12 + end.month-cursor.month;
    let monthCursor = {year:cursor.year,month:cursor.month,day:Math.min(cursor.day,new Date(cursor.year,cursor.month,0).getDate())};
    for(let i=0;i<months;i++){
      let nextMonth=monthCursor.month+1, nextYear=monthCursor.year;
      if(nextMonth>12){nextMonth=1;nextYear++}
      monthCursor={year:nextYear,month:nextMonth,day:Math.min(cursor.day,new Date(nextYear,nextMonth,0).getDate())};
    }
    if(dayNumber(monthCursor)>dayNumber(end)) months--;
    const monthBase = (() => {
      let m=cursor.month+months, y=cursor.year;
      while(m>12){m-=12;y++}
      return {year:y,month:m,day:Math.min(cursor.day,new Date(y,m,0).getDate())};
    })();
    const days = dayDiff(monthBase,end);
    return {years,months,days};
  }
  function dateRangeCount(start, end, month, day) {
    let n=0;
    for(let y=start.year;y<=end.year;y++){
      const d={year:y,month,day};
      if(dayNumber(d)>=dayNumber(start)&&dayNumber(d)<=dayNumber(end))n++;
    }
    return n;
  }
  function multiDateCount(start,end, dates) {
    let n=0;
    for(let y=start.year;y<=end.year;y++) for(const d of dates){
      const item={year:y,month:d[0],day:d[1]};
      if(dayNumber(item)>=dayNumber(start)&&dayNumber(item)<=dayNumber(end)) n++;
    }
    return n;
  }
  function render() {
    const today=localToday();
    const elapsed=Math.max(0,dayDiff(START,today));
    const dur=calendarDuration(START,today);
    $('days-together').textContent=formatNum(elapsed);
    $('duration-text').textContent=`Это ${dur.years} ${dur.years===1?'год':(dur.years>=2&&dur.years<=4?'года':'лет')}, ${dur.months} мес. и ${dur.days} дн. нашей истории.`;
    const now = new Date();
    const elapsedMinutes = Math.max(0, Math.floor((now - new Date(START.year,START.month-1,START.day,0,0,0))/60000));
    $('hours-together').textContent=formatNum(Math.floor(elapsedMinutes/60));
    $('minutes-together').textContent=formatNum(elapsedMinutes);
    $('full-days').textContent=formatNum(elapsed);
    const anniversary={year:2026,month:10,day:24};
    const remaining=dayDiff(today,anniversary);
    $('anniversary-countdown').textContent=remaining>0?`Осталось ${remaining} ${remaining===1?'день':(remaining%10>=2&&remaining%10<=4&&!(remaining%100>=12&&remaining%100<=14)?'дня':'дней')} до нашей второй годовщины ❤️`:remaining===0?'Сегодня наша вторая годовщина! ❤️':'Наша вторая годовщина уже наступила ❤️';
    const holidays=[
      ['Новый год',dateRangeCount(START,today,1,1),'1 января каждого года'],
      ['8 Марта',dateRangeCount(START,today,3,8),'8 марта каждого года'],
      ['День защитника Отечества',dateRangeCount(START,today,5,7),'7 мая каждого года'],
      ['День Победы',dateRangeCount(START,today,5,9),'9 мая каждого года'],
      ['День Республики Казахстан',dateRangeCount(START,today,10,25),'25 октября каждого года'],
      ['День независимости',dateRangeCount(START,today,12,16),'16 декабря каждого года'],
      ['День святого Валентина',dateRangeCount(START,today,2,14),'14 февраля каждого года'],
      ['Наурыз',dateRangeCount(START,today,3,21),'21 марта — дата начала праздника'],
      ['Наурыз: праздничные дни',multiDateCount(START,today,[[3,21],[3,22],[3,23]]),'21, 22 и 23 марта каждого года'],
      ['Годовщина отношений',dateRangeCount(START,today,10,24),'24 октября каждого года']
    ];
    $('holiday-grid').innerHTML=holidays.map(h=>`<article class="holiday-card"><span>${h[0]}</span><strong>${h[1]} ${h[1]===1?'раз':'раз(а)'}</strong><small>${h[2]}</small></article>`).join('');
  }
  function birthdayCount(dateValue,today){
    if(!dateValue)return null;
    const parts=dateValue.split('-').map(Number);
    const birth={month:parts[1],day:parts[2]};
    return dateRangeCount(START,today,birth.month,birth.day);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    render();
    const mine=$('my-birthday'), sara=$('sara-birthday'), save=$('save-birthdays'), result=$('birthday-result');
    try {mine.value=localStorage.getItem('my-birthday')||'';sara.value=localStorage.getItem('sara-birthday')||'';} catch(_){}
    save.addEventListener('click',()=>{
      try {localStorage.setItem('my-birthday',mine.value);localStorage.setItem('sara-birthday',sara.value);}catch(_){}
      const today=localToday(), a=birthdayCount(mine.value,today), b=birthdayCount(sara.value,today);
      if(a===null&&b===null){result.textContent='Добавим ваши даты рождения';return;}
      const pieces=[];
      if(a!==null)pieces.push(`Твой день рождения наступал ${a} ${a===1?'раз':'раз(а)'}.`);
      if(b!==null)pieces.push(`День рождения Сары наступал ${b} ${b===1?'раз':'раз(а)'}.`);
      result.textContent=pieces.join(' ');
    });
    if(mine.value||sara.value)save.click();
  });
})();
