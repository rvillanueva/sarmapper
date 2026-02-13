import React from 'react';
import './subscribe.css';

export default class Subscribe extends React.Component {
  constructor() {
    super();
    this.state = {
      email: ''
    };
  }
  handleEmailChange(value) {
    this.setState({
      email: value
    });
  }
  render() {
    return <div className="subscribe-section">
      <div className="subscribe-section__cta">{`Sign up below to hear about feature releases.`}</div>
      <div id="mc_embed_signup">
        <form action="https://sarmapper.us20.list-manage.com/subscribe/post?u=65b955fa7c92f8be66eec94cc&amp;id=b2b2fef9ac" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
          <div id="mc_embed_signup_scroll">
            <input type="email" value={this.state.email} onChange={e => this.handleEmailChange(e.target.value)} name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required />
            <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true"><input type="text" name="b_65b955fa7c92f8be66eec94cc_b2b2fef9ac" tabIndex="-1" defaultValue="" /></div>
            <div className="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" /></div>
          </div>
        </form>
      </div>
    </div>
  }
}
