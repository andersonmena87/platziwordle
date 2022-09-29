import { fromEvent, Subject } from 'rxjs';
import WORDS_LIST from "./wordsList.json";

const onkeyDown$ = fromEvent(document, 'keydown');
const letterRows = document.getElementsByClassName('letter-row');
const messageText = document.getElementById("message-text");
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord = getRandomWord();
console.log(`Right word: ${rightWord}`);

const userWinOrLoose$ = new Subject();

const insertLetter = {
    next: (event) => {
        const pressedKey = event.key.toUpperCase();
        
        if(pressedKey.length === 1 && pressedKey.match(/[a-z]/i) && userAnswer.length <= 4){
            let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
            letterBox.textContent = pressedKey;
            letterBox.classList.add('filled-letter');
            letterIndex ++;
            userAnswer.push(pressedKey);
        }
    }
}

//Borrado alternativo
/*const deleteLetter = {
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
}*/

const deleteLetter = {
    next: (event) => {
        const pressedKey = event.key;
        if((pressedKey === 'Backspace' || pressedKey === 'Delete') && letterIndex !== 0) {
            let currentRow = letterRows[letterRowIndex];
            let letterBox = currentRow.children[letterIndex - 1];
            letterBox.textContent = "";
            letterIndex--;
            userAnswer.pop();
        }
    }
}

const checkWord = {
    next: (event) => {
      if (event.key === "Enter") {
        if (userAnswer.length !== 5) {
          messageText.textContent = "¡Te faltan algunas letras!";
          return; // <- Este return nos permite parar la ejecución del observable
        }
  
        // También podemos cambiar el ciclo for/forEach/while en lugar de `userAnswer.map()`
        // 😊 Iteramos sobre las letras en índices `[0, 1, 2, 3, 4]`:
        userAnswer.map((_, i) => {
          let letterColor = "";
          let letterBox = letterRows[letterRowIndex].children[i];
  
          // 🔍 Verificamos si la posición de la letra del usuario coincide con la posición correcta
          // Si la letra no se encuentra, indexOf() devolverá -1 (ver línea 58)
          // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
          let letterPosition = rightWord.indexOf(userAnswer[i]);
  
          if (rightWord[i] === userAnswer[i]) {
            letterColor = "letter-green"; // Pintar de verde 🟩 si coincide letra[posición]
          } else {
            if (letterPosition === -1) {
              letterColor = "letter-grey"; // Pintar de gris ⬜️ si no coincide letra o posición
            } else {
              letterColor = "letter-yellow"; // Pintar de amarillo 🟨 si coincide letra, pero no posición
            }
          }
          letterBox.classList.add(letterColor);
        });
  
        // 🔄 Cuando se haya completado la palabra, permite escribir en la siguiente fila:
        if (userAnswer.length === 5) {
          letterIndex = 0;
          userAnswer = [];
          letterRowIndex++;
        }
  
        // 💚 Ganas el juego si la respuesta del usuario coincide con la palabra correcta
        if (userAnswer.join("") === rightWord) {
          userWinOrLoose$.next();
        }
      }
    },
  };

onkeyDown$.subscribe(insertLetter);
onkeyDown$.subscribe(checkWord);
onkeyDown$.subscribe(deleteLetter);

userWinOrLoose$.subscribe(() => {
    let letterRowsWinned = letterRows[letterRowIndex];
    for (let i = 0; i < 5; i++) {
      letterRowsWinned.children[i].classList.add("letter-green");
    }
  });
