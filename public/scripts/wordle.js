window.addEventListener('load', async () => {
  let main = document.getElementById('main');
  let letterArray = document.getElementById('letter-array');

  for (let i = 0; i < 6; i++) {
    let letterRow = document.createElement('div');
    letterRow.id = `lr-${i}`;
    letterRow.className = 'letter-row';
    for (let j = 0; j < 5; j++) {
      let letterTile = document.createElement('div');
      letterTile.id = `lr-${i} lc-${j}`;
      letterTile.className = 'letter-tile';
      let textP = document.createElement('p');
      letterTile.appendChild(textP);
      letterRow.appendChild(letterTile);
    }
    letterArray.appendChild(letterRow);
  }

  let keyboard = document.getElementById('keyboard');
  let keyboardRow;

  let keyboardLetters = [
    'br',
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    'br',
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'br',
    'ent',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm',
    'bck',
    'br'
  ];
  for (let i = 0; i < keyboardLetters.length; i++) {
    let keyLetter = keyboardLetters[i];
    if (keyLetter === 'br') {
      if (keyboardRow) {
        keyboard.appendChild(keyboardRow);
      }
      keyboardRow = document.createElement('div');
      keyboardRow.className = 'keyboard-row';
      continue;
    }
    let key = document.createElement('div');
    let textP = document.createElement('p');
    key.className = 'key';
    key.addEventListener('mousedown', handleKeyMouse);
    key.addEventListener('mouseup', handleKeyMouse);
    key.addEventListener('mouseout', handleKeyMouse);
    if (keyLetter === 'ent') {
      key.id = 'key-ent';
      key.className = 'key large-key';
      textP.textContent = 'ENTER';
    } else if (keyLetter === 'bck') {
      key.id = 'key-bck';
      key.className = 'key large-key back-key';
      textP.className = 'far fa-backspace';
    } else {
      key.id = `key-${keyLetter}`;
      textP.textContent = keyLetter.toUpperCase();
    }
    key.appendChild(textP);
    keyboardRow.appendChild(key);
  }

  main.style.setProperty('display', 'flex');

  function handleKeyMouse(e) {
    let key = this;
    let keyType = keyboardStatus[this.id.substring(4)];
    let down = e.type === 'mousedown';
    updateKey(key, keyType, down);
    if (down) {
      let keyToPress = this.id.substring(4);
      let keyCode = '';
      if (keyToPress === 'ent') keyCode = 'Enter';
      if (keyToPress === 'bck') keyCode = 'Backspace';
      console.log({ code: keyCode, key: keyToPress });
      handleKeyDown({ code: keyCode, key: keyToPress });
    }
  }

  var wordList = await (await fetch('/dictionary.json')).json();
  var dictionary = wordList.valid.concat(wordList.choose);
  var goal = wordList.choose[Math.floor(Math.random() * 2500)];
  var keyboardStatus = {
    ent: 'unused',
    bck: 'unused',
    a: 'unused',
    b: 'unused',
    c: 'unused',
    d: 'unused',
    e: 'unused',
    f: 'unused',
    g: 'unused',
    h: 'unused',
    i: 'unused',
    j: 'unused',
    k: 'unused',
    l: 'unused',
    m: 'unused',
    n: 'unused',
    o: 'unused',
    p: 'unused',
    q: 'unused',
    r: 'unused',
    s: 'unused',
    t: 'unused',
    u: 'unused',
    v: 'unused',
    w: 'unused',
    x: 'unused',
    y: 'unused',
    z: 'unused'
  };
  var words = [];
  var disabled = false;

  var word = '';
  var row = 0;

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  updateLetters();

  function handleKeyDown(e) {
    if (disabled) return;
    if (e.code === 'Backspace') {
      let key = document.getElementById('key-bck');
      updateKey(key, 'unused', true);
      word = word.substr(0, word.length - 1);
      updateLetters();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      let key = document.getElementById(`key-${e.key.toLowerCase()}`);
      let keyType = keyboardStatus[e.key.toLowerCase()];
      updateKey(key, keyType, true);
      if (word.length === 5) {
      } else {
        word = word + e.key.toUpperCase();
      }
      updateLetters();
    } else if (e.code === 'Enter') {
      let key = document.getElementById('key-ent');
      updateKey(key, 'unused', true);
      if (word.length !== 5) {
        notify('Word is Too Short!', 'yellow', 2000);
        return;
      }
      if (!dictionary.includes(word.toLowerCase())) {
        notify(
          "It seems like that word isn't in the dictionary",
          'yellow',
          2000
        );
        return;
      }
      disabled = true;
      checkLetters();
      if (goal.toLowerCase() === word.toLowerCase()) {
        notify('Good Job!', 'green', 99999999);
        return;
      }
      if (row === 5) {
        notify(
          `Aww... you didn't get it this time. (The word was ${goal.toUpperCase()}) - Refresh this page for a new word`,
          'red',
          99999999999
        );
        return;
      }
      row++;
      words.push(word);
      word = '';
      updateLetters();
      console.log('row entered');
      disabled = false;
    }
  }

  function handleKeyUp(e) {
    if (e.code === 'Backspace') {
      let key = document.getElementById('key-bck');
      updateKey(key, 'unused', false);
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      let key = document.getElementById(`key-${e.key.toLowerCase()}`);
      let keyType = keyboardStatus[e.key.toLowerCase()];
      updateKey(key, keyType, false);
    } else if (e.code === 'Enter') {
      let key = document.getElementById('key-ent');
      updateKey(key, 'unused', false);
    }
  }

  function updateKey(key, keyType, down) {
    if (keyType === 'unused') {
      if (down) {
        key.style.setProperty('background-color', '#434343');
        key.style.setProperty('box-shadow', '-0.1vw -0.1vw 0 0.1vw #303030');
        key.style.setProperty(
          'transform',
          'translateX(0.2vw) translateY(0.2vw)'
        );
      } else {
        key.style.setProperty('background-color', '#7e7e7e');
        key.style.setProperty('box-shadow', '0.1vw 0.1vw 0 0.1vw #707070');
        key.style.setProperty('transform', 'translateX(0) translateY(0)');
      }
    } else if (keyType === 'yellow') {
      if (down) {
        key.style.setProperty('background-color', '#858332');
        key.style.setProperty(
          'transform',
          'translateX(0.2vw) translateY(0.2vw)'
        );
        key.style.setProperty('box-shadow', '-0.1vw -0.1vw 0 0.1vw #6b6928');
      } else {
        key.style.setProperty('background-color', '#c7c54c');
        key.style.setProperty('transform', 'translateX(0) translateY(0)');
        key.style.setProperty(
          'box-shadow',
          '0 0 0.2vw 0 #dbd940, 0.1vw 0.1vw 0 0.1vw #75742b'
        );
      }
    } else if (keyType === 'green') {
      if (down) {
        key.style.setProperty('background-color', '#326b35');
        key.style.setProperty(
          'transform',
          'translateX(0.2vw) translateY(0.2vw)'
        );
        key.style.setProperty('box-shadow', '-0.1vw -0.1vw 0 0.1vw #2c5c2e');
      } else {
        key.style.setProperty('background-color', '#50a654');
        key.style.setProperty('transform', 'translateX(0) translateY(0)');
        key.style.setProperty(
          'box-shadow',
          '0 0 0.2vw 0 #3cc742, 0.1vw 0.1vw 0 0.1vw #367339'
        );
      }
    }
  }

  function updateLetters() {
    for (let i = 0; i < 5; i++) {
      let letterSlot = document.getElementById(`lr-${row} lc-${i}`);
      letterSlot.firstChild.textContent = word[i];
      if (word[i]) letterSlot.style.setProperty('border-color', '#4a4a4a');
      else letterSlot.style.setProperty('border-color', '#373737');
    }
  }

  function checkLetters() {
    let lettersInGoal = goal.split('');
    console.log(goal.split(''));
    let toCheck = [];
    for (let i = 0; i < 5; i++) {
      let letterSlot = document.getElementById(`lr-${row} lc-${i}`);
      let letter = letterSlot.firstChild.textContent.toLowerCase();
      let key = document.getElementById(`key-${letter}`);
      letterSlot.style.setProperty('background-color', '#3a3a3a');
      if (goal[i] === letter) {
        letterSlot.style.setProperty('background-color', '#50a654');
        letterSlot.style.setProperty('border-color', '#00000000');
        letterSlot.style.setProperty('box-shadow', '0 0 0.4vw 0 #3cc742');
        key.style.setProperty('background-color', '#50a654');
        key.style.setProperty('border-color', '#00000000');
        key.style.setProperty(
          'box-shadow',
          '0 0 0.2vw 0 #3cc742, 0.1vw 0.1vw 0 0.1vw #367339'
        );
        keyboardStatus[letter] = 'green';
        lettersInGoal[i] = '';
      } else {
        toCheck.push(letterSlot);
      }
      console.log(lettersInGoal[0]);
      console.log(lettersInGoal.toString());
    }
    for (let i = 0; i < toCheck.length; i++) {
      let letterSlot = toCheck[i];
      let letter = letterSlot.firstChild.textContent.toLowerCase();
      let key = document.getElementById(`key-${letter}`);
      if (lettersInGoal.includes(letter)) {
        console.log('found letter');
        letterSlot.style.setProperty('background-color', '#c7c54c');
        letterSlot.style.setProperty('border-color', '#00000000');
        letterSlot.style.setProperty('box-shadow', '0 0 0.4vw 0 #dbd940');
        if (keyboardStatus[letter] === 'unused') {
          key.style.setProperty('background-color', '#c7c54c');
          key.style.setProperty('border-color', '#00000000');
          key.style.setProperty(
            'box-shadow',
            '0 0 0.2vw 0 #dbd940, 0.1vw 0.1vw 0 0.1vw #75742b'
          );
          keyboardStatus[letter] = 'yellow';
        }
        console.log(lettersInGoal.indexOf(letter));
        lettersInGoal.splice(lettersInGoal.indexOf(letter), 1);
      } else {
        key.style.setProperty('background-color', '#3a3a3a');
        keyboardStatus[letter] = 'none';
        key.style.setProperty('box-shadow', '-0.1vw -0.1vw 0 0.1vw #303030');
        key.style.setProperty(
          'transform',
          'translateX(0.2vw) translateY(0.2vw)'
        );
      }
    }
  }

  let notifBox = document.getElementById('notification-box');
  let notifTemp = document.createElement('div');
  notifTemp.className = 'notification';
  function notify(text, type, timeout) {
    let notif = notifTemp.cloneNode();
    notif.textContent = text;
    notif.className = notif.className + ` notification-${type}`;
    notifBox.appendChild(notif);
    setTimeout(() => {
      notif.remove();
    }, timeout | 3000);
  }
});
