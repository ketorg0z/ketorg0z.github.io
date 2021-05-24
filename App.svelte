<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700&display=swap" rel="stylesheet">

<script>
  import {createSmartappDebugger, createAssistant} from '@sberdevices/assistant-client'
  import { onMount } from 'svelte'

  let message = '';
  const backendUrl = 'https://tolmatch-backend.herokuapp.com/'
  let wordsState = []
  let idState
  let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMzM2YmEwMjU3MzEyN2RkMDY1MmYxNDRmZDI5NmQwNWViNmIyZTk5MTJhMmVlMDQ5NzAyMWE4ZGE0NDVjM2E5NTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMTk3MTIyNywiaWF0IjoxNjIxODg0ODE3LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNGZiZmNhZDEtMDk5OC00MWEzLTljMmUtYWYxYjE2YTQ5ZjU4Iiwic2lkIjoiNDRmZWMwZTYtMWJhMy00NTY5LTg2ZjMtNGQxYjY1ODg0ZTc0In0.KcAKsAow9Xv2kQE6cRolDrP85X1lZ1HhPWhPfDvklcQ2Ztq5lQmII5t7FaDXxPIBpUrsRlxz633fdxt2fI8dYjiRCYX2X_9hP2zvo43XIdzez6lXfj72JaWB0lkHDtz_UsXeCvfW3VU9UmaK_ndCxlB_hZo1NdLEJ21Av_XYcAWKUbXPyzGLesjcf6zxY7xMe7iDMZ8ZKobt41vaN_G0vMsnldc-i4uvvvyu-tUO9-KrQPR8JsQiwuz3xnmGED9Bnjqce5HgDBKiIXM0hPMWlzBmUIjMjSInbe-atSo3CFJgNZtXkBEHsRJTlVCQKc0i_7psUiSmDJl1rIVpyDzqL7rnE6tw-Km0yXkp_mQ_PoiNUuQfj78VSD0LmmJbZY9v0w8XjFIouV3AracPS-RqfKQrE23L95AZcJqDSW0UwlXS2RxINMXrXWb1E2CsNLsCzLVEfF5PfS9ZCebQ0ljM0n17s3tuiccTX4wNeFBjQQyCHIlsgHGiVoTGEVRf_5xsMHyWJ26atFOjPcHpccHlR6QmEnob7FMm3v3xSQP-TyzgAC2PYjZkdNQPBNg5zBGK8PCvZ7lFzIdmeVfHrZNyAc5TSHlR4c2_1JGvAMM-MqIwuCCQ4Zf4P3FnJXYBpwI3M5BoU9RG_UzW2MDcVjZLbYdsntc6I7G9s5fIOrr21Xg';
  let initPhrase = 'Включи игру переводчик'; 

  function getState() {
    console.log("State was get");
    const state = {
      item_selector: {
        items: [
          {rightId: idState},
          {
            words: wordsState
          }
        ],
      }
    }
    console.log(state)
    return state;
  }

  let assistant;
  onMount(() => {
    const init = () => {
      return createSmartappDebugger({
        token,
        initPhrase,
        getState,
        settings: {debugging: false}
      })
      // return createAssistant({getState});
    }
    assistant = init();

    assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });

    assistant.on("data", (event) => {
      console.log('EVENT!!!', event);
      switch (event.action.type) {
        case 'answer':
          if (wordsState[idState] === event.action.word) {
            message = '';
            promise = newGame();
          } else {
            message = 'Неверно, подумай еще раз.'
          }
        break
      }
    });
  })

  function check(ind, rightInd) {
    if (ind === rightInd) {
      message = '';
      promise = newGame();
    } else {
      message = 'Неверно, подумай еще раз.'
    }
  }

  const newGame = async () => {
    const response = await fetch(backendUrl+'game');
    if (response.ok) {
      const json = await response.json();
      wordsState = json.words;
      idState = json.trueIndex;
      return json;
    } else {
      return {trueWord: 'Ошибка сервера'}
    }
  }

  let promise = newGame();
</script>

<main>
  <div id="game">
    {#await promise then game}
      <h1>{game.trueWord}</h1>
      <div id="words-block">
        {#each game.words as word, i}
          <button on:click={() => check(i, game.trueIndex)}>{word}</button>
        {/each}
      </div>
      <div id="message">
        <p>{message}</p>
      </div>
    {/await}
  </div>
</main>

<style>
	main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1;
    font-family: 'Montserrat', sans-serif;
    background-color: #3c3c3c;
    color: #FFFFFF;
	}

	#game {
    position: relative;
    text-align: center;
    padding-bottom: 50px;
  }

  #words-block {
    min-width: 300px;
    display: flex;
    justify-content: center;
    flex: 1 1;
    margin-top: 40px;
    flex-wrap: wrap;
  }

  #words-block button {
    width: 250px;
    min-width: 100px;
    cursor: pointer;
    margin: 10px 20px;
    padding: 20px;
    border-radius: 20px;
  }

  #message {
    width: 100%;
    position: absolute;
    bottom: 0;
    color: red;
    text-align: center;
  }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>