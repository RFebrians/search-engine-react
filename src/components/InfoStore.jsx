import React, { Component } from "react";
import BooksDataService from "../api/BooksDataService";
import Clock from "react-live-clock";

/**
 * 
 * function InfoStore(props){
	
	const [searchTerm,setsearchTerm] = useState('');
	const [screen,setScreen] = useState ("default") ;
	const [selectedBook,setSelectedBook] = ("null") ;
	}
 */

/**
 * The Parent InfoStore Component
 *
 * The child components could have been moved into their separate files, but ..
 */
class InfoStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      screen: "default",
      selectedBook: null
    };
  }

  updateSearchTerm = (value) => {
    // Do Search in the parent component
    if (value !== "") {
      this.navigateToScreen("spinner", "spinner");
      // Rest API Call made here
      BooksDataService.searchWithTitle(value)
        .then((res) => {
          this.setState({
            searchTerm: value,
            books: res.data,
            selectedBook: null
          });
          this.navigateToScreen("results", "results");
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            searchTerm: value
          });
          this.navigateToScreen("error", "error");
        });
    }
  };

  showBookDetails = (bookData) => {
    this.setState({ selectedBook: bookData });
    this.navigateToScreen("details", "details");
  };

  backToResults = () => this.navigateToScreen("results", "results");

  navigateToScreen = (screenName, location) => {
    console.log(`navigateToScreen: ${screenName}`);
    this.setState({ screen: screenName });

    // TODO: add page name to history with something like
    // this.props.history.push("/" + location)
  };

  render() {
    return (
      <div className="InfoStore">
        <HeaderComponent />
        <SearchComponent updateSearchTerm={this.updateSearchTerm} />
        {
          // screen states are managed here, not the best solution
        }
        {this.state.screen === "results" && (
          <ResultsComponent
            result={this.state.books}
            searchTerm={this.state.searchTerm}
            showBookDetails={this.showBookDetails}
          />
        )}
        {this.state.screen === "details" && (
          <BookDetailsComponent
            selectedBook={this.state.selectedBook}
            backToResults={this.backToResults}
          />
        )}
        {this.state.screen === "default" && <DefaultComponent />}
        {this.state.screen === "spinner" && <SpinnerComponent />}
        {this.state.screen === "error" && (
          <ErrorComponent searchTerm={this.state.searchTerm} />
        )}

        <FooterComponent />
      </div>
    );
  }
}

/**
 * The Search Component
 */
class SearchComponent extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: ""
    };
  }

  onSearch = (e) => {
    console.log(`Search for ${this.state.searchTerm}`);
    this.props.updateSearchTerm(`${this.state.searchTerm}`);
  };

  handleSearchTerm = (e) => {
    this.setState({
      searchTerm: e.target.value
    });
  };

  render() {
    return (
      <section className="has-background-info is-bold top-rounded-container">
        <div className="hero container">
          <div className="hero-body">
            <div className="container">
              <div className="is-size-2 pt-2 has-text-weight-light">
                Entry Point
              </div>
              <div className="is-size-2 pb-2 has-text-weight-semibold">
                For Your Search Information
              </div>
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <input
                    type="text"
                    className="input is-medium is-flat"
                    placeholder="Search"
                    onChange={this.handleSearchTerm.bind(this)}
                  />
                </div>
                <div className="control">
                  <button
                    className="button is-medium is-primary"
                    onClick={this.onSearch.bind(this)}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class ResultsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: this.props.searchTerm,
      books: this.props.result
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.searchTerm !== state.searchTerm) {
      return {
        searchTerm: props.searchTerm,
        books: props.result
      };
    }
    return null;
  }

  render() {
    return (
      <section className="section container">
        <div className="container has-text-left is-fluid">
          <div className="columns is-multiline">
            {this.state.books.map((book) => (
              <div className="column is-half" key={book.card}>
                <CardComponent
                  book={book}
                  showBookDetails={this.props.showBookDetails}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

class CardComponent extends Component {
  onBuyClick = (event) => {
    window.open(this.props.book.infoLink, "_blank");
  };

  render() {
    return (
      <div className="box">
        <article className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img src={this.props.book.url} alt={this.props.book.title} />
            </figure>
          </div>
          <div className="media-content">
            <div className="content">
              <p>
                <strong>{this.props.book.title}</strong>{" "}
                <small>{this.props.book.nama}</small>
                <br />
                {this.props.book.lokasi} <br />
                {this.props.book.hari}
              </p>
              <button
                className="button mr-2"
                onClick={(event) => this.props.showBookDetails(this.props.book)}
              >
                More Details
              </button>
              <button
                className="button is-primary"
                onClick={(event) => this.onBuyClick(event)}
              >
                Visit
              </button>
            </div>
          </div>
        </article>
        {this.props.book.name}
      </div>
    );
  }
}

class BookDetailsComponent extends Component {
  render() {
    return (
      <section className="section container">
        <div className="content has-left-text is-clearfix">
          <button
            className="button is-text is-pulled-left"
            onClick={this.props.backToResults}
          >
            Back to Results
          </button>
        </div>
        <div className="container">
          <div className="columns">
            <div className="column is-half">
              <div className="media">
                <figure className="media-left">
                  <p className="image is-64x64">
                    <img
                      src={this.props.selectedBook.url}
                      alt={this.props.selectedBook.title}
                    />
                  </p>
                </figure>
                <div className="media-content pl-5">
                  <div className="content has-text-left">
                    <p>
                      <strong>{this.props.selectedBook.title}</strong> <br />
                      <br />
                      <strong>{this.props.selectedBook.nama}</strong>
                      <br />
                      <small>ID: {this.props.selectedBook.card}</small>
                      <br />
                      Lokasi: {this.props.selectedBook.lokasi} <br />
                      Hari: {this.props.selectedBook.hari} <br />
                      Jam : {this.props.selectedBook.waktu}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <p>{this.props.selectedBook.description}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

function HeaderComponent() {
  return (
    <header className="container pt-2 pb-2">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <p className="navbar-item">
            <img
              src="https://img.icons8.com/color/48/000000/downtown.png"
              alt="Information Access"
            />
          </p>

          <button
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div className="navbar-end is-uppercase has-text-weight-bold">
          <div className="navbar-item has-text-primary">Home</div>
          <div className="navbar-item">
            <img
              src="https://img.icons8.com/fluency/48/000000/home.png"
              alt="Search"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

class ErrorComponent extends Component {
  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="content has-text-left has-text-danger">
            <p>No results for "{this.props.searchTerm}"</p>
          </div>
        </div>
      </section>
    );
  }
}

function DefaultComponent() {
  return (
    <section className="section">
      <div className="container">
        <div className="is-size-5 pt-2 pb-2">Requesting Information...</div>
      </div>
    </section>
  );
}

function SpinnerComponent() {
  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-quarter has-text-centered">
            <div className="sk-chase">
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterComponent() {
  return (
    <footer className="footer has-background-info is-bold top-rounded-container">
      <div className="container">
        <div className="content has-text-left">
          <div className="columns">
            <div className="column">On Purpose for Testing</div>
            <div className="column">
              <Clock
                format={"HH:mm:ss"}
                ticking={true}
                timezone={"Jakarta/Asia"}
              />
              <br />
              Referensi : <br />
              https://jadwaldokter.xyz <br />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default InfoStore;
