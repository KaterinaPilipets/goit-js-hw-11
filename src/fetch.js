import axios from 'axios';
export async function createFetsh(value, page, perPage) {
  const resp = await axios.get(
    `https://pixabay.com/api/?key=32867517-775a58f450fa05e0fc64e3e7e&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
  console.log('resp.data', resp.data);
  return await resp.data;
}
