import React, {PureComponent} from 'react';

export default class CityInfo extends PureComponent {

  render() {
    const {info} = this.props;
    // const displayName = `${info.city}, ${info.state}`;
    const displayName = `${info.plant}`;

    return (
      <div>
        <div>
          {displayName} 
          <br />
          {info.address}, {info.zipcode} <br />
          description: {info.description} <br />
          likes: {info.likes}
          {/* | <a target="_new"
          href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${displayName}`}>
            Wikipedia
          </a> */}
        </div>
        <img width={240} src={info.imagelink} />
      </div>
    );
  }
}
