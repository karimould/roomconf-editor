import { IbeYouStateObject } from "./beyou/types";

export const beYouStateObject: IbeYouStateObject[] = [
  {
    state: 0,
    message: "Welcome Iam BeYou. How can I help you? If you don`t need any help say I don't need help, otherwise say: Add and select room, add edge, delete edge and room or House structure",
    prevstate: 0,
    children: [
      {
        positive: {
          positiveState: 3,
          positiveTerm: ["delete edge and room"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["i don't need help"],
        },
      },
      {
        positive: {
          positiveTerm: ["house structure"],
          positiveState: 4,
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["i don't need help"],
        },
      },
      {
        positive: {
          positiveTerm: ["add edge"],
          positiveState: 5,
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["i don't need help"],
        },
      },
      {
        positive: {
          positiveTerm: ["add and select room"],
          positiveState: 6,
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["i don't need help"],
        },
      },
    ],
  },
  {
    state: 1,
    message: "Are you sure you don't need any help?",
    prevstate: 0,
    children: [
      {
        positive: {
          positiveState: 0,
          positiveTerm: ["I need help", "No help me"],
        },
        negative: {
          negativeState: 2,
          negativeTerm: ["Yes", "I don't need help"],
        },
      },
    ],
  },
  {
    state: 2,
    message: "Awesome, come back whenever you need anything. See you next time!",
    prevstate: 0,
    isEndState: true,
  },
  {
    state: 3,
    message: "Say 'Delete Edge' when you want to know how to delete an edge or say 'delete room' when you want to know how to delete a room.",
    prevstate: 0,
    children: [
      {
        positive: {
          positiveState: 7,
          positiveTerm: ["delete edge"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 8,
          positiveTerm: ["delete room"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
    ],
  },
  {
    state: 4,
    message:
      "Please say 'Room heaven direction'if you want to know in which heaven direction to place your room. Or say 'room order' if you want to know which order should be followed for each room.",
    prevstate: 0,
    children: [
      {
        positive: {
          positiveState: 9,
          positiveTerm: ["room heaven direction"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 10,
          positiveTerm: ["room order"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
    ],
  },
  {
    state: 5,
    message: "When you have at least two rooms, click 'Add Edges' and connect two rooms. Do you need help in creating a room?",
    prevstate: 0,
    children: [
      {
        positive: {
          positiveState: 6,
          positiveTerm: ["Yes"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 2,
          positiveTerm: ["no"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
    ],
  },
  {
    state: 6,
    message: "Please say add room if you want to 'add a new room' or room type if you want to 'select a room type' for an existing room",
    prevstate: 0,
    children: [
      {
        positive: {
          positiveState: 12,
          positiveTerm: ["add room"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 13,
          positiveTerm: ["select a room type"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
    ],
  },
  {
    state: 12,
    message: "To add a room please click 'Add room' and click in empty field to create a room. Do you also want to select a room type?",
    prevstate: 6,
    children: [
      {
        positive: {
          positiveState: 13,
          positiveTerm: ["yes"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 12,
          positiveTerm: ["no"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
    ],
  },
  {
    state: 9,
    message: "Please say in which heaven direction you want to place a room: North East, East, South, South-West or West. For you information: the sun goes up in the south and down in the west.",
    prevstate: 4,
    children: [
      {
        positive: {
          positiveState: 14,
          positiveTerm: ["south-west"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 15,
          positiveTerm: ["north-east"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 16,
          positiveTerm: ["South"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 17,
          positiveTerm: ["East"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 18,
          positiveTerm: ["West"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
    ],
  },
  {
    state: 10,
    message: "Please say which room you want to create: Entrance, Kitchen, Eating Room, Living Room, Sleeping Room or Children's Room",
    prevstate: 4,
    children: [
      {
        positive: {
          positiveState: 19,
          positiveTerm: ["Entrance"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 20,
          positiveTerm: ["Kitchen"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 21,
          positiveTerm: ["Sleeping room"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 22,
          positiveTerm: ["Childrenn's room"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 23,
          positiveTerm: ["Eating room"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
      {
        positive: {
          positiveState: 24,
          positiveTerm: ["Living room"],
        },
        negative: {
          negativeState: 1,
          negativeTerm: ["I don't need help"],
        },
      },
    ],
  },
  {
    state: 7,
    message: "To delete an edge please click on the edge you want to delete and choose 'delete selected'.",
    isEndState: true,
    prevstate: 3,
  },
  {
    state: 8,
    message: "To delete a room, click on the room you want to delete and choose 'Delete selected'. Attention: the edge which is connected with the Room will be deleted too.",
    isEndState: true,
    prevstate: 3,
  },
  {
    state: 14,
    message: "Here you can place the living room or/and the eating room.",
    isEndState: true,
    prevstate: 9,
  },
  {
    state: 15,
    message: "It is nice to place the entrance here.",
    isEndState: true,
    prevstate: 9,
  },
  {
    state: 16,
    message: "Here you can place the children's room, the living room or/and the eating room.",
    isEndState: true,
    prevstate: 9,
  },
  {
    state: 17,
    message: "the best idea is to place the bedroom and the bathroom here.",
    isEndState: true,
    prevstate: 9,
  },
  {
    state: 18,
    message: "Here you can place the children's room and the toilet.",
    isEndState: true,
    prevstate: 9,
  },
  {
    state: 19,
    message: "Make a connection to the kitchen, dining cabinet and/or housekeeping room",
    isEndState: true,
    prevstate: 10,
  },
  {
    state: 20,
    message: "Create a connection to eating room, housekeeping room, dining cabinet and/or garden",
    isEndState: true,
    prevstate: 10,
  },
  {
    state: 21,
    message: "It is good to have connection to the children's room if you have younger childrens. Additionally you can make a connection to the bathroom",
    isEndState: true,
    prevstate: 10,
  },
  {
    state: 22,
    message: "If you habe younger children place the room next to the sleeping room. If they are older try to place the room far away from the sleeping room of the parents",
    isEndState: true,
    prevstate: 10,
  },
  {
    state: 23,
    message: "Combine this room with the living room.",
    isEndState: true,
    prevstate: 10,
  },
  {
    state: 24,
    message: "You can link the working room, the eating room and/or the sleeping room.",
    isEndState: true,
    prevstate: 10,
  },
  {
    state: 13,
    message: "To select a room type please double click to edit 'Room'. Select room type. If required enter area, windows and label",
    isEndState: true,
    prevstate: 6,
  },
];
