import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useFetchSolarImagery = () => {
  return useMutation({
    mutationFn: ({
      date,
      type,
      wavelength,
    }: {
      date: Date;
      type: string;
      wavelength: string;
    }) => {
      return axios.get(
        `https://itsalwayssunnyinzakarpattyas18.azurewebsites.net/api/fetchimagebydateandtype?date=${date.toISOString()}&type=${type}&wavelength=${wavelength}`
      );
    },
  });
};
