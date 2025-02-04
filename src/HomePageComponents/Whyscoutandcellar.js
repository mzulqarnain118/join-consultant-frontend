import React from "react";
import ScoutCellar from "../Assets/images/scout-cellar.png";
import ChrisHite from "../Assets/images/ChrisHite.jpg";
class Whyscoutandcellar extends React.Component {
  render() {
    return (
      <>
        <section className="whyscout position-relative" ref={this.myRef}>
          <section className="consult-rgt-dts">
            <figure className="consult-img">
              <img
                src={ChrisHite}
                className="img-fluid"
                alt="consult-profile"
              />
              <p>
                <sup className="topqt">‘</sup>I love working as part of an
                entrepreneurial company that offers huge growth opportunities
                and flexibility. If you are looking for an opportunity to be
                part of something truly different and help pioneer a new way for
                people to experience wine, then join us!
                <sup className="btmqt">’</sup>
              </p>
              <h5>Chris Hite</h5>
            </figure>
          </section>
          <section className="container p-0">
            <h2 className="text-uppercase text-center">
              Why Scout &amp; Cellar <sup>&#8482;</sup> ?
            </h2>
            <section className="row d-flex flex-row m-0 justify-content-start align-items-start">
              <aside className="col-lg-6 col-md-6 col-12 p-0">
                <h3>
                  Clean-Crafted<sup>&#8482;</sup>Commitment
                </h3>
                <ul>
                  <li>We use healthy soil.</li>
                  <li>
                    Which produces healthy fruit with authentic, distinctive
                    flavors.{" "}
                  </li>
                  <li>The result? Delicious wine!</li>
                </ul>
                <h3>A Community of Wine Lovers Working Together</h3>
                <h3>Doing Better for the World Around Us</h3>
                <ul>
                  <li>
                    To Everything we do, we do it with the world around us in
                    mind. We want to protect the earth we live on for ourselves
                    and future generations.
                  </li>
                </ul>
                <h3>We are Growing Fast</h3>
                <ul>
                  <li>
                    Scout &amp; Cellar has continued to grow exponentially
                    year-over-year. Come join us as we continue to grow!
                  </li>
                </ul>
              </aside>
              <aside className="col-lg-6 col-md-6 col-12 p-0">
                <img src={ScoutCellar} alt="" className="img-fluid" />
              </aside>
            </section>
          </section>
        </section>
      </>
    );
  }
}

export default Whyscoutandcellar;
