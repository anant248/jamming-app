import React from "react";
import './Track.css';

class Track extends React.Component {
    constructor(props) {
        super(props);

        // binding methods to the current value of this
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
    
    addTrack() {
        this.props.onAdd(this.props.track); // checks if the passed in track is already added or not
    }

    removeTrack() {
        this.props.onRemove(this.props.track); // checks if passed in track  can be removed or not
    }

    renderAction() {
        if (this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>  // display - button if track is able to be removed
        } else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>  // display + is the song is able to be added
        }
    }

    render() {
        return(
            <div className="Track">
              <div className="Track-information">
                <h3>{this.props.track.name}</h3>
                <p>{this.props.track.artist} | {this.props.track.album}</p> {/* displaying of the track on the results pane */}
              </div>
              {this.renderAction()} {/* determines if the song can be added or removed */}
            </div>
        )
    }
}

export default Track;