import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import TracksBaseData from './data/tracks-base-data';
import { useBTTracksStore } from './store/blind-test-tracks-store';
import { usePlayerStore } from './store/player-store';

const PlaylistSelectionRow = (props: any) => {

  const btStore = useBTTracksStore();
  const playerStore = usePlayerStore();
  const [confirmationDisplayed, setConfirmationDisplayed] = useState(false);

  const selectPlaylist = async () => {
    if (Object.keys(playerStore.players).length > 0) {
      setConfirmationDisplayed(true);
    } else {
      loadPlaylist(false);
    }
  };

  const loadPlaylist = async (keepScores: boolean) => {
    if (!keepScores) {
      playerStore.clear();
    }
    let tracks = await new TracksBaseData(props.playlist).getPlaylistItems();
    btStore.setTracksFromRaw(tracks.filter(t => t.track.is_playable));
    btStore.backup();
  };

  const renderTickCross = (condition: boolean) => {
    if (condition) {
      return <FontAwesomeIcon icon={['far', 'check-circle']} size="1x" style={{ color: 'green' }} />;
    } else {
      return <FontAwesomeIcon icon={['far', 'times-circle']} size="1x" style={{ color: 'red' }} />;
    }
  };

  const MusicIcon = <FontAwesomeIcon icon={['fas', 'music']} />;

  let playlist = props.playlist;

  if (playlist.uri == null) return (
    <tr key={playlist.name}>
      <td>{MusicIcon}</td>
      <td>{playlist.name}</td>
      <td colSpan={2}>This playlist is not supported</td>
      <td>{renderTickCross(!playlist.public)}</td>
      <td>&nbsp;</td>
    </tr>
  );

  return (
    <>
      <Modal show={confirmationDisplayed} centered>
        <Modal.Body>
          Do you want to reset the leaderboard scores ?
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ width: '65px' }} size="sm" className="mr-2" onClick={() => loadPlaylist(false)}>
            <b>Yes</b>
          </Button>
          <Button style={{ width: '65px' }} size="sm" className="mr-2" onClick={() => loadPlaylist(true)}>
            <b>No</b>
          </Button>
          <Button style={{ width: '65px' }} size="sm" variant="secondary" onClick={() => setConfirmationDisplayed(false)}>
            <b>Cancel</b>
          </Button>
        </Modal.Footer>
      </Modal>

      <tr key={playlist.uri}>
        <td>{MusicIcon}</td>
        <td><a href={playlist.uri}>{playlist.name}</a></td>
        <td><a href={playlist.owner.uri}>{playlist.owner.display_name}</a></td>
        <td>{playlist.tracks.total}</td>
        <td>{renderTickCross(!playlist.public)}</td>
        <td className="text-right">
          <Button type="submit" variant="primary" onClick={selectPlaylist} className="text-nowrap btn-xs">
            <FontAwesomeIcon icon={['fas', 'play-circle']} size="sm" /> Select
          </Button>
        </td>
      </tr>
    </>
  );
};

export default PlaylistSelectionRow;
