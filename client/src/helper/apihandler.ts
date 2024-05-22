import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const axiosInstance = axios.create();

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

async function fetchURL(
  fetchURL: string,
  requestType: "get" | "post" | "put" | "delete" | "patch",
  requestBody?: any
): Promise<any> {
  const headers = {
    "Content-Type": "application/json",
  };

  const requestConfig: AxiosRequestConfig = {
    url: fetchURL,
    method: requestType,
    headers,
    data: requestBody ? JSON.stringify(requestBody) : undefined,
  };

  try {
    const response = await axiosInstance(requestConfig);

    console.log("response", response);

    // Check if the response status is OK (2xx)
    if (response.status >= 200 && response.status < 300) {
      // Extract the data from the response and return it
      const data = response.data;
      return data;
    } else {
      // Handle non-2xx responses here
      throw new Error(
        `Error fetching data from the API: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error: any) {
    // Handle errors here
    console.error("Error:", error.message);

    // Check if the error is an Axios error
    if (error.isAxiosError) {
      // Handle specific Axios error cases
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", axiosError.response.data);
        console.error("Status code:", axiosError.response.status);
        console.error("Status text:", axiosError.response.statusText);
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error("No response received:", axiosError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", axiosError.message);
      }
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error);
    }

    // Return an error array or an appropriate error object
    return ["error"];
  }
}

export default fetchURL;
