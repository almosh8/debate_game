// src/tests/unit/useRooms.test.ts
import { renderHook } from "@testing-library/react-hooks";
import useRooms from "../../hooks/useRooms";
import { getRooms } from "../../services/RoomApi";

jest.mock("../../services/api");

describe("useRooms", () => {
  it("should fetch rooms successfully", async () => {
    (getRooms as jest.Mock).mockResolvedValue([{ id: "1", status: "waiting" }]);

    const { result, waitForNextUpdate } = renderHook(() => useRooms());

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.rooms).toEqual([{ id: "1", status: "waiting" }]);
  });

  it("should handle error when fetching rooms", async () => {
    (getRooms as jest.Mock).mockRejectedValue(new Error("Failed to fetch rooms"));

    const { result, waitForNextUpdate } = renderHook(() => useRooms());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch rooms");
  });
});