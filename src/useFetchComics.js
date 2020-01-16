// attmpt at doing custom hook, not working :(
import { useEffect, useState } from 'react';
import axios from 'axios';
import { createHash } from 'crypto';
import { groupBy } from 'rambda';

export const usefetchComics =  () => {
  try {
    const url = 'http://gateway.marvel.com/v1/public/comics'
    const ts = Date.now();
    const priv = 'f764cb9a95988390829f551912def8b97f82eb24'
    const pub = '01e187b85a4ac8b9e8b26a9e632287bf'
    const hash = createHash('md5').update(ts + priv + pub ).digest('hex');
    let params = {
      ts,
      hash,
      apikey: pub,
    };
    const [comics, setComics] = useState({
      results: [],
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        const result = await axios.get(url, { params })
        .then((resp) => {
          console.log(`RESPONSE: `, resp);
          if (resp.status === 200 && resp.data && resp.data.data) {
            const comics = resp.data.data.results.map((c, i) => ({ ...c, index: i }));
            const groupComicsByIndex = groupBy(comic => Math.floor(comic.index / 4));
            // console.log(`what are u`, [...Object.values(groupComicsByIndex(comics))]);
            return {
              ...resp.data.data,
              results: [...Object.values(groupComicsByIndex(comics))],
            };
          }
          return {};
        })
        .catch((err) => {
          console.log(`AXIOS ERROR: `, err);
        });

        console.log(`RESULT: `, result);

        setComics(result);
      }
      fetchData();
    }, []);
    return {
      loading,
      comics,
    };

  } catch (err) {
    console.log(`FETCH CHARS ERROR: `, err);
  }
};
