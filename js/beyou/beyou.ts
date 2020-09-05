import * as jQuery from "jquery";
import { tokenize, dictionary, vsm, tf, idff, tfidf, cosine } from "./nlp/nlp";
import { network } from "../app";
import { beYouStateObject } from "./stateObject";

export interface IbeYouStateObject {
  state: number;
  message: string;
  delay: number;
  isEndState?: boolean;
  prevstate: number;
  functions?: () => void[];
  children?: {
    positive: {
      positiveState: number;
      positiveTerm: string[];
    };
    negative: {
      negativeState: number;
      negativeTerm: string[];
    };
  }[];
}

interface tfSimilarity {
  similarity: number;
  state: number;
  term?: string;
}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

document.getElementById("beyou-button").addEventListener("click", () => toggleStartStop());

let state: number = 0;
const beYouStates: IbeYouStateObject[] = beYouStateObject;
beYouStates.forEach((obj) => (obj.delay === 0 ? (obj.delay = obj.message.length * 65) : null));

let recognizing: boolean = false;
const { webkitSpeechRecognition }: IWindow = <IWindow>(<unknown>window);
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;

reset();
recognition.onend = reset();

function reset() {
  recognizing = false;
}

function toggleStartStop(message?: string) {
  console.log("TOGGLE STARTE STOP", state);
  if (state === 0 && !beYouStates.find((obj) => obj.state === state).isEndState) {
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
}

recognition.onresult = function (event: SpeechRecognitionEvent) {
  // if (event.results[0][0].transcript.includes("test")) {
  //   var nodes = new vis.DataSet([{ id: 1, label: "x=200, y=200", x: 200, y: 200 }]);
  // } else {
  //   var nodes = new vis.DataSet([{ id: 1, label: "x=100, y=100", x: 100, y: 100 }]);
  // }
  // network.update({ nodes: nodes });
  recognition.stop();
  beYouController(event.results[0][0].transcript);
};

function speak(text: string) {
  var msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = "en-US";
  msg.volume = 1; // 0 to 1
  msg.rate = 1; // 0.1 to 10
  msg.pitch = 1; //0 to 2
  speechSynthesis.speak(msg);
}

function hear() {
  recognition.start();
  // recognition.continuous = true;
}

beYouStates.find((obj) => obj.state === state);

function beYouController(message: string) {
  state = getSimilarity(message)[0].state;
  reset();
  toggleStartStop(beYouStates.find((obj) => obj.state === state).message);
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

function getSimilarity(message: string): tfSimilarity[] {
  console.log("SPEAK", message);
  console.log("STATE: ", state);
  let states: { state: number; term: string[] }[] = [];
  let tokens: string[][] = [];
  let dict: string[] = [];
  let vsm_test: number[][] = [];
  let tf_test: number[][] = [];
  let tfidf_test: number[][] = [];
  let output_test: tfSimilarity[] = [];
  console.log("IS RESETET ?", states, tokens, dict, vsm_test, tf_test, tfidf_test, output_test);
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
    vsm_test.push(vsm(tokens[i], dict));
  }

  for (let i = 0; i < vsm_test.length; i++) {
    tf_test.push(tf(vsm_test[i], tokens[i].length));
  }

  let idf = idff(tokens, dict);

  for (let i = 0; i < tf_test.length; i++) {
    tfidf_test.push(tfidf(tf_test[i], idf));
  }

  let queryTokens = tokenize(message);
  let queryVsm = vsm(queryTokens, dict);
  let querytf = tf(queryVsm, queryTokens.length);
  let querytfidf = tfidf(querytf, idf);
  console.log("TFIDF", tfidf_test);
  console.log("states", states);
  for (let i = 0; i < tfidf_test.length; i++) {
    output_test.push({
      similarity: cosine(tfidf_test[i], querytfidf),
      state: states[i] === undefined ? 2 : states[i].state,
    });
  }

  console.log("###################################");
  console.log(
    "output:",
    output_test.sort((a, b) => (a.similarity < b.similarity ? 1 : b.similarity < a.similarity ? -1 : 0))
  );
  console.log("###################################");
  return output_test.sort((a, b) => (a.similarity < b.similarity ? 1 : b.similarity < a.similarity ? -1 : 0));
}
