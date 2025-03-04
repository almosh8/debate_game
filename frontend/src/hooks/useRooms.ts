import { useEffect, useState } from "react";
import { getRooms } from "../services/api";
import { Logger } from "../utils/Logger"

const logger = Logger.getInstance();

const useRooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        //const data = await getRooms();
        //setRooms(data);
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Error fetching rooms: ${err.message}`);
          setError(err.message);
        } else {
          logger.error("An unexpected error occurred while fetching rooms.");
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { rooms, loading, error };
};

export default useRooms;