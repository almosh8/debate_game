// src/tests/unit/CreateRoomForm.test.tsx
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import CreateRoomForm from "../../pages/CreateRoomForm";
import { createRoom } from "../../services/RoomApi";

jest.mock("../../services/api");

describe("CreateRoomForm", () => {
  it("should display success message after creating a room", async () => {
    (createRoom as jest.Mock).mockResolvedValue({});

    render(<CreateRoomForm />);

    fireEvent.change(screen.getByLabelText("Admin ID:"), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByText("Create"));

    expect(await screen.findByText("Room created successfully!")).toBeInTheDocument();
  });

  it("should display error message if room creation fails", async () => {
    (createRoom as jest.Mock).mockRejectedValue(new Error("Access denied"));

    render(<CreateRoomForm />);

    fireEvent.change(screen.getByLabelText("Admin ID:"), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByText("Create"));

    expect(await screen.findByText("Access denied")).toBeInTheDocument();
  });
});