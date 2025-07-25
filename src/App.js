import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import * as S from './components/styled-components';
import { LoadChannels } from './components/load-channels';

function App() {

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentChannelUrl, setCurrentChannelUrl] = useState('');
  const videoRef = useRef(null);
  const [previewChannel, setPreviewChannel] = useState(null);
  const previewTimeoutRef = useRef(null);
  const previewRef = useRef(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    if (previewChannel && previewRef.current) {
      const video = previewRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(previewChannel.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((e) => {
            console.warn('Autoplay bloqueado:', e);
          });
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
          console.error('Preview HLS error:', data);
          if (data.fatal) hls.destroy();
        });

        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = previewChannel.url;
        video.play().catch((e) => console.warn('Autoplay bloqueado:', e));
      }
    }
  }, [previewChannel]);








  useEffect(() => {
    const video = videoRef.current;
    if (video && currentChannelUrl) {
      if (Hls.isSupported()) {
        let hls = new Hls();
        hls.loadSource(currentChannelUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play();
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
          console.error('HLS.js error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.recoverMediaError();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
            setError('Erro ao carregar o canal. Tente novamente.');
          }
        });
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {

        video.src = currentChannelUrl;
        video.play();
      } else {
        setError('Seu navegador não suporta streaming HLS (m3u8).');
      }
    }
  }, [currentChannelUrl]);


  const grouped = channels.reduce((acc, ch) => {
    const grp = ch.group || 'Outros';
    if (!acc[grp]) acc[grp] = [];
    acc[grp].push(ch);
    return acc;
  }, {});

  return (
    <S.Container>

      {!channels.length > 0 && (
        <LoadChannels setChannels={setChannels} setLoading={setLoading} setError={setError} loading={loading} error={error} />
      )}


      {channels.length > 0 && (
        <>
          <S.Group>
            {Object.entries(grouped).map((e, i) => <S.Button onClick={() => setSelectedGroup(e[0])} key={i + e[0]}>{e[0]}/</S.Button>)};

          </S.Group>
          <S.SubGroup>
            {Object.entries(grouped).map(([group, chs], i) => (
              selectedGroup === group && (
                chs.map((ch, j) => (
                  <S.Button
                    key={ch.url + j}
                    onClick={() => {
                      setCurrentChannelUrl(ch.url);
                      setTimeout(() => {
                        videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }}
                    onMouseEnter={() => {
                      previewTimeoutRef.current = setTimeout(() => {
                        setPreviewChannel(ch);
                      }, 500);
                    }}
                    onMouseLeave={() => {
                      clearTimeout(previewTimeoutRef.current);
                      setPreviewChannel(null);
                    }}
                  >
                    {ch.name}
                  </S.Button>

                ))
              )))
            }
          </S.SubGroup>
          <S.PlayerWrapper>
            {currentChannelUrl && (<S.Player ref={videoRef} controls autoPlay muted={!currentChannelUrl} />)}


            {!currentChannelUrl && <S.PlayerPlaceholder >Selecione um canal para começar</S.PlayerPlaceholder>}

            {currentChannelUrl && (
              <div className="hero-content">
                <h2>Reproduzindo: {channels.find(c => c.url === currentChannelUrl)?.name || 'Canal'}</h2>
              </div>
            )}
          </S.PlayerWrapper>
        </>
      )}


      {/* {previewChannel && (
        <div className="channel-preview">
          <video
            ref={previewRef}
            muted
            playsInline
            autoPlay
            loop
            className="preview-video"
          />
          <span className="preview-title">{previewChannel.name}</span>
        </div>
      )}
      // {!channels.length > 0 && (
      //   <div className="m3u-input-section">
      //     <h1>Bem-vindo ao IPTFLIX!</h1>
      //     <p>Insira a URL da sua lista de canais M3U:</p>
      //     <div className="input-group">
      //       <input
      //         type="text"
      //         value={m3uUrl}
      //         onChange={(e) => setM3uUrl(e.target.value)}
      //         placeholder="Ex: http://seuservidor.com/lista.m3u"
      //       />
      //       <button onClick={loadM3uList} disabled={loading}>
      //         {loading ? 'Carregando...' : 'Carregar Canais'}
      //       </button>
      //     </div>
      //     {error && <p className="error-message">{error}</p>}
      //   </div>
      // )}



      {channels.length > 0 && (
        <div className="main-content">
          <header className="header">
            <div className="logo">IPTFLIX</div>
            <section className="hero">
              <div className="video-player-container">
                <video ref={videoRef} controls autoPlay muted={!currentChannelUrl}></video>
                {!currentChannelUrl && <div className="placeholder-video">Selecione um canal para começar</div>}
              </div>
              {currentChannelUrl && (
                <div className="hero-content">
                  <h2>Reproduzindo: {channels.find(c => c.url === currentChannelUrl)?.name || 'Canal'}</h2>
                </div>
              )}
            </section>

          </header>

          <section className="content-row">
            {Object.entries(grouped).map(([group, chs],i) => (
              <ChannelRow
                key={group + i}
                title={group}
                channels={chs}
                onSelect={setCurrentChannelUrl}
                videoRef={videoRef}
                setPreviewChannel={setPreviewChannel}
                previewTimeoutRef={previewTimeoutRef}
              />
            ))}
          </section>
        </div>
      )} */}



    </S.Container>
  );
}

export default App;