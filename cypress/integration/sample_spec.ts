import { noHelpData } from "../fixtures/testSpeechData";

const data = noHelpData;

before(() => {
  data.forEach((obj) => (obj.delay === undefined ? (obj.delay = obj.message.length * 65) : null));
});

describe("Visit RoomConfEditor", () => {
  it("successfully loads", () => {
    cy.visit("/");
  });
  it("start beYou assistent", () => {
    cy.get("#beyou-button").click();
  });
  noHelpData.forEach((obj) => {
    it(obj.userInput, () => {
      cy.wait(obj.delay + 1000).get(".beyou-recording");
      setTimeout(() => {
        const msg = new SpeechSynthesisUtterance();
        msg.lang = "en-US";
        msg.volume = 1; // 0 to 1
        msg.text = obj.userInput;
        window.speechSynthesis.speak(msg);
      }, obj.delay + 1500);
    });
  });
});
