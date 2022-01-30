window.addEventListener('DOMContentLoaded', () => {
    
    //global variables
    let currentDate = new Date();
    let cardNumberCache = '';
    let cardHolderCache = '';
    let cvvCache = '';
    let cardNumberData = false;
    let cardHolderData = false;
    let cvvData = false;
    let caretStart, deletedContentCaret = 0;

    //card variables
    let card = document.querySelector('.card')
    let cardNum = document.querySelector('.card-num');
    let cardHolder = document.querySelector('.card-holder');
    let expDateMonth = document.querySelector('.exp-date-month');
    let expDateYear = document.querySelector('.exp-date-year');
    let cvv = document.querySelector('.cvv')
     
    //input variables
    let inputsContainer = document.querySelector('.inputs-container')
    let cardNumberinput = document.getElementById('cardNumber');
    let cardHolderinput = document.getElementById('cardHolder');
    let cvvinput = document.getElementById('cvv');
    let submitBtn = document.querySelector('.submit');
    


    //selector variables
    let yearSelector = document.querySelector('select');

    // main code
    function yearFieldHandler(element) {
        let optionValue = +element.value;
         
        let expDate = new Date(+currentDate.getFullYear() + optionValue, currentDate.getMonth() + 2); //for the next month selection need increase to 2
        let expMonth = expDate.getMonth();
        let expYear = expDate.getFullYear() - 2000;
        
        if(expMonth < 10) expMonth = `0${expMonth}`
        if(expYear < 10) expYear = `0${expYear}`
    
        return [expMonth, expYear]
    }
    
    submitBtn.setAttribute("disabled", "true")

    //-------for input w/0 stars(should change maxlength param on document)------
    // cardNumberinput.addEventListener('input', (e) => {
    //     // if(+e.data || e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
    //     let caret = cardNumberinput.selectionStart;

    //     if((+e.data || +e.data === 0) && cache.length < 20) {
    //         cache = cardNumberinput.value;
    //         cache = [...cache].filter(e => e !== ' ');

    //         do {
    //             cache.push('*')
    //         } while(cache.length <= 16)
    //         cache.pop();
    //         if(cache.length > 4) cache.splice(4, 0, ' ');
    //         if(cache.length > 9) cache.splice(9, 0, ' ');
    //         if(cache.length > 14) cache.splice(14, 0, ' ');
    //         cardNumberinput.value = [...cache].join('');

    //         if(caret % 5 === 0) caret++;
    //         cardNumberinput.selectionStart = caret;
    //         cardNumberinput.selectionEnd = caret;
  
    //     } else cardNumberinput.value = [...cache].join('');

    //     cardNum.textContent = cardNumberinput.value;

    //     // if(cache.length === 19) cardHolderinput.focus();
        
    // })


    cardNumberinput.addEventListener('input', (e) => {        
        if((+e.data || +e.data === 0) && cardNumberCache.length < 21) {
            caretStart = cardNumberinput.selectionStart;
            deletedContentCaret = caretStart;
            
            cardNumberCache = [...cardNumberinput.value].filter(e => e !== ' ' && e !== '\u26B9');
            
            while(cardNumberCache.length <= 16) cardNumberCache.push('\u26B9');
            cardNumberCache.pop();
            
            cardNumberCache.splice(4, 0, ' ');
            cardNumberCache.splice(9, 0, ' ');
            cardNumberCache.splice(14, 0, ' ');
            cardNumberinput.value = [...cardNumberCache].join('');

            if(caretStart % 5 === 0) caretStart++;
            if(e.inputType === 'deleteContentBackward') caretStart = deletedContentCaret;

        } else cardNumberinput.value = [...cardNumberCache].join('');
    
        cardNumberinput.selectionStart = caretStart;
        cardNumberinput.selectionEnd = caretStart;

        cardNum.innerText = cardNumberinput.value;
        cardNum.style = 'letter-spacing: unset;';

        if([...cardNumberCache].filter(e => e !== ' ' && e !== '\u26B9').length === 16) {
            cardNumberData = true;
            setTimeout(() => cardHolderinput.focus(), 200);
        } else cardNumberData = false;

    })

    cardHolderinput.addEventListener('input', (e) => {
        if((e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward' || e.data === " " ||  e.data.match(/^[A-Za-z]+$/) && cardHolderCache.length < 24)) {
            caretStart = cardHolderinput.selectionStart;
            deletedContentCaret = caretStart;

            cardHolderCache = cardHolderinput.value
            cardHolder.textContent = cardHolderinput.value;

            caretStart = deletedContentCaret;

        } else cardHolderinput.value = cardHolderCache; 

        cardHolderinput.selectionStart = caretStart;
        cardHolderinput.selectionEnd = caretStart;

        (cardHolderinput.value && +cardHolderinput.value !== 0) ? cardHolderData = true : cardHolderData = false;
    })

    let [month, year] = yearFieldHandler(yearSelector);

    expDateMonth.innerText = `${month}`;
    expDateYear.innerText = `${year}`;

    yearSelector.addEventListener('click', e => {
        [month, year] = yearFieldHandler(yearSelector);

        expDateMonth.innerText = `${month}`;
        expDateYear.innerText = `${year}`;

    })

    cvvinput.addEventListener('focus', () => {
        card.classList.add('card-rotate');
        setTimeout(() => card.lastElementChild.classList.add('card-backside-rotate'), 150)
    })

    cvvinput.addEventListener('focusout', () => {
        card.classList.remove('card-rotate');
        setTimeout(() => card.lastElementChild.classList.remove('card-backside-rotate'), 150);
    })

    cvvinput.addEventListener('input', (e) => {
        if((+e.data || +e.data === 0) && cvvCache.length <= 3 && cvvinput.value !== "000" && e.data !== " ") {
            cvvCache = cvvinput.value;
            cvv.innerText = cvvinput.value
        } else cvvinput.value = cvvCache;
        
        (cvvCache.length === 3) ? cvvData = true : cvvData = false;        
    })

    inputsContainer.addEventListener('input', () => {
        if(cardHolderData && cardNumberData && cvvData) submitBtn.removeAttribute("disabled");
        else submitBtn.setAttribute("disabled", "true")
    })
})