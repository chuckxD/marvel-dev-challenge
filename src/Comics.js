import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createHash } from 'crypto';
import { groupBy } from 'rambda';
import {
  Container,
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardGroup,
  CardBody,
  FormGroup,
  Form,
  Label,
  Input,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';

import './Comics.css';

// TODO: break out single components or where we can pull out
function Comics() {
  let history = useHistory();
  console.log(history);

  const [comics, setComics] = useState({
    results: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchByTitle, setSearchByTitle] = useState('');
  const [searchByTitleFormInput, setSearchByTitleFormInput] = useState('');

  const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

  const handleNavigateDetail = (event) => {
    event.preventDefault();
    console.log(event.target);
    history.push(`/comic-detail/${event.target.id}`)
  }

  const handleSearchByTitleSubmit = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setSearchByTitle(searchByTitleFormInput);
  }

  const handleSearchByTitleReset = (event) => {
    event.preventDefault();
    setSearchByTitleFormInput('');
    setSearchByTitle('');
  }

  const handleSearchByTitleOnChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setSearchByTitleFormInput(event.target.value);
  }

  // this should get pulled out as a custom hook
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
          ...(!isEmpty(searchByTitle) && { titleStartsWith: searchByTitle }),
        };

        setLoading(true);
        const result = await axios.get(url, { params })
          .then((resp) => {
            console.log(`RESPONSE: `, resp);
            if (resp.data && resp.data.data) {
              const comics = resp.data.data.results.map((c, i) => ({ ...c, index: i }));
              // bad bad bad, just learn to flex dummy
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
        setLoading(false);
      } catch (err) {
        console.log(`FETCH CHARS ERROR: `, err);
      }
    };
    fetchComics();
  }, [searchByTitle]);

  return (
    <Container fluid="lg">
        <Form onSubmit={handleSearchByTitleSubmit}>
          <FormGroup>
            <Label for="searchInput">Search Comics</Label>
            <Input
              type="searchInput"
              name="searchInput"
              id="searchInput"
              placeholder="Comic titles"
              value={searchByTitleFormInput}
              onChange={handleSearchByTitleOnChange}/>
            <Button
              color="secondary"
              size="lg"
              style={{ marginRight: '20px', marginTop: '10px' }}
              onClick={handleSearchByTitleSubmit}>Search Comics</Button>
              <Button
                color="secondary"
                size="lg"
                style={{ marginTop: '10px' }}
                onClick={handleSearchByTitleReset}>Reset</Button>
          </FormGroup>
        </Form>
        {!loading && comics && comics.results && comics.results.length > 0 ? (
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
                        alt="Card image cap"
                        className="Comics-comicImage"
                        id={comic.id}
                        onClick={handleNavigateDetail}
                      />
                        <CardText>{comic.variantDescription}</CardText>
                        <Button id={comic.id} onClick={handleNavigateDetail}>Comic Details</Button>
                      </CardBody>
                    </Card>
                  ))}
              </CardGroup>
              ))}
          </>
          ) : (
            // TODO: ADD CASE FOR NO RESULTS
            <span>loading...</span>
          )}
      </Container>
  );
}

export default Comics;
