/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { createHash } from 'crypto';
import axios from 'axios';
import { Container, Button } from 'reactstrap';
import ReactJson from 'react-json-view'
import { useParams, useHistory, Link } from 'react-router-dom';

function ComicDetail() {
  let { comicId } = useParams();
  let { history } = useHistory();
  // not sure why history isn't getting defined here
  console.log(history);

  const [loading, setLoading] = useState(true);
  const [comicDetail, setComicDetail] = useState({});

  const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

  const handleBackButton = (event) => {
    // console.log(`HISTORY: `, history);
    // history.push('/');
  }

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        const url = `http://gateway.marvel.com/v1/public/comics/${comicId}`
        const ts = Date.now();
        const priv = 'f764cb9a95988390829f551912def8b97f82eb24'
        const pub = '01e187b85a4ac8b9e8b26a9e632287bf'
        const hash = createHash('md5').update(ts + priv + pub ).digest('hex');
        let params = {
          ts,
          hash,
          apikey: pub,
        };

        setLoading(true);
        const result = await axios.get(url, { params })
          .then((resp) => {
            console.log(`RESPONSE: `, resp);
            if (resp.status === 200 && resp.data && resp.data.data) {
              return resp.data.data.results && resp.data.data.results.length > 0
                ? resp.data.data.results[0]
                : {};
            }
            return {};
          })
          .catch((err) => {
            console.log(`AXIOS ERROR: `, err);
          });

        console.log(`RESULT: `, result);

        setComicDetail(result);
        setLoading(false);
      } catch (err) {
        console.log(`FETCH CHARS ERROR: `, err);
      }
    };
    fetchComicDetail();
  }, [comicId]);

  return (
      <Container fluid="lg" className="container-lg-95">
        {!loading && !isEmpty(comicDetail) ? (
          <>
            {/*<Button onClick={handleBackButton}>Go back</Button>*/}
            <br />
            <Link to="/">Go back home</Link>
            <br />
            <br />
            <div>
              <ReactJson src={comicDetail} />
            </div>
          </>
          ) : (
            // TODO: ADD CASE FOR NO RESULTS
            <span>loading...</span>
          )}
      </Container>
    );
}

export default ComicDetail;
/* eslint-enable no-unused-vars */
