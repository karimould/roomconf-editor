interface ITestData {
  state: number;
  message: string;
  userInput: string;
  delay?: number;
}

export const noHelpData: ITestData[] = [
  {
    state: 0,
    message: "Welcome Iam BeYou. How can I help you? If you don`t need any help say I don't need help, otherwise say: Add and select room, add edge, delete edge and room or House structure",
    userInput: "I dont't need help",
  },
  {
    state: 1,
    message: "Are you sure you don't need any help?",
    userInput: "Yes, I dont't need help",
    delay: 5000,
  },
];
