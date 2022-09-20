import { formEvent, fromEvent } from 'rxjs';

const onkeyDown$ = fromEvent(document, 'keydown');
const deleteLetter$ = fromEvent(document, 'keydown');
const letterRows = document.getElementsByClassName('letter-row');
let letterIndex = 0;
let letterRowIndex = 0;

const insertLetter = {
    next: (event) => {
        const pressedKey = event.key.toUpperCase();

        if(pressedKey.length === 1 && pressedKey.match(/[a-z]/i)){
            let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
            letterBox.textContent = pressedKey;
            letterBox.classList.add('filled-letra');
            letterIndex ++;
        }
    }
}

const deleteLetter = {
    next: (event) => {
        const pressedKey = event.key;
        if(pressedKey === 'Backspace' || pressedKey === 'Delete'){
            letterIndex --;
            if(letterIndex < 0){
                letterIndex = 0;
            }
            let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
            
            if(letterBox){
                letterBox.textContent = '';
                letterBox.classList.remove('filled-letra');
            }
        }
    }
}

onkeyDown$.subscribe(insertLetter);
deleteLetter$.subscribe(deleteLetter)

