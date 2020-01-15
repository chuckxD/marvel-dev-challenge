import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createHash } from 'crypto';
import { groupBy } from 'rambda';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardGroup,
  CardSubtitle,
  CardBody,
} from 'reactstrap';

import './App.css';

// TODO: break out single components or where we can pull out
function App() {

  const [comics, setComics] = useState({
    results: [],
  });

  useEffect(() => {
    const fetchComics = async () => {
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
        const result = await axios.get(url, { params })
          .then((resp) => {
            console.log(`RESPONSE: `, resp);
            if (resp.data && resp.data.data) {
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
      } catch (err) {
        console.log(`FETCH CHARS ERROR: `, err);
      }
    };
    fetchComics();
  }, []);

  return (
    <Container fluid="lg">
      <div>
        {console.log(comics.results)}
        {comics.results && comics.results.length > 0 ? (
          <>
            {comics.results.map(comicGroup => (
              <CardGroup>
                {comicGroup.map(comic => (
                  <Card key={comic.id}>
                    <CardBody>
                      <CardTitle>{comic.title}</CardTitle>
                      <CardImg
                        top
                        width="100%"
                        src={[comic.thumbnail.path, comic.thumbnail.extension].join('.')}
                        alt="Card image cap" />
                        <CardText>{comic.variantDescription}</CardText>
                        <Button>Button</Button>
                      </CardBody>
                    </Card>
                  ))}
              </CardGroup>
              ))}
          </>
          ) : (
            <span>no char results</span>
          )}
        </div>
      </Container>
  );
}

export default App;
