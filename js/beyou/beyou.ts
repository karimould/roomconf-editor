import * as jQuery from "jquery";
import { tokenize, dictionary, vectorSpaceModel, termFrequency, inverseDocumentFrequency, similarity, cosineSimilarity } from "./nlp/nlp";
import { IWindow, IbeYouStateObject, tfSimilarity } from "./types";
import axios from "axios"

const endpoint = "http://localhost:3000"

let state: number;
let beYouStates: IbeYouStateObject[];
let tolerance: number;
let learnTolerance: number;
let lang: string;
let recognizing: boolean;
let useAPI: boolean;

const { webkitSpeechRecognition }: IWindow = <IWindow>(<unknown>window);
const recognition = new webkitSpeechRecognition();

export default function init(beYouStateObjects: IbeYouStateObject[], initLang = "en-US", initTolerance = 0.0): void {
  beYouStates = beYouStateObjects;
  state = 0;
  tolerance = initTolerance;
  lang = initLang;
  recognizing = false;
  useAPI = false
  learnTolerance = 0.7
  beYouStates.forEach((obj) => (obj.delay === undefined ? (obj.delay = obj.message.length * 65) : null));
  recognition.continuous = true;
  document.getElementById("beyou-button").addEventListener("click", () => toggleStartStop());

  recognition.onresult = function (event: SpeechRecognitionEvent) {
    recognition.stop();
    beYouController(event.results[0][0].transcript);
  };
}

reset();
recognition.onend = reset();

function reset() {
  recognizing = false;
}

const toggleStartStop = (message?: string) => {
  if (state === 0 && !beYouStates.find((obj) => obj.state === state).isEndState && !message) {
    uiController(beYouStates.find((obj) => obj.state === state).message);
    speak(beYouStates.find((obj) => obj.state === state).message);
  } else {
    uiController(message);
    speak(message);
  }
  setTimeout(function () {
    if (beYouStates.find((obj) => obj.state === state).isEndState) {
      recognition.stop();
      reset();
      return;
    }
    if (recognizing) {
      recognition.stop();
      reset();
    } else {
      recognizing = true;
      hear();
    }
  }, beYouStates.find((obj) => obj.state === state).delay);
};

function speak(text: string) {
  var msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = lang;
  msg.volume = 1; // 0 to 1
  msg.rate = 1; // 0.1 to 10
  msg.pitch = 1; //0 to 2
  speechSynthesis.speak(msg);
}

function hear() {
  recognition.start();
}

async function beYouController(message: string) {
  let newMessage: string;
  if(useAPI) {
    const data = await getSimilarityFromApi(message)
    if(data.class === "-1") {
      newMessage = "Unfortunately I did not understand what you said. Please repeat it again.";
    } else {
      state = parseInt(data.class) 
      newMessage = beYouStates.find((obj) => obj.state === state).message;
    }
  } else {
    const sim = getSimilarity(message)[0].similarity 
    if (sim >= tolerance) {
      state = getSimilarity(message)[0].state;
      sim >= learnTolerance && await axios.get(`${endpoint}/save/${message}/${state}`)
      newMessage = beYouStates.find((obj) => obj.state === state).message;
    } else {
      newMessage = "Unfortunately I did not understand what you said. Please repeat it again.";
    }
  }

  reset();
  toggleStartStop(newMessage);
}

function uiController(message: string): void {
  jQuery(".beyou-text").text(message);
  jQuery("#beyou-active").show();
  recognizing ? (jQuery(".beyou-recording").show(), jQuery(".beyou-speaking").hide()) : (jQuery(".beyou-recording").hide(), jQuery(".beyou-speaking").show());
  setTimeout(function () {
    recognizing ? (jQuery(".beyou-recording").show(), jQuery(".beyou-speaking").hide()) : (jQuery(".beyou-recording").hide(), jQuery(".beyou-speaking").show());
    if (beYouStates.find((obj) => obj.state === state).isEndState) {
      jQuery("#beyou-active").hide();
      state = 0;
    }
  }, beYouStates.find((obj) => obj.state === state).delay + 1);
}

const getSimilarityFromApi = async (userInput: string) => {
  const response = await axios.get(`${endpoint}/predict/${userInput}`)
  return response.data as { class: string , probability: number }
}

const getSimilarity = (userInput: string): tfSimilarity[] => {
  let states: { state: number; term: string[] }[] = [];
  let tokens: string[][] = [];
  let dict: string[] = [];
  let vsm_test: number[][] = [];
  let tf_test: number[][] = [];
  let tfidf_test: number[][] = [];
  let output_test: tfSimilarity[] = [];
  for (let i = 0; i < beYouStates.find((obj) => obj.state === state).children.length; i++) {
    beYouStates.find((obj) => obj.state === state).children[i].positive.positiveTerm.forEach((text) => tokens.push(tokenize(text)));
    states.push({
      state: beYouStates.find((obj) => obj.state === state).children[i].positive.positiveState,
      term: beYouStates.find((obj) => obj.state === state).children[i].positive.positiveTerm,
    });
    beYouStates.find((obj) => obj.state === state).children[i].negative.negativeTerm.forEach((text) => tokens.push(tokenize(text)));
    states.push({
      state: beYouStates.find((obj) => obj.state === state).children[i].negative.negativeState,
      term: beYouStates.find((obj) => obj.state === state).children[i].negative.negativeTerm,
    });
  }

  for (let i = 0; i < tokens.length; i++) {
    dict = dictionary(tokens[i], dict);
  }

  for (let i = 0; i < tokens.length; i++) {
    vsm_test.push(vectorSpaceModel(tokens[i], dict));
  }

  for (let i = 0; i < vsm_test.length; i++) {
    tf_test.push(termFrequency(vsm_test[i], tokens[i].length));
  }

  let idf = inverseDocumentFrequency(tokens, dict);

  for (let i = 0; i < tf_test.length; i++) {
    tfidf_test.push(similarity(tf_test[i], idf));
  }

  let queryTokens = tokenize(userInput);
  let queryVsm = vectorSpaceModel(queryTokens, dict);
  let querytf = termFrequency(queryVsm, queryTokens.length);
  let querytfidf = similarity(querytf, idf);

  for (let i = 0; i < tfidf_test.length; i++) {
    output_test.push({
      similarity: cosineSimilarity(tfidf_test[i], querytfidf),
      state: states[i] === undefined ? 2 : states[i].state,
    });
  }
  return output_test.sort((a, b) => (a.similarity < b.similarity ? 1 : b.similarity < a.similarity ? -1 : 0));
};
