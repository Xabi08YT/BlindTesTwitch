import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { getDevices } from 'services/spotify-api';
import { useGlobalStore } from './store/global-store';
import { TwitchMode, useSettingsStore } from './store/settings-store';

const Settings = () => {

  const navigate = useNavigate();

  const settingsStore = useSettingsStore();
  const globalStore = useGlobalStore();

  const [validated, setValidated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [chatNotifications, setChatNotifications] = useState<boolean>(settingsStore.chatNotifications);
  const [addEveryUser, setAddEveryUser] = useState<boolean>(settingsStore.addEveryUser);
  const [acceptanceDelay, setAcceptanceDelay] = useState<number>(settingsStore.acceptanceDelay);
  const [scoreCommandMode, setScoreCommandMode] = useState<any>(settingsStore.scoreCommandMode);
  const [previewGuessNumber, setPreviewGuessNumber] = useState<boolean>(settingsStore.previewGuessNumber);

  useEffect(() => {
    globalStore.setSubtitle('Settings');
    getDevices().then(response => {
      setDevices(response.data.devices);
      const found = response.data.devices.find((d: any) => d.id === settingsStore.deviceId);
      if (found) {
        setSelectedDevice(found.id);
      }
      setInitialized(true);
    });
  }, []);

  const submit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.checkValidity() === true) {
      settingsStore.update({
        deviceId: selectedDevice,
        addEveryUser: addEveryUser,
        chatNotifications: chatNotifications,
        previewGuessNumber: previewGuessNumber && acceptanceDelay > 0,
        acceptanceDelay: acceptanceDelay,
        scoreCommandMode: scoreCommandMode,
      });
      navigate('/');
    }
    setValidated(true);
  };

  if (initialized) {
    return (
      <div style={{ width: '600px', margin: 'auto' }} className="mb-3">
        <Form noValidate validated={validated} onSubmit={submit}>

          <h3>Global</h3>

          <Form.Group className="mb-3" controlId="formGroupDevice">
            <Form.Label>Spotify playing device</Form.Label>
            <Form.Select required className="form-control" value={selectedDevice} onChange={(e) => { setSelectedDevice(e.target.value); }}>
              <option value="">Select device...</option>
              {devices.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.type})</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupAcceptance">
            <Form.Label>Answer acceptance delay</Form.Label>
            <Form.Range onChange={(e) => setAcceptanceDelay(e.target.valueAsNumber)} value={acceptanceDelay} style={{ width: '100%' }} min={0} max={20} />
            <Form.Label style={{ width: '100%', textAlign: 'center', marginTop: '-10px' }}><i>{acceptanceDelay} second{acceptanceDelay > 1 ? 's' : ''}</i></Form.Label>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPreviewGuessNumber">
            <Form.Check disabled={acceptanceDelay === 0} type="checkbox" checked={previewGuessNumber && acceptanceDelay > 0} label="Preview the number of guesses during the acceptance delay" onChange={(e) => { setPreviewGuessNumber(e.target.checked); }} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupAddEveryUser">
            <Form.Check type="checkbox" checked={addEveryUser} label="Add every speaking viewer in the leaderboard (can impact performance with very large audiences)" onChange={(e) => { setAddEveryUser(e.target.checked); }} />
          </Form.Group>

          <br></br>
          <h3>Twitch integration</h3>

          <Form.Group className="mb-3" controlId="formGroupScoreCommandMode">
            <Form.Label>Score command mode (<i>!score</i>)</Form.Label>
            <Form.Select required className="form-control" value={scoreCommandMode} onChange={(e) => { setScoreCommandMode(+(e.target.value)); }}>
              <option value={TwitchMode.Disabled}>Disabled</option>
              <option value={TwitchMode.Channel}>The bot will respond in the channel</option>
              <option value={TwitchMode.Whisper}>The bot will respond in DM</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupChatNotifications">
            <Form.Check type="checkbox" checked={chatNotifications} label="Channel notifications (display guesses in the chat)" onChange={(e) => { setChatNotifications(e.target.checked); }} />
          </Form.Group>

          <Button style={{ width: '80px' }} size="sm" className="mr-2" variant="primary" type="submit">
            <b>Save</b>
          </Button>
          <Button disabled={!settingsStore.isInitialized()} style={{ width: '80px' }} size="sm" className="mx-2" variant="secondary" onClick={() => navigate('/')}>
            <b>Cancel</b>
          </Button>
        </Form>
      </div>
    );
  } else {
    return <div className="spinner"></div>;
  }
};

export default Settings;
