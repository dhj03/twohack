import config from './config.json';

export default async function apiCall (route: string, method: string, body: object) {
  const url = `http://localhost:${config.BACKEND_PORT}${route}`;
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-type': 'application/json',
  }

  let response: Response;

  if (method === 'GET') {
    response = await fetch(url, { method, headers })
  } else {
    response = await fetch(url, { method, headers, body: JSON.stringify(body) })
  }

  const data = await response.json();

  if (data.error) {
    alert(data.error);
    console.log(data.error);
  }

  return data;
}
