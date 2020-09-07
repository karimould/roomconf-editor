describe("Visit RoomConfEditor", () => {
  it("successfully loads", () => {
    cy.visit("/");
  });
  it("start beYou assistent", () => {
    cy.get("#beyou-button").click();
  });
  it("beYou is recording", () => {
    cy.wait(13000).get(".beyou-recording");
    setTimeout(() => {
      const msg = new SpeechSynthesisUtterance();

      msg.lang = "en-US";
      msg.volume = 1; // 0 to 1
      msg.text = "I don't need help";
      window.speechSynthesis.speak(msg);
    }, 13000);
  });
});
