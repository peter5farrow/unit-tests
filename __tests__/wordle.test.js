import { jest } from "@jest/globals";

//MOCKS
const mockIsWord = jest.fn(() => true);
jest.unstable_mockModule("../src/words.js", () => {
  return {
    getWord: jest.fn(() => "APPLE"),
    isWord: mockIsWord,
  };
});
const { Wordle, buildLetter } = await import("../src/wordle.js");

//TESTS
describe("building a letter object", () => {
  test("returns a letter object", () => {
    expect(buildLetter("F", "CORRECT")).toEqual({
      letter: "F",
      status: "CORRECT",
    });
  });
});

describe("constructing a new Wordle game", () => {
  test("sets maxGuesses to 6 if no args passed", () => {
    const newWordle = new Wordle();
    expect(newWordle.maxGuesses).toBe(6);
  });

  test("sets maxGuesses to number passed as arg", () => {
    const newWordle = new Wordle(10);
    expect(newWordle.maxGuesses).toBe(10);
  });

  test("sets guesses to an array of length maxGuesses", () => {
    const newWordle = new Wordle();
    expect(newWordle.guesses.length).toBe(6);
  });

  test("sets currGuess to 0", () => {
    const newWordle = new Wordle();
    expect(newWordle.currGuess).toBe(0);
  });

  test("sets word to a word from getWord", () => {
    const newWordle = new Wordle();
    expect(newWordle.word).toBe("APPLE");
  });
});

describe("building a guess array from a word", () => {
  test("sets the status of a correct letter to CORRECT", () => {
    const newWordle = new Wordle();
    const newGuess = newWordle.buildGuessFromWord("A____");
    expect(newGuess[0].status).toBe("CORRECT");
  });

  test("sets the status of a present letter to PRESENT", () => {
    const newWordle = new Wordle();
    const newGuess = newWordle.buildGuessFromWord("E____");
    expect(newGuess[0].status).toBe("PRESENT");
  });

  test("sets the status of an absent letter to ABSENT", () => {
    const newWordle = new Wordle();
    const newGuess = newWordle.buildGuessFromWord("Z____");
    expect(newGuess[0].status).toBe("ABSENT");
  });
});

describe("making a guess", () => {
  test("throws an error if no more guesses are allowed", () => {
    const newWordle = new Wordle(1);
    newWordle.appendGuess("GUESS");
    expect(() => {
      newWordle.appendGuess("GUESS");
    }).toThrow();
  });

  test("throws an error if the guess is not of length 5", () => {
    const newWordle = new Wordle();
    expect(() => {
      newWordle.appendGuess("GUESSSSSS");
    }).toThrow();
  });

  test("throws an error if the guess is not a word", () => {
    const newWordle = new Wordle();
    mockIsWord.mockReturnValueOnce(false);
    expect(() => {
      newWordle.appendGuess("GUESS");
    }).toThrow();
  });

  test("increments the current guess", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("GUESS");
    expect(newWordle.currGuess).toBe(1);
  });
});

describe("checking if wordle is solved", () => {
  test("returns true if the latest guess is the correct word", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("APPLE");
    expect(newWordle.isSolved()).toBe(true);
  });

  test("returns false if the latest guess is not the correct word", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("GUESS");
    expect(newWordle.isSolved()).toBe(false);
  });
});

describe("ending the game", () => {
  test("returns true if the latest guess is the correct word", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("APPLE");
    expect(newWordle.shouldEndGame()).toBe(true);
  });

  test("returns true if there are no more guesses left", () => {
    const newWordle = new Wordle();
    for (let index = 0; index < newWordle.maxGuesses; index++) {
      newWordle.appendGuess("GUESS");
    }
    expect(newWordle.shouldEndGame()).toBe(true);
  });

  test("returns false if no guess has been made", () => {
    const newWordle = new Wordle();
    expect(newWordle.shouldEndGame()).toBe(false);
  });

  test("returns false if there are guesses left and the word has not been guessed", () => {
    const newWordle = new Wordle();
    newWordle.appendGuess("GUESS");
    expect(newWordle.shouldEndGame()).toBe(false);
  });
});
