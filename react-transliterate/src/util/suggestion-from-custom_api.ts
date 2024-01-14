export const fetchSuggestionFromCustomApi = async (
  word: string,
  customApiURL: string,
  lang: string,
) => {
  const reqHeader = {
    "content-type": "application/json",
  };

  const url = `${customApiURL}/${lang}/${word}/`;

  const res = await fetch(url, {
    method: "GET",
    headers: reqHeader,
  });

  const response = await res.json();

  const targets = response?.output[0]?.target;
  const found = targets && targets.length > 0 ? [...targets, word] : [word];

  return found;
};
