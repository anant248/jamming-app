import React from "react";
import './TrackList.css';

import Track from "../Track/Track";

class TrackList extends React.Component {
    render() {
        return(
            <div className="TrackList">
                {
                    this.props.tracks.map(track => {
                        return <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/> /* creates + or - symbol depending on the props the track has */
                    })
                }
            </div>
        )
    }
}

export default TrackList;