import { AxiosInstance } from "axios";
export const getConnections = async (client: AxiosInstance) => {
  try {
    const response = await client.get('/connection')
    console.log(response.data)
    return response.data
  }
  catch (e) {
    console.log("error " + e)
  }
}
