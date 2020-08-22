import * as jQuery from "jquery";
import { network } from "../app";

interface IbeYouStateObject {
  state: number;
  message: string;
  delay: number;
  positiveState: number;
  negativeState: number;
  prevstate: number;
  positiveKeywords: string[];
  negativeKeywords: string[];
}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

document.getElementById("beyou-button").addEventListener("click", () => toggleStartStop());

let beYouState: number = 0;
const beYouStates: IbeYouStateObject[] = [
  {
    state: 0,
    message: "Welcome Iam BeYou. How can I help you? If you don`t need any help say I don't need help, otherwise say: Add and select room, add edge, delete edge and room or House structure",
    delay: 10000,
    positiveState: 4,
    negativeState: 2,
    prevstate: 0,
    positiveKeywords: ["add", "room"],
    negativeKeywords: ["no", "don't"],
  },
  {
    state: 1,
    message: "Are you sure you don't need any help?",
    delay: 4000,
    positiveState: 4,
    negativeState: 2,
    prevstate: 0,
    positiveKeywords: ["add", "room"],
    negativeKeywords: ["no", "don't"],
  },
  {
    state: 2,
    message: "Awesome, come back whenever you need anything. See you next time!",
    delay: 5000,
    positiveState: 4,
    negativeState: 2,
    prevstate: 0,
    positiveKeywords: ["add", "room"],
    negativeKeywords: ["no", "don't"],
  },
];

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
  console.log("TOGGLE STARTE STOP", beYouState);
  if (beYouState === 0) {
    uiController(beYouStates[beYouState].message);
    speak(beYouStates[beYouState].message);
  } else {
    uiController(message);
    speak(message);
  }
  setTimeout(function () {
    if (beYouState === 2) {
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
  }, beYouStates[beYouState].delay);
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

function beYouController(message: string) {
  if (positiveKeywordCheck(message) && !negativeKeywordCheck(message)) {
    console.log("POSITIVE CHECK");
    beYouState = beYouStates[beYouState].positiveState;
    reset();
    toggleStartStop(beYouStates[beYouState].message);
  } else if (negativeKeywordCheck(message) && !positiveKeywordCheck(message)) {
    console.log("NEGATIV CHECK");
    beYouState = beYouStates[beYouState].negativeState;
    reset();
    toggleStartStop(beYouStates[beYouState].message);
  }
  // else if abort check => go in last state (abort state)
  // else => go in "did not understand state"
}

function uiController(message: string): void {
  jQuery(".beyou-text").text(message);
  jQuery("#beyou-active").show();

  recognizing ? (jQuery(".beyou-recording").show(), jQuery(".beyou-speaking").hide()) : (jQuery(".beyou-recording").hide(), jQuery(".beyou-speaking").show());
  setTimeout(function () {
    console.log("RECO", recognizing);
    recognizing ? (jQuery(".beyou-recording").show(), jQuery(".beyou-speaking").hide()) : (jQuery(".beyou-recording").hide(), jQuery(".beyou-speaking").show());
    if (beYouState === 2) {
      jQuery("#beyou-active").hide();
    }
  }, beYouStates[beYouState].delay + 1);
}

function positiveKeywordCheck(keyword: string) {
  for (let i = 0; i < beYouStates[beYouState].positiveKeywords.length; i++) {
    if (beYouStates[beYouState].positiveKeywords[i].includes(keyword)) {
      return true;
    }
  }
  return false;
}
function negativeKeywordCheck(message: string) {
  let check = false;
  for (let i = 0; i < beYouStates[beYouState].negativeKeywords.length; i++) {
    if (message.includes(beYouStates[beYouState].negativeKeywords[i])) {
      check = true;
      break;
    }
  }
  return check;
}
