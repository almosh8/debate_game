// src/tests/unit/Logger.test.ts
import { Logger } from "../../infrastructure/Logger";

describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = Logger.getInstance();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "debug").mockImplementation(() => {});
  });

  it("should log info messages", () => {
    logger.info("Test info message");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("[INFO]")
    );
  });

  it("should log error messages", () => {
    logger.error("Test error message");
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("[ERROR]")
    );
  });

  it("should log warn messages", () => {
    logger.warn("Test warn message");
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("[WARN]")
    );
  });

  it("should log debug messages", () => {
    logger.debug("Test debug message");
    expect(console.debug).toHaveBeenCalledWith(
      expect.stringContaining("[DEBUG]")
    );
  });
});